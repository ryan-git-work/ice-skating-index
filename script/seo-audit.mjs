#!/usr/bin/env node
/**
 * ISI SEO audit harness
 *
 * Turns every "verify" line in the Codex briefs into a repeatable pass/fail gate.
 * Written 2026-08-04. Run it BEFORE the technical pass to capture a baseline,
 * and AFTER each commit to confirm the fix landed and nothing regressed.
 *
 *   node script/seo-audit.mjs                 # static checks against dist/public
 *   node script/seo-audit.mjs --live          # also hit the live site
 *   node script/seo-audit.mjs --live --json   # machine-readable output
 *   node script/seo-audit.mjs --baseline      # write .seo-baseline.json
 *
 * Exit code 0 = all gates pass, 1 = at least one FAIL.
 * WARN never fails the build; it flags things a human should look at.
 *
 * The reason this exists: on 2026-08-03 a claim that a page "had no page behind
 * it" ran for eight consecutive daily reports and became the top recommendation
 * on the project. The page had existed and been verified for seven weeks. Checks
 * that a machine can run are how that stops happening.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist", "public");
const SITE = "https://iceskatingindex.com";
const argv = new Set(process.argv.slice(2));
const LIVE = argv.has("--live");
const JSON_OUT = argv.has("--json");
const WRITE_BASELINE = argv.has("--baseline");

const results = [];
const add = (status, gate, detail, evidence) =>
  results.push({ status, gate, detail, evidence: evidence ?? null });
const pass = (g, d, e) => add("PASS", g, d, e);
const fail = (g, d, e) => add("FAIL", g, d, e);
const warn = (g, d, e) => add("WARN", g, d, e);
const info = (g, d, e) => add("INFO", g, d, e);

/* ---------- helpers ---------- */

function walkHtml(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, acc);
    else if (name.endsWith(".html") && name !== "404.html") acc.push(p);
  }
  return acc;
}

// dist/public/city/ny/new-york/index.html -> /city/ny/new-york
const routeOf = (file) => {
  const rel = relative(DIST, file).replace(/\\/g, "/");
  const r = "/" + rel.replace(/index\.html$/, "").replace(/\/$/, "");
  return r === "/" ? "/" : r;
};

const countAll = (s, re) => (s.match(re) || []).length;
const metaContent = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};
const decodeHtmlEntities = (value) => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">");
const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

async function head(url, extraHeaders = {}) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "accept-encoding": "gzip, deflate, br", ...extraHeaders },
    });
    return { status: res.status, headers: res.headers, ok: true };
  } catch (e) {
    return { status: 0, headers: new Headers(), ok: false, error: String(e) };
  }
}
async function get(url) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "accept-encoding": "gzip, deflate, br" },
    });
    const body = await res.text();
    return { status: res.status, headers: res.headers, body, ok: true };
  } catch (e) {
    return { status: 0, headers: new Headers(), body: "", ok: false, error: String(e) };
  }
}

/* ---------- static gates (dist/public) ---------- */

