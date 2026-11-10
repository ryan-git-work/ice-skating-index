import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

// Render the complete blog index in fresh processes, including its actual date
// formatter. Date-only metadata must not shift between local build and hosting.
const code = `import { render } from './dist/ssr/entry-ssr.js'; console.log(render('/blog').html);`;
const render = tz => execFileSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', env: { ...process.env, TZ: tz }, maxBuffer: 5 * 1024 * 1024 });
test('Blog publication dates and the entire index are timezone-independent', () => {
  const utc = render('UTC');
  for (const zone of ['America/Chicago', 'America/Los_Angeles', 'Pacific/Honolulu', 'Pacific/Kiritimati']) assert.equal(render(zone), utc, zone);
  assert.match(utc, /March 12, 2026/);
});
