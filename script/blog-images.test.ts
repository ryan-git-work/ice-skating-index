import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createServer } from "node:http";
import express from "express";
import { registerRoutes } from "../server/routes.ts";

const mapPath = path.resolve("client/public/data/post-image-map.json");
const imageDir = path.resolve("client/public/images/skating");

async function withServer(run: (url: string) => Promise<void>) {
  const app = express();
  const server = createServer(app);
  await registerRoutes(server, app);
  server.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close(error => error ? reject(error) : resolve()),
    );
  }
}

async function getImage(url: string, slug: string): Promise<string> {
  const response = await fetch(`${url}/api/blog/image/${slug}`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(typeof body.image, "string");
  return body.image;
}

test("Concurrent blog image requests preserve all six reviewed assignments and the source map", async () => {
  const before = await fs.readFile(mapPath);
  const reviewed: Record<string, string> = JSON.parse(before.toString());
  assert.equal(Object.keys(reviewed).length, 6);
  const files = new Set(await fs.readdir(imageDir));
  const slugs = [...Object.keys(reviewed), ...Array.from({ length: 40 }, (_, i) => `image-test-${i}`)];

  await withServer(async url => {
    const results = await Promise.all(
      slugs.flatMap(slug => Array.from({ length: 5 }, async () => ({
        slug, image: await getImage(url, slug),
      }))),
    );
    const assignments = new Map<string, string>();
    for (const { slug, image } of results) {
      assert.ok(files.has(image), `Missing image: ${image}`);
      if (reviewed[slug]) assert.equal(image, reviewed[slug]);
      if (assignments.has(slug)) assert.equal(image, assignments.get(slug));
      assignments.set(slug, image);
    }
    for (const [slug, image] of assignments) assert.equal(await getImage(url, slug), image);
    assert.ok((await fs.readFile(mapPath)).equals(before), "Requests changed the tracked map");
    assert.deepEqual(JSON.parse((await fs.readFile(mapPath)).toString()), reviewed);
  });

  // A new server still honors the reviewed assignments, without persisting the
  // additional process-local assignments into source.
  await withServer(async url => {
    for (const [slug, image] of Object.entries(reviewed)) assert.equal(await getImage(url, slug), image);
  });
  assert.ok((await fs.readFile(mapPath)).equals(before));
});

test("Malformed maps fail explicitly without being overwritten", async () => {
  const originalCwd = process.cwd();
  const fixture = await fs.mkdtemp(path.join(os.tmpdir(), "isi-blog-images-"));
  const dataDir = path.join(fixture, "client/public/data");
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(path.join(fixture, "client/public/images/skating"), { recursive: true });
  const fixtureMap = path.join(dataDir, "post-image-map.json");
  const malformed = "{invalid reviewed map";
  await fs.writeFile(fixtureMap, malformed);
  process.chdir(fixture);
  try {
    await withServer(async url => {
      const responses = await Promise.all(
        Array.from({ length: 8 }, () => fetch(`${url}/api/blog/image/unknown-post`)),
      );
      for (const response of responses) {
        assert.equal(response.status, 500);
        assert.deepEqual(await response.json(), { error: "Failed to assign image" });
      }
      assert.equal(await fs.readFile(fixtureMap, "utf8"), malformed);
    });
  } finally {
    process.chdir(originalCwd);
    await fs.rm(fixture, { recursive: true, force: true });
  }
});
