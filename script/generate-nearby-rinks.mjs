#!/usr/bin/env node
/**
 * Generate `nearby_rinks` for every operating rink, by real geographic distance.
 *
 * Written 2026-08-04 to remove the research burden from CODEX_BRIEF P1.2.
 * Every rink in rinks.json has valid latitude/longitude, so this is computable,
 * not researchable.
 *
 *   node script/generate-nearby-rinks.mjs --dry-run   # report only, no write
 *   node script/generate-nearby-rinks.mjs             # write into rinks.json
 *
 * IMPORTANT, read before running:
 * There are currently TWO rink-to-rink modules in the codebase. This script only
 * produces DATA for the `nearby_rinks` field consumed by the NearbyRinks sidebar
 * (RinkDetail.tsx ~:733). The other module (RinkDetail.tsx ~:662-692) computes
 * same-city neighbours dynamically at render time and is what currently produces
 * every rink-to-rink link on the live site.
 *
 * Running this WITHOUT first removing or reconciling that dynamic module will
 * render two "Other {city} rinks" blocks on rink pages that have both, with
 * overlapping links. That collision already exists today on the one rink that
 * has nearby_rinks populated. Decide on one module first.
 *
 * Rules encoded here:
 *  - nearest neighbours by great-circle distance, capped at MAX_MILES
 *  - always at least MIN_LINKS by falling back to nearest-in-state, then nearest overall
 *  - never recommend a closed or coming_soon rink (their own pages still get links)
 *  - deterministic ordering, so re-running produces a byte-identical file
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RINKS = join(ROOT, "client", "src", "data", "rinks.json");
const DRY = process.argv.includes("--dry-run");

const MAX_LINKS = 5;
const MIN_LINKS = 3;
const MAX_MILES = 60;

const raw = JSON.parse(readFileSync(RINKS, "utf8"));
const isArray = Array.isArray(raw);
const rinks = isArray ? raw : raw.rinks;
if (!Array.isArray(rinks)) throw new Error("Could not locate the rinks array in rinks.json");

const nonOperating = (r) =>
  ["closed", "coming_soon"].includes(String(r.operating_status || "").toLowerCase());

const R_MILES = 3958.8;
const toRad = (d) => (d * Math.PI) / 180;
function haversine(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_MILES * Math.asin(Math.min(1, Math.sqrt(s)));
}

const geoOf = (r) => {
  const lat = Number(r.geo?.latitude), lon = Number(r.geo?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
};

const missingGeo = rinks.filter((r) => !geoOf(r));
if (missingGeo.length) {
  console.error(`WARNING: ${missingGeo.length} rinks have no usable coordinates and will be skipped as targets:`);
  for (const r of missingGeo) console.error(`  - ${r.slug}`);
}

const candidates = rinks.filter((r) => geoOf(r) && !nonOperating(r));

let changed = 0;
const report = [];

for (const rink of rinks) {
  const origin = geoOf(rink);
  if (!origin) continue;

  const scored = candidates
    .filter((c) => c.slug !== rink.slug)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      state: c.address?.state,
      city: c.address?.city,
      miles: haversine(origin, geoOf(c)),
    }))
    // deterministic: distance, then slug as tiebreak
    .sort((a, b) => a.miles - b.miles || a.slug.localeCompare(b.slug));

  let picked = scored.filter((c) => c.miles <= MAX_MILES).slice(0, MAX_LINKS);

  // fall back to nearest-in-state, then nearest overall, so no page renders empty
  if (picked.length < MIN_LINKS) {
    const inState = scored.filter(
      (c) => c.state && c.state === rink.address?.state && !picked.some((p) => p.slug === c.slug)
    );
    picked = picked.concat(inState.slice(0, MIN_LINKS - picked.length));
  }
  if (picked.length < MIN_LINKS) {
    const rest = scored.filter((c) => !picked.some((p) => p.slug === c.slug));
    picked = picked.concat(rest.slice(0, MIN_LINKS - picked.length));
  }

  const next = picked.map((c) => c.slug);
  const prev = Array.isArray(rink.nearby_rinks) ? rink.nearby_rinks : [];
  if (JSON.stringify(prev) !== JSON.stringify(next)) changed++;

  rink.nearby_rinks = next;
  report.push({
    slug: rink.slug,
    picked: picked.map((c) => `${c.slug} (${c.miles.toFixed(1)}mi)`),
    beyondRadius: picked.filter((c) => c.miles > MAX_MILES).length,
  });
}

/* ---- reciprocity pass ----
 * Picking nearest-N guarantees every page SENDS links; it does not guarantee every
 * page RECEIVES one. A rink on the edge of a cluster can be nobody's nearest-5.
 * Without this pass 3 operating rinks ended up with zero inbound peer links, which
 * is the exact orphaning problem this script exists to fix. So: for any operating
 * rink at zero inbound, append it to its own nearest operating neighbour's list.
 */
const bySlug = new Map(rinks.map((r) => [r.slug, r]));
const countInbound = () => {
  const m = new Map(rinks.map((r) => [r.slug, 0]));
  for (const r of rinks)
    for (const t of r.nearby_rinks || []) if (m.has(t)) m.set(t, m.get(t) + 1);
  return m;
};

let inbound = countInbound();
const operating = rinks.filter((r) => !nonOperating(r));
let reciprocated = 0;
for (const r of operating) {
  if ((inbound.get(r.slug) || 0) > 0) continue;
  const origin = geoOf(r);
  if (!origin) continue;
  const nearest = candidates
    .filter((c) => c.slug !== r.slug)
    .map((c) => ({ slug: c.slug, miles: haversine(origin, geoOf(c)) }))
    .sort((a, b) => a.miles - b.miles || a.slug.localeCompare(b.slug))[0];
  if (!nearest) continue;
  const host = bySlug.get(nearest.slug);
  if (host && !host.nearby_rinks.includes(r.slug)) {
    host.nearby_rinks.push(r.slug);
    reciprocated++;
  }
}
if (reciprocated) console.log(`Reciprocity pass: added ${reciprocated} link(s) so no operating rink is orphaned.`);

inbound = countInbound();
const zeroInbound = operating.filter((r) => (inbound.get(r.slug) || 0) === 0);
const counts = [...inbound.values()];
const avg = counts.reduce((a, b) => a + b, 0) / (counts.length || 1);

console.log(`Rinks processed:            ${rinks.length}`);
console.log(`Eligible as link targets:   ${candidates.length} (excludes ${rinks.length - candidates.length} closed/coming_soon/no-geo)`);
console.log(`Records changed:            ${changed}`);
console.log(`Avg inbound peer links:     ${avg.toFixed(2)}`);
console.log(`Operating rinks at zero:    ${zeroInbound.length}`);
if (zeroInbound.length) for (const r of zeroInbound) console.log(`  - ${r.slug}`);

const farOnly = report.filter((r) => r.beyondRadius > 0);
if (farOnly.length)
  console.log(`\n${farOnly.length} rinks had no neighbour within ${MAX_MILES}mi and used the fallback:\n` +
    farOnly.map((r) => `  - ${r.slug}`).join("\n"));

console.log("\nSample:");
for (const r of report.slice(0, 5)) console.log(`  ${r.slug}\n    ${r.picked.join("\n    ")}`);

if (DRY) {
  console.log("\n--dry-run: rinks.json NOT written.");
} else {
  writeFileSync(RINKS, JSON.stringify(isArray ? rinks : raw, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${RINKS}`);
  console.log("Reminder: reconcile the duplicate nearby-rinks module before building. See the header of this file.");
}