function staticGates() {
  const files = walkHtml(DIST);
  if (!files.length) {
    fail("build.present", "No built HTML found. Run `npm run build` first.", DIST);
    return { files: [], pages: [] };
  }
  info("build.present", `${files.length} built HTML pages found.`);

  const pages = files.map((f) => {
    const html = readFileSync(f, "utf8");
    return { file: f, route: routeOf(f), html };
  });

  /* --- exactly one h1 per page (this gate CLOSED a queued fix; keep it honest) --- */
  const badH1 = pages.filter((p) => countAll(p.html, /<h1[\s>]/gi) !== 1);
  badH1.length
    ? fail("h1.exactly-one", `${badH1.length} pages do not have exactly one <h1>.`,
        badH1.slice(0, 10).map((p) => `${p.route} (${countAll(p.html, /<h1[\s>]/gi)})`))
    : pass("h1.exactly-one", `All ${pages.length} pages have exactly one <h1>.`);

  /* --- canonical present + unique --- */
  const canon = new Map();
  let missingCanon = 0;
  for (const p of pages) {
    const c = metaContent(p.html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
    if (!c) missingCanon++;
    else canon.set(c, (canon.get(c) || 0) + 1);
  }
  const dupCanon = [...canon.entries()].filter(([, n]) => n > 1);
  missingCanon || dupCanon.length
    ? fail("canonical.unique", `${missingCanon} missing, ${dupCanon.length} duplicated.`,
        dupCanon.slice(0, 10).map(([u, n]) => `${u} x${n}`))
    : pass("canonical.unique", `All ${pages.length} canonicals present and unique.`);

  /* --- title present + unique --- */
  const titles = new Map();
  for (const p of pages) {
    const t = metaContent(p.html, /<title>([^<]*)<\/title>/i);
    if (t) titles.set(t, (titles.get(t) || 0) + 1);
  }
  const dupTitles = [...titles.entries()].filter(([, n]) => n > 1);
  dupTitles.length
    ? fail("title.unique", `${dupTitles.length} duplicated <title> values.`,
        dupTitles.slice(0, 10).map(([t, n]) => `"${t}" x${n}`))
    : pass("title.unique", `All ${titles.size} titles unique.`);

  const longTitles = [...titles.keys()].filter((t) => t.length > 65);
  longTitles.length &&
    warn("title.length", `${longTitles.length} titles exceed 65 chars.`,
      longTitles.sort((a, b) => b.length - a.length).slice(0, 5).map((t) => `${t.length}: ${t}`));

  /* --- Open Graph: the P1.1 gate --- */
  const genericOg = [], missingOgImage = [], missingOgUrl = [], dupOg = [];
  for (const p of pages) {
    const ogTitles = p.html.match(/<meta[^>]+property="og:title"[^>]*>/gi) || [];
    if (ogTitles.length > 1) dupOg.push(`${p.route} (${ogTitles.length} og:title)`);
    const ogT = metaContent(p.html, /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i);
    if (!ogT || ogT.trim() === "Ice Skating Index") genericOg.push(p.route);
    if (!/property="og:image"/i.test(p.html)) missingOgImage.push(p.route);
    if (!/property="og:url"/i.test(p.html)) missingOgUrl.push(p.route);
  }
  genericOg.length
    ? fail("og.title-specific", `${genericOg.length}/${pages.length} pages have a generic or missing og:title.`, genericOg.slice(0, 8))
    : pass("og.title-specific", "Every page has a specific og:title.");
  missingOgImage.length
    ? fail("og.image", `${missingOgImage.length}/${pages.length} pages have no og:image.`, missingOgImage.slice(0, 5))
    : pass("og.image", "og:image present on every page.");
  missingOgUrl.length
    ? fail("og.url", `${missingOgUrl.length}/${pages.length} pages have no og:url.`, missingOgUrl.slice(0, 5))
    : pass("og.url", "og:url present on every page.");
  dupOg.length
    ? fail("og.no-duplicates", `${dupOg.length} pages emit more than one og:title.`, dupOg)
    : pass("og.no-duplicates", "No duplicate og:title tags.");

  /* --- city hubs must not be empty (P0.2) --- */
  const cityHubs = pages.filter((p) => /^\/city\/[^/]+\/[^/]+$/.test(p.route));
  const emptyHubs = cityHubs.filter((p) => countAll(p.html, /href="\/rink\//g) === 0);
  emptyHubs.length
    ? fail("cityhub.non-empty", `${emptyHubs.length}/${cityHubs.length} city hubs link zero rinks.`,
        emptyHubs.map((p) => p.route))
    : pass("cityhub.non-empty", `All ${cityHubs.length} city hubs link at least one rink.`);

  /* --- empty ItemList schema (a hub claiming an empty list is worse than no schema) --- */
  const emptyItemList = pages.filter((p) =>
    /"@type"\s*:\s*"ItemList"/.test(p.html) && /"itemListElement"\s*:\s*\[\s*\]/.test(p.html));
  emptyItemList.length
    ? fail("schema.no-empty-itemlist", `${emptyItemList.length} pages emit ItemList with zero items.`,
        emptyItemList.slice(0, 10).map((p) => p.route))
    : pass("schema.no-empty-itemlist", "No empty ItemList schema.");

  /* --- ItemList numberOfItems must match rendered rink links (the 89 vs 91 bug) --- */
  const browse = pages.find((p) => p.route === "/browse");
  if (browse) {
    const declared = Number(metaContent(browse.html, /"numberOfItems"\s*:\s*(\d+)/) || 0);
    const rendered = new Set(browse.html.match(/href="(\/rink\/[^"]+)"/g) || []).size;
    declared === rendered
      ? pass("browse.itemlist-count", `ItemList numberOfItems (${declared}) matches rendered rinks.`)
      : fail("browse.itemlist-count",
          `ItemList declares ${declared} items but page renders ${rendered} distinct rink links.`);
  }

  /* --- duplicate rink-to-rink modules (the P1.2 trap) --- */
  const dupNearby = pages.filter((p) => {
    if (!p.route.startsWith("/rink/")) return false;
    return countAll(p.html, /Other\s+[^<]{1,40}\s+rinks/gi) > 1;
  });
  dupNearby.length
    ? fail("rink.single-nearby-module",
        `${dupNearby.length} rink pages render more than one "Other {city} rinks" module. ` +
        `This is the duplicate-module collision the brief warns about.`,
        dupNearby.slice(0, 10).map((p) => p.route))
    : pass("rink.single-nearby-module", "No duplicate nearby-rinks modules.");

  /* --- no duplicate href within a single page --- */
  const dupHref = [];
  for (const p of pages.filter((x) => x.route.startsWith("/rink/"))) {
    const hrefs = (p.html.match(/href="(\/rink\/[^"]+)"/g) || []);
    const seen = new Map();
    for (const h of hrefs) seen.set(h, (seen.get(h) || 0) + 1);
    const repeats = [...seen.entries()].filter(([, n]) => n > 1);
    if (repeats.length) dupHref.push(`${p.route}: ${repeats.map(([h, n]) => `${h} x${n}`).join(", ")}`);
  }
  dupHref.length
    ? warn("rink.no-duplicate-links", `${dupHref.length} rink pages repeat the same rink link.`, dupHref.slice(0, 6))
    : pass("rink.no-duplicate-links", "No repeated rink links within a page.");

  /* --- broken internal links --- */
  const routeSet = new Set(pages.map((p) => p.route));
  const broken = new Map();
  for (const p of pages) {
    for (const m of p.html.matchAll(/href="(\/[^"#?]*)"/g)) {
      let t = m[1].replace(/\/$/, "") || "/";
      if (/\.(png|jpg|jpeg|webp|svg|xml|txt|ico|css|js|md|json)$/i.test(t)) continue;
      if (t.startsWith("/api/") || t.startsWith("/assets/") || t.startsWith("/images/")) continue;
      if (!routeSet.has(t)) {
        if (!broken.has(t)) broken.set(t, new Set());
        broken.get(t).add(p.route);
      }
    }
  }
  broken.size
    ? fail("links.no-broken", `${broken.size} internal link targets have no built page.`,
        [...broken.entries()].slice(0, 10).map(([t, from]) => `${t} <- ${[...from].slice(0, 3).join(", ")}`))
    : pass("links.no-broken", "No broken internal links.");

  /* --- unresolved template tokens --- */
  const tokenRe = /\[RINK:|\{\{|TKTK|Lorem ipsum|\[object Object\]|undefined<|>NaN</;
  const tokened = pages.filter((p) => tokenRe.test(p.html));
  tokened.length
    ? fail("content.no-tokens", `${tokened.length} pages contain unresolved tokens.`,
        tokened.slice(0, 8).map((p) => p.route))
    : pass("content.no-tokens", "No unresolved template tokens.");

  /* --- contextual inbound coverage (the /blog listing does not count) --- */
  const MIN_CONTEXTUAL_INBOUND = 2;
  const inbound = new Map(pages.map((p) => [p.route, new Set()]));
  for (const p of pages) {
    if (p.route === "/blog") continue;
    const main = p.html
      .replace(/<header[\s\S]*?<\/header>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ");
    for (const m of main.matchAll(/href="(\/[^"#?]*)"/g)) {
      const t = m[1].replace(/\/$/, "") || "/";
      if (inbound.has(t) && t !== p.route) inbound.get(t).add(p.route);
    }
  }
  const underlinked = [...inbound.entries()]
    .filter(([r, s]) => r !== "/" && s.size < MIN_CONTEXTUAL_INBOUND)
    .sort((a, b) => a[1].size - b[1].size || a[0].localeCompare(b[0]));
  underlinked.length
    ? warn("links.orphans",
        `${underlinked.length} pages have fewer than ${MIN_CONTEXTUAL_INBOUND} contextual inbound links; ` +
        `the all-posts /blog listing is excluded.`,
        underlinked.slice(0, 30).map(([r, sources]) => `${r} (${sources.size})`))
    : pass("links.orphans",
        `Every page has at least ${MIN_CONTEXTUAL_INBOUND} contextual inbound links outside /blog.`);

  /* --- rink pages must receive rink-to-rink links --- */
  const rinkDataPath = join(ROOT, "client", "src", "data", "rinks.json");
  const rinkDataRaw = existsSync(rinkDataPath) ? JSON.parse(readFileSync(rinkDataPath, "utf8")) : [];
  const rinkData = Array.isArray(rinkDataRaw) ? rinkDataRaw : rinkDataRaw.rinks || [];
  const nonOperatingRoutes = new Set(
    rinkData
      .filter((rink) => ["closed", "coming_soon"].includes(String(rink.operating_status || "").toLowerCase()))
      .map((rink) => `/rink/${rink.slug}`),
  );
  const rinkRoutes = pages
    .filter((p) => p.route.startsWith("/rink/") && !nonOperatingRoutes.has(p.route))
    .map((p) => p.route);
  const rinkToRink = new Map(rinkRoutes.map((r) => [r, 0]));
  for (const p of pages.filter((x) => x.route.startsWith("/rink/"))) {
    for (const t of new Set((p.html.match(/href="(\/rink\/[^"]+)"/g) || [])
      .map((h) => h.slice(6, -1)))) {
      if (rinkToRink.has(t) && t !== p.route) rinkToRink.set(t, rinkToRink.get(t) + 1);
    }
  }
  const noPeer = [...rinkToRink.entries()].filter(([, n]) => n === 0);
  noPeer.length
    ? warn("rink.peer-links", `${noPeer.length}/${rinkRoutes.length} rink pages receive zero rink-to-rink links.`,
        noPeer.slice(0, 8).map(([r]) => r))
    : pass("rink.peer-links", "Every rink page receives at least one peer link.");

  /* --- thin page report --- */
  const thin = pages
    .map((p) => ({ route: p.route, words: textOf(p.html).split(" ").filter(Boolean).length }))
    .filter((p) => p.words < 200)
    .sort((a, b) => a.words - b.words);
  thin.length
    ? warn("content.thin", `${thin.length} pages under 200 words.`,
        thin.slice(0, 12).map((p) => `${p.route} (${p.words}w)`))
    : pass("content.thin", "No pages under 200 words.");

  /* --- non-operating rinks must be noindex --- */
  const rinksPath = rinkDataPath;
  if (existsSync(rinksPath)) {
    const raw = JSON.parse(readFileSync(rinksPath, "utf8"));
    const rinks = Array.isArray(raw) ? raw : raw.rinks || [];
    const nonOp = rinks.filter((r) =>
      ["closed", "coming_soon"].includes(String(r.operating_status || "").toLowerCase()));
    const notNoindexed = [];
    let checkedNonOp = 0;
    for (const r of nonOp) {
      const pg = pages.find((p) => p.route === `/rink/${r.slug}`);
      if (!pg) continue;
      checkedNonOp++;
      if (!/<meta[^>]+name="robots"[^>]+noindex/i.test(pg.html)) notNoindexed.push(r.slug);
    }
    if (!nonOp.length) info("rink.noindex-non-operating", "No closed or coming_soon rinks in the data.");
    else if (!checkedNonOp)
      info("rink.noindex-non-operating",
        `${nonOp.length} non-operating rinks in data but none have a built page; nothing to check.`);
    else if (notNoindexed.length)
      fail("rink.noindex-non-operating",
        `${notNoindexed.length}/${checkedNonOp} non-operating rinks lack a noindex directive.`, notNoindexed);
    else
      pass("rink.noindex-non-operating", `All ${checkedNonOp} non-operating rink pages are noindexed.`);

    /* --- nearby_rinks coverage --- */
    const operating = rinks.filter((r) =>
      !["closed", "coming_soon"].includes(String(r.operating_status || "").toLowerCase()));
    const withNearby = operating.filter((r) => Array.isArray(r.nearby_rinks) && r.nearby_rinks.length);
    withNearby.length === operating.length
      ? pass("data.nearby-rinks", `nearby_rinks populated on all ${operating.length} operating rinks.`)
      : warn("data.nearby-rinks",
          `nearby_rinks populated on ${withNearby.length}/${operating.length} operating rinks.`);

    /* --- slug vs record consistency (catches the entity-mismatch class) --- */
    const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const mismatch = [];
    for (const r of rinks) {
      const citySlug = norm(r.address?.city).replace(/\s+/g, "-");
      if (citySlug && !String(r.slug).includes(citySlug)) {
        const alt = citySlug.replace(/^saint-/, "st-").replace(/^st-/, "saint-");
        if (!String(r.slug).includes(alt)) mismatch.push(`${r.slug} -> city "${r.address?.city}"`);
      }
    }
    mismatch.length
      ? warn("data.slug-matches-city", `${mismatch.length} slugs do not contain their record's city.`, mismatch)
      : pass("data.slug-matches-city", "Every slug contains its record's city.");

    /* --- sources coverage on operating rinks --- */
    const noSources = operating.filter((r) => !Array.isArray(r.sources) || !r.sources.length);
    noSources.length
      ? warn("data.sources", `${noSources.length}/${operating.length} operating rinks carry no sources.`)
      : pass("data.sources", "Every operating rink carries at least one source.");
  }

  /* --- blog metaDescription must actually be used --- */
  const bpPath = join(ROOT, "client", "src", "data", "blog-posts.json");
  if (existsSync(bpPath)) {
    const raw = JSON.parse(readFileSync(bpPath, "utf8"));
    const posts = Array.isArray(raw) ? raw : raw.posts || [];
    let unused = 0, checked = 0;
    for (const post of posts) {
      if (!post.metaDescription) continue;
      const pg = pages.find((p) => p.route === `/blog/${post.slug}`);
      if (!pg) continue;
      checked++;
      const served = decodeHtmlEntities(
        metaContent(pg.html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || "",
      );
      if (served.trim().slice(0, 60) !== post.metaDescription.trim().slice(0, 60)) unused++;
    }
    checked && (unused
      ? fail("blog.meta-description-used",
          `${unused}/${checked} posts serve a description that is not the authored metaDescription.`)
      : pass("blog.meta-description-used", `All ${checked} posts serve their authored metaDescription.`));
  }

  /* --- blog posts should ship a server-rendered image --- */
  const blogPages = pages.filter((p) => p.route.startsWith("/blog/"));
  if (!blogPages.length) info("blog.server-rendered-image", "No blog pages built; nothing to check.");
  else {
    const noImg = blogPages.filter((p) => !/<img[\s>]/i.test(p.html));
    noImg.length
      ? warn("blog.server-rendered-image",
          `${noImg.length}/${blogPages.length} blog posts ship zero <img> in server HTML. ` +
          `They are invisible to Google Images and cannot carry a per-post og:image.`)
      : pass("blog.server-rendered-image", `All ${blogPages.length} blog posts ship a server-rendered image.`);
  }

  /* --- alt text quality (filename-derived alt is not alt text) --- */
  const junkAlt = [];
  for (const p of pages) {
    for (const m of p.html.matchAll(/<img[^>]+alt="([^"]*)"/gi)) {
      if (/^\s*(ice\s+img\s+\d+|image\s*\d*|img\s*\d*)\s*$/i.test(m[1]))
        junkAlt.push(`${p.route}: "${m[1]}"`);
    }
  }
  junkAlt.length
    ? warn("img.alt-quality", `${junkAlt.length} images use filename-derived alt text.`, junkAlt.slice(0, 6))
    : pass("img.alt-quality", "No filename-derived alt text.");

  return { files, pages };
}

/* ---------- live gates ---------- */

async function liveGates() {
  /* --- soft 404: the P0.1 ship gate --- */
  const bogus = [
    `${SITE}/rink/this-rink-does-not-exist-xyz123`,
    `${SITE}/blog/does-not-exist-xyz123`,
    `${SITE}/totally-fake-page-abc`,
    `${SITE}/state/zz`,
  ];
  const homeBody = (await get(SITE + "/")).body;
  const softFails = [];
  for (const u of bogus) {
    const r = await get(u);
    const isHome = r.body.length > 1000 && r.body === homeBody;
    if (r.status !== 404 || isHome)
      softFails.push(`${u} -> HTTP ${r.status}${isHome ? " (byte-identical to homepage)" : ""}`);
  }
  softFails.length
    ? fail("live.soft-404",
        "Nonexistent URLs do not return a real 404. This is the P0 ship gate.", softFails)
    : pass("live.soft-404", "All nonexistent URLs return 404.");

  /* --- a real page still works --- */
  const good = await get(`${SITE}/rink/gary-force-acura-ice-arena-nolensville-tn`);
  good.status === 200 && /Gary Force/i.test(good.body)
    ? pass("live.real-page-200", "A known-good rink page still returns 200 with its content.")
    : fail("live.real-page-200", `Known-good rink page returned HTTP ${good.status}.`);

  /* --- trailing slash should canonicalise --- */
  const slash = await head(`${SITE}/rink/gary-force-acura-ice-arena-nolensville-tn/`);
  [301, 308].includes(slash.status)
    ? pass("live.trailing-slash", `Trailing slash returns ${slash.status}.`)
    : fail("live.trailing-slash",
        `Trailing slash returns HTTP ${slash.status}; expected a 301 to the canonical form.`);

  /* --- compression + caching --- */
  const home = await get(`${SITE}/`);
  const assetMatch = home.body.match(/src="(\/assets\/[^"]+\.js)"/);
  if (assetMatch) {
    const asset = await get(SITE + assetMatch[1]);
    const enc = asset.headers.get("content-encoding");
    const cc = asset.headers.get("cache-control") || "";
    const len = Number(asset.headers.get("content-length") || asset.body.length);
    enc
      ? pass("live.compression", `JS bundle served with content-encoding: ${enc}.`)
      : fail("live.compression",
          `JS bundle served UNCOMPRESSED (${(len / 1024 / 1024).toFixed(2)} MB). ` +
          `gzip/brotli would cut this by roughly 75%.`, assetMatch[1]);
    /^max-age=0|no-cache|private/.test(cc) && !/max-age=[1-9]/.test(cc)
      ? fail("live.asset-caching",
          `Content-hashed asset sent with "cache-control: ${cc}" so it is re-fetched every navigation.`)
      : pass("live.asset-caching", `Asset cache-control: ${cc || "(none)"}.`);
  }

  /* --- sitemap lastmod must not be today's rolling date --- */
  const sm = await get(`${SITE}/sitemap.xml`);
  if (sm.status === 200) {
    const locs = countAll(sm.body, /<loc>/g);
    const today = new Date().toISOString().slice(0, 10);
    const todays = countAll(sm.body, new RegExp(`<lastmod>${today}</lastmod>`, "g"));
    info("live.sitemap-size", `${locs} URLs in sitemap.`);
    todays > 5
      ? fail("live.sitemap-lastmod",
          `${todays} sitemap URLs are stamped with today's date (${today}). ` +
          `A lastmod that moves on every crawl is a signal Google learns to distrust.`)
      : pass("live.sitemap-lastmod", `Only ${todays} URLs stamped today.`);
  } else {
    fail("live.sitemap-lastmod", `sitemap.xml returned HTTP ${sm.status}.`);
  }

  /* --- raw markdown should not be publicly served --- */
  const md = await get(`${SITE}/posts/ice-skating-nashville.md`);
  md.status === 200 && md.body.length > 500
    ? warn("live.raw-markdown",
        `Raw markdown is publicly served (HTTP 200, ${md.body.length} bytes). ` +
        `These duplicate published article bodies with no canonical.`)
    : pass("live.raw-markdown", "Raw markdown not publicly served.");

  /* --- robots.txt sanity --- */
  const robots = await get(`${SITE}/robots.txt`);
  robots.status === 200 && /sitemap:/i.test(robots.body)
    ? pass("live.robots", "robots.txt present and references the sitemap.")
    : fail("live.robots", `robots.txt HTTP ${robots.status} or missing Sitemap line.`);
}

/* ---------- run ---------- */

const { pages } = staticGates();
if (LIVE) await liveGates();

const counts = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
const failed = (counts.FAIL || 0) > 0;

if (JSON_OUT) {
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), counts, results }, null, 2));
} else {
  const icon = { PASS: "PASS", FAIL: "FAIL", WARN: "WARN", INFO: "INFO" };
  console.log("\nISI SEO audit\n" + "=".repeat(60));
  for (const group of ["FAIL", "WARN", "PASS", "INFO"]) {
    const rows = results.filter((r) => r.status === group);
    if (!rows.length) continue;
    console.log(`\n${group} (${rows.length})\n${"-".repeat(60)}`);
    for (const r of rows) {
      console.log(`[${icon[r.status]}] ${r.gate}\n       ${r.detail}`);
      if (r.evidence) {
        const ev = Array.isArray(r.evidence) ? r.evidence : [r.evidence];
        for (const e of ev.slice(0, 12)) console.log(`         - ${e}`);
        if (ev.length > 12) console.log(`         ... and ${ev.length - 12} more`);
      }
    }
  }
  console.log("\n" + "=".repeat(60));
  console.log(
    `PASS ${counts.PASS || 0}  FAIL ${counts.FAIL || 0}  WARN ${counts.WARN || 0}  INFO ${counts.INFO || 0}`
  );
  console.log(failed ? "GATE: FAILED\n" : "GATE: PASSED\n");
}

if (WRITE_BASELINE) {
  writeFileSync(
    join(ROOT, ".seo-baseline.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), counts, results }, null, 2)
  );
  console.error("Baseline written to .seo-baseline.json");
}

process.exit(failed ? 1 : 0);
