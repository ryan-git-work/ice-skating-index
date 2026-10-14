import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'node:http';
import express from 'express';
import { serveStatic } from '../server/static.ts';

async function fixture(run: (url: string) => Promise<void>) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'isi-static-'));
  const routes = ['services/skate-sharpening', 'blog/how-much-does-ice-skating-cost', 'blog/the-lab-hockey-franklin-tn', 'state/tn', 'city/tn/franklin'];
  for (const route of ['', ...routes]) {
    await fs.mkdir(path.join(dir, route), { recursive: true });
    await fs.writeFile(path.join(dir, route, 'index.html'), `<h1>${route || 'Home'}</h1>`);
  }
  await fs.mkdir(path.join(dir, 'assets'));
  await fs.writeFile(path.join(dir, 'assets/app.js'), 'asset control');
  await fs.writeFile(path.join(dir, '404.html'), '<h1>Not found</h1>');
  const app = express(); serveStatic(app, dir);
  const server = createServer(app);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address(); assert.ok(address && typeof address === 'object');
  try { await run(`http://127.0.0.1:${address.port}`); }
  finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); await fs.rm(dir, { recursive: true, force: true }); }
}
for (const method of ['GET', 'HEAD']) test(`${method}: known page aliases redirect once with exact queries`, async () => fixture(async url => {
  for (const route of ['/services/skate-sharpening', '/blog/how-much-does-ice-skating-cost', '/blog/the-lab-hockey-franklin-tn', '/state/tn', '/city/tn/franklin']) {
    for (const suffix of ['/', '///']) {
      const query = '?source=guide&next=%2Fblog%2F&term=a+b';
      const response = await fetch(url + route + suffix + query, { method, redirect: 'manual' });
      assert.equal(response.status, 301); assert.equal(response.headers.get('location'), route + query);
      const target = await fetch(url + response.headers.get('location'), { method, redirect: 'manual' });
      assert.equal(target.status, 200); assert.equal(target.headers.get('location'), null);
      if (method === 'HEAD') assert.equal(await target.text(), '');
      else assert.ok((await target.text()).includes(route.slice(1)));
    }
  }
}));
test('Canonical pages, home, assets and 404 controls retain behavior', async () => fixture(async url => {
  for (const route of ['/', '/state/tn', '/assets/app.js']) {
    const response = await fetch(url + route, { redirect: 'manual' });
    assert.equal(response.status, 200); assert.equal(response.headers.get('location'), null);
    if (route.startsWith('/assets/')) assert.ok(response.headers.get('cache-control')?.includes('immutable'));
  }
  for (const route of ['/missing/', '/assets/', '/assets/app.js/', '/state/not-real/']) {
    const response = await fetch(url + route, { redirect: 'manual' });
    assert.equal(response.status, 404); assert.equal(response.headers.get('location'), null);
  }
}));
test('POST and authority-like or encoded paths do not gain redirects', async () => fixture(async url => {
  const post = await fetch(url + '/state/tn/', { method: 'POST', redirect: 'manual' }); assert.equal(post.headers.get('location'), null);
  for (const route of ['//state/tn/', '/%2f%2fevil.example/', '/%2e%2e/outside/']) {
    const response = await fetch(url + route, { redirect: 'manual' }); assert.equal(response.headers.get('location'), null);
  }
}));
