import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { build as viteBuild } from "vite";
import { buildPageHtml, cleanHtmlTemplate, escapeHtml, HTML_MARKER } from "../shared/pageHtml.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load data
const rinks = require("../client/src/data/rinks.json");
const blogPosts = require("../client/src/data/blog-posts.json");

const routes: string[] = [];
routes.push("/", "/browse", "/about", "/freestyle", "/services/learn-to-skate", "/services/skate-sharpening");

const states = new Set<string>();
rinks.forEach((r: any) => states.add(r.address.state.toLowerCase()));
states.forEach((s) => routes.push(`/state/${s}`));

const citySet = new Set<string>();
rinks.forEach((r: any) => {
  const state = r.address.state.toLowerCase().replace(/\s+/g, "-");
  const city = r.address.city.toLowerCase().replace(/\s+/g, "-");
  citySet.add(`${state}|${city}`);
});
citySet.forEach((entry) => {
  const [state, city] = entry.split("|");
  routes.push(`/city/${state}/${city}`);
});

rinks.forEach((r: any) => routes.push(`/rink/${r.slug}`));
routes.push("/blog");
blogPosts
  .filter((p: any) => p.slug !== "ice-skating-nashville")
  .forEach((p: any) => routes.push(`/blog/${p.slug}`));

console.log(`Will pre-render ${routes.length} pages`);

// Step 1: Build client
console.log("Building client bundle...");
await viteBuild({
  configFile: path.resolve(__dirname, "..", "vite.config.ts"),
});

// Step 2: Build SSR bundle
console.log("Building SSR bundle...");
await viteBuild({
  configFile: path.resolve(__dirname, "..", "vite.ssr.config.ts"),
});

// Step 3: Load SSR renderer
const ssrDist = path.resolve(__dirname, "..", "dist", "ssr");
const ssrPath = path.resolve(ssrDist, "entry-ssr.js");
const { render } = await import(ssrPath);

// Step 4: Load client HTML template
const clientDist = path.resolve(__dirname, "..", "dist", "public");
const indexHtml = await fs.readFile(path.resolve(clientDist, "index.html"), "utf-8");

const cleanTemplate = cleanHtmlTemplate(indexHtml);

// The runtime renderer needs the same template this build used. Route "/" writes
// over dist/public/index.html below, so keep a copy outside the served tree.
await fs.writeFile(path.resolve(ssrDist, "template.html"), cleanTemplate);

// One instant for the whole build, so the pages agree with each other.
const buildAsOf = new Date();

let rendered = 0;
let failed = 0;
/** Routes whose HTML depends on academy ice status, for the request-time path. */
const statusRoutes: string[] = [];

for (const route of routes) {
  try {
    const { html: bodyHtml, head, usesSkateStatus } = render(route, { asOf: buildAsOf });

    if (usesSkateStatus) statusRoutes.push(route);

    const finalHtml = buildPageHtml({ template: cleanTemplate, route, bodyHtml, head });

    const targetDir = route === "/" ? clientDist : path.resolve(clientDist, route.slice(1));
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.resolve(targetDir, "index.html"), finalHtml);
    rendered++;
  } catch (e: any) {
    failed++;
    console.error(`FAIL ${route}:`, e.message || String(e));
  }
}

console.log(`Pre-rendered ${rendered}/${routes.length} pages (${failed} failed)`);
if (failed > 0) process.exit(1);

await fs.writeFile(
  path.resolve(ssrDist, "status-routes.json"),
  JSON.stringify(statusRoutes, null, 2),
);
console.log(`${statusRoutes.length} routes consume academy ice status and re-render per request`);

const { html: notFoundBody, head: notFoundHead } = render("/__not-found__", { asOf: buildAsOf });
const notFoundHtml = cleanTemplate
  .replace(
    "</head>",
    `<title>${escapeHtml(notFoundHead?.title || "Page Not Found | Ice Skating Index")}</title>\n` +
      `<meta name="description" content="${escapeHtml(notFoundHead?.description || "The requested page could not be found.")}">\n` +
      `<meta name="robots" content="noindex,follow">\n</head>`,
  )
  .replace(HTML_MARKER, `<div id="root">${notFoundBody}</div>`);
await fs.writeFile(path.resolve(clientDist, "404.html"), notFoundHtml);
