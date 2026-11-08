import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('Distance generator excludes null coordinates without treating them as zero', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'isi-geo-'));
  const target = path.join(dir, 'client/src/data/rinks.json');
  const fixtures = [
    ['valid-zero', { latitude: 0, longitude: 0 }],
    ['valid-other', { latitude: 1, longitude: 1 }],
    ['null-both', { latitude: null, longitude: null }],
    ['null-lat', { latitude: null, longitude: 0 }],
    ['null-lon', { latitude: 0, longitude: null }],
    ['missing-coordinates', {}],
  ].map(([slug, geo]) => ({ slug, name: slug, geo, address: { city: 'Fixture', state: 'TN' }, nearby_rinks: [] }));
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    const input = JSON.stringify(fixtures);
    await fs.writeFile(target, input);
    const result = spawnSync(process.execPath, [path.resolve('script/generate-nearby-rinks.mjs'), '--dry-run'], { cwd: dir, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Eligible as link targets:\s+2 /);
    assert.match(result.stderr, /4 rinks have no usable coordinates/);
    const sample = result.stdout.split('Sample:')[1];
    assert.match(sample, /valid-zero/);
    assert.doesNotMatch(sample, /null-both|null-lat|null-lon|missing-coordinates/);
    assert.equal(await fs.readFile(target, 'utf8'), input, 'Dry run must not mutate records');
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
