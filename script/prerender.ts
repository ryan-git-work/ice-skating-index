import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { build as viteBuild } from "vite";

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
  routes.push(`/state/${state}/${city}`);
});

rinks.forEach((r: any) => routes.push(`/rink/${r.slug}`));
routes.push("/blog");
blogPosts.forEach((p: any) => routes.push(`/blog/${p.slug}`));
routes.push("/tennessee/nashville-ice-skating");

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
const ssrPath = path.resolve(__dirname, "..", "dist", "ssr", "entry-ssr.js");
const { render } = await import(ssrPath);

// Step 4: Load client HTML template
const clientDist = path.resolve(__dirname, "..", "dist", "public");
const indexHtml = await fs.readFile(path.resolve(clientDist, "index.html"), "utf-8");
const HTML_MARKER = '<div id="root"></div>';

let rendered = 0;
let failed = 0;

for (const route of routes) {
  try {
    const { html: bodyHtml, head } = render(route);

    let headContent = "";
    if (head?.title) {
      headContent += `<title>${escapeHtml(head.title)}</title>\n`;
    }
    if (head?.description) {
      headContent += `<meta name="description" content="${escapeHtml(head.description)}">\n`;
    }
    if (head?.ogTitle) {
      headContent += `<meta property="og:title" content="${escapeHtml(head.ogTitle)}">\n`;
    }
    if (head?.ogDescription) {
      headContent += `<meta property="og:description" content="${escapeHtml(head.ogDescription)}">\n`;
    }

    const finalHtml = indexHtml
      .replace("</head>", headContent + "</head>")
      .replace(HTML_MARKER, `<div id="root">${bodyHtml}</div>`);

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
