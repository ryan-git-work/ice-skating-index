import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Exercise the production-rendered markup, including JSX compilation and the
// shared Input/Label components, rather than matching source syntax.
const home = await readFile(new URL("../dist/public/index.html", import.meta.url), "utf8");
const browse = await readFile(new URL("../dist/public/browse/index.html", import.meta.url), "utf8");

function attribute(tag, name) {
  return tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}

test("rendered city cards defer image loading without changing the source", () => {
  const images = [...home.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  const nashville = images.find(tag => attribute(tag, "src") === "/attached_assets/iceskatingindex1_1766179636449.jpg");
  assert.ok(nashville, "existing Nashville image remains in the card");
  assert.equal(attribute(nashville, "loading"), "lazy");
  assert.equal(attribute(nashville, "decoding"), "async");
  assert.ok(Number(attribute(nashville, "width")) > 0);
  assert.ok(Number(attribute(nashville, "height")) > 0);
});

test("rendered session example cannot be mistaken for current availability", () => {
  assert.match(home, /Example schedule/);
  assert.match(home, /Illustrative only/);
  assert.match(home, /sample price/);
  assert.doesNotMatch(home, /Session Available/);
});

test("rendered Browse search has an associated nonempty label", () => {
  const input = [...browse.matchAll(/<input\b[^>]*>/g)].map(match => match[0])
    .find(tag => attribute(tag, "placeholder") === "Search by rink, city, or state");
  assert.ok(input, "search input renders");
  const id = attribute(input, "id");
  assert.ok(id);
  const label = [...browse.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/g)]
    .find(match => attribute(match[1], "for") === id);
  assert.ok(label, "search has a matching label");
  assert.match(label[2], /Search rinks by name, city, or state/);
});
