import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rinks = JSON.parse(await readFile('client/src/data/rinks.json', 'utf8'));
for (const value of [true, 'true', false, 'unknown']) {
  const controls = rinks.filter(rink => rink.freestyle.available === value && !['closed', 'coming_soon'].includes(rink.operating_status));
  test(`Rendered freestyle availability respects ${JSON.stringify(value)}`, async () => {
    assert.ok(controls.length, `Missing ${value} fixture`);
    for (const rink of controls) {
      const html = await readFile(`dist/public/rink/${rink.slug}/index.html`, 'utf8');
      const section = html.match(/<section id="freestyle"[^>]*>([\s\S]*?)<\/section>/)?.[1];
      assert.ok(section, rink.slug);
      if (value === true || value === 'true') {
        assert.match(section, /This facility offers dedicated freestyle ice time/, rink.slug);
      } else {
        assert.doesNotMatch(section, /This facility offers dedicated freestyle ice time/, rink.slug);
        assert.match(section, /No specific freestyle sessions listed for this facility/, rink.slug);
        assert.doesNotMatch(section, /not offered|does not offer/i, rink.slug);
      }
    }
  });
}
