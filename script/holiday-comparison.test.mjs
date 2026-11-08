import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const records = JSON.parse(await readFile('client/src/data/rinks.json', 'utf8'));
const slug = 'smashville-ice-rink-at-zoolumination-nashville-tn';
const zoo = records.find(r => r.slug === slug);
const html = async route => (await readFile(`dist/public/${route}/index.html`, 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
const main = body => body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const schemas = body => [...body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));

test('Smashville keeps canonical identity while correcting Zoo address and unsupported data', () => {
  assert.equal(zoo.id, `tn-nashville-${slug}`);
  assert.equal(zoo.name, 'Smashville Ice Rink at Nashville Zoo');
  assert.deepEqual(zoo.address, { street: '3777 Nolensville Pike', city: 'Nashville', state: 'TN', postal_code: '37211', country: 'US' });
  assert.deepEqual(zoo.geo, { latitude: null, longitude: null });
  assert.equal(zoo.website, 'https://www.nashvillezoo.org/glow-wild');
  assert.ok(!zoo.tags.includes('downtown'));
  assert.equal(zoo.facility.number_of_sheets, null);
  for (const key of ['learn_to_skate', 'figure_skating', 'hockey', 'open_hockey', 'stick_and_puck']) assert.equal(zoo.offerings[key], 'unknown');
  assert.equal(zoo.freestyle.available, 'unknown');
  assert.equal(zoo.sharpening.available, 'unknown');
  assert.equal(records.filter(r => /rink-under-broad/.test(r.slug)).length, 0);
});

test('Zoo prices remain advertised membership add-ons with no false adult or base-price tiers', () => {
  assert.equal(typeof zoo.pricing.public_skate, 'string');
  assert.match(zoo.pricing.public_skate, /Advertised skating add-on/);
  assert.match(zoo.pricing.public_skate, /\$12 per skater for nonmembers, \$10 for Zoo members/);
  assert.match(zoo.pricing.public_skate, /separate Glow Wild event admission/);
  assert.match(zoo.pricing.public_skate, /Not a checkout total/);
  assert.equal(zoo.pricing.admission_tiers, undefined);
  assert.equal(zoo.pricing.verified_on, '2026-11-08');
  assert.equal(zoo.last_verified, '2026-05-23');
  assert.equal(zoo.rentals.included_with_admission, 'unknown');
  assert.match(zoo.pricing.notes, /45-minute sessions/);
  assert.match(zoo.pricing.notes, /older template text/);
  assert.match(zoo.seasonal_notes, /event dates are not skating dates/);
});

test('Initial rink HTML and schema agree on corrected identity and scoped evidence', async () => {
  const body = await html(`rink/${slug}`);
  const data = schemas(body);
  const rink = data.find(s => Array.isArray(s['@type']) && s['@type'].includes('SportsActivityLocation'));
  assert.equal(rink.address.streetAddress, '3777 Nolensville Pike');
  assert.equal(rink.address.postalCode, '37211');
  assert.equal(rink.geo, undefined);
  assert.equal(rink.url, `https://iceskatingindex.com/rink/${slug}`);
  const page = data.find(s => s['@type'] === 'WebPage');
  assert.equal(page.lastReviewed, '2026-05-23');
  assert.equal(page.dateModified, '2026-11-08');
  assert.match(body, /Full record last reviewed: May 23, 2026/);
  assert.match(main(body), /Advertised skating add-on/);
  assert.doesNotMatch(main(body), /From \$12|Base admission verified November 8|tighter than feels natural|Nothing moved; the record did|surface would not hold up/);
  assert.match(body, /skating sessions not verified/);
  assert.match(main(body), /No specific freestyle sessions listed for this facility/);
  assert.match(main(body), /minimum skating age of 3/);
  assert.match(main(body), /free for members and passholders/);
});

for (const route of ['browse', 'city/tn/nashville', 'state/tn']) test(`Directory initial HTML and structured address use Zoo identity: ${route}`, async () => {
  const body = await html(route);
  assert.match(body, /Smashville Ice Rink at Nashville Zoo/);
  assert.doesNotMatch(body, />Smashville Ice Rink at Zoolumination</);
  const lists = schemas(body).filter(s => s['@type'] === 'ItemList');
  const entry = lists.flatMap(s => s.itemListElement || []).find(s => s.item?.url?.endsWith(slug));
  assert.ok(entry, route);
  assert.equal(entry.item.address.streetAddress, '3777 Nolensville Pike');
  assert.equal(entry.item.address.postalCode, '37211');
});

test('Seasonal comparison preserves different duration, rental, fee and booking bases', async () => {
  const body = main(await html('blog/ice-skating-cost-nashville'));
  const section = body.slice(body.indexOf('Holiday Rinks: What the Ticket Actually Covers'), body.indexOf('How Much Do Learn-to-Skate Lessons Cost in Nashville?'));
  assert.match(section, /Unlimited that day, wristband for re-entry/);
  assert.match(section, /120 minutes/);
  assert.match(section, /Described as 45 minutes; confirm/);
  assert.match(section, /inclusion unverified/);
  assert.match(section, /tax included/);
  assert.match(section, /Pay at the gate/);
  assert.match(section, /Advance online only; no box office; parking extra/);
  assert.match(section, /parking unless you are a member or passholder/);
  assert.match(section, /checkout fees, which were not checked/);
  assert.match(section, /event dates are not skating dates/);
  for (const url of ['https://fountainswinterfest.com/', 'https://tickets.gaylordopryland.com/eventperformances.asp?evt=18', 'https://www.nashvillezoo.org/glow-wild', 'https://www.nashvilleyards.com/rinkunderbroad']) assert.ok(section.includes(`href="${url}"`), url);
  assert.match(section, /minimum skating age of 3/);
  assert.match(section, /Chattanooga.*separate regional trip/);
  assert.doesNotMatch(section, /longest skate|budget answer|clearest holiday/);
});

test('Publication copy does not advertise a Gaylord January Tuesday after its closing date', async () => {
  assert.doesNotMatch(main(await html('blog/ice-skating-cost-nashville')), /Tuesday in January/);
});

test('Tennessee keeps Chattanooga separate and preserves exact session and holiday terms', async () => {
  const body = main(await html('state/tn'));
  const section = body.match(/<section id="chattanooga">([\s\S]*?)<\/section>/)[1];
  assert.match(section, /First Horizon Pavilion/);
  assert.doesNotMatch(section, /1801|1826/);
  assert.match(section, /November 21, 2026 through January 31, 2027/);
  for (const fact of ['$14 for adults', '$12 for ages 12 and under', '60 minutes', '$16.50 and $14.50', 'Tax or checkout fees are not stated', '30 minutes early', 'Refund requests need 48 hours', '20°F or below']) assert.ok(section.includes(fact), fact);
  assert.match(section, /Thanksgiving, Christmas, New Year.*Day and MLK Day/);
  assert.match(section, /href="https:\/\/www.iceonthelanding.com\/locationhourstickets"/);
  assert.match(section, /does not mean every time slot is open/);
});

for (const name of ['ice-skating-franklin-tn', 'ice-skating-nashville-kids', 'indoor-ice-skating-nashville', 'public-skating-nashville']) test(`Related post matches Zoo identity without claiming dated inventory: ${name}`, async () => {
  const body = await html(`blog/${name}`);
  assert.match(main(body), /Nashville Zoo/);
  assert.match(main(body), /[Ss]kating dates and sessions were not verified/);
  assert.doesNotMatch(main(body), /downtown Smashville|Smashville skating season remains unconfirmed|upcoming Smashville skating dates are unconfirmed/);
  assert.equal(schemas(body).find(s => s['@type'] === 'Article').dateModified, '2026-11-08');
});


test('Nashville cost tables have scoped keyboard-accessible overflow regions', async () => {
  const body = main(await html('blog/ice-skating-cost-nashville'));
  assert.equal((body.match(/aria-label="Scrollable skating price table"/g) || []).length, 2);
  assert.equal((body.match(/aria-label="Scrollable skating price table" tabindex="0"/g) || []).length, 2);
  assert.match(body, /overflow-x-auto/);
  assert.doesNotMatch(main(await html('blog/how-much-does-ice-skating-cost')), /Scrollable skating price table/);
});
