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
const ssrPath = path.resolve(__dirname, "..", "dist", "ssr", "entry-ssr.js");
const { render } = await import(ssrPath);

// Step 4: Load client HTML template
const clientDist = path.resolve(__dirname, "..", "dist", "public");
const indexHtml = await fs.readFile(path.resolve(clientDist, "index.html"), "utf-8");
const HTML_MARKER = '<div id="root"></div>';
const SITE_URL = "https://iceskatingindex.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

const cleanTemplate = indexHtml
  .replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
  .replace(/\s*<meta\s+name="description"[^>]*>/gi, "")
  .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>/gi, "")
  .replace(/\s*<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>/gi, "");

let rendered = 0;
let failed = 0;

for (const route of routes) {
  try {
    const { html: bodyHtml, head } = render(route);

    let headContent = "";
    const canonicalUrl = head?.canonicalPath
      ? head.canonicalPath === "/"
        ? `${SITE_URL}/`
        : `${SITE_URL}${head.canonicalPath}`
      : `${SITE_URL}${route === "/" ? "/" : route}`;
    const socialTitle = head?.ogTitle || head?.title || "Ice Skating Index";
    const socialDescription = head?.ogDescription || head?.description || "Find ice skating rinks, schedules, and skating guides.";
    const socialImage = head?.image || DEFAULT_OG_IMAGE;
    if (head?.title) {
      headContent += `<title>${escapeHtml(head.title)}</title>\n`;
    }
    if (head?.description) {
      headContent += `<meta name="description" content="${escapeHtml(head.description)}">\n`;
    }
    headContent += `<meta property="og:title" content="${escapeHtml(socialTitle)}">\n`;
    headContent += `<meta property="og:description" content="${escapeHtml(socialDescription)}">\n`;
    headContent += `<meta property="og:type" content="website">\n`;
    headContent += `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">\n`;
    headContent += `<meta property="og:image" content="${escapeHtml(socialImage)}">\n`;
    headContent += `<meta name="twitter:card" content="summary_large_image">\n`;
    headContent += `<meta name="twitter:title" content="${escapeHtml(socialTitle)}">\n`;
    headContent += `<meta name="twitter:description" content="${escapeHtml(socialDescription)}">\n`;
    headContent += `<meta name="twitter:image" content="${escapeHtml(socialImage)}">\n`;
    if (head?.canonicalPath) {
      const href = head.canonicalPath === "/"
        ? "https://iceskatingindex.com/"
        : `https://iceskatingindex.com${head.canonicalPath}`;
      headContent += `<link rel="canonical" href="${escapeHtml(href)}">\n`;
    }
    if (head?.robots) {
      headContent += `<meta name="robots" content="${escapeHtml(head.robots)}">\n`;
    }
    if (head?.structuredData?.length) {
      headContent += head.structuredData
        .map((data: object) => `<script type="application/ld+json">${escapeJsonLd(data)}</script>`)
        .join("\n") + "\n";
    }

    const finalHtml = cleanTemplate
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

const { html: notFoundBody, head: notFoundHead } = render("/__not-found__");
const notFoundHtml = cleanTemplate
  .replace(
    "</head>",
    `<title>${escapeHtml(notFoundHead?.title || "Page Not Found | Ice Skating Index")}</title>\n` +
      `<meta name="description" content="${escapeHtml(notFoundHead?.description || "The requested page could not be found.")}">\n` +
      `<meta name="robots" content="noindex,follow">\n</head>`,
  )
  .replace(HTML_MARKER, `<div id="root">${notFoundBody}</div>`);
await fs.writeFile(path.resolve(clientDist, "404.html"), notFoundHtml);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
