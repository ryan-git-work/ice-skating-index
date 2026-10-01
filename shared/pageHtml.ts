/**
 * Shared page-HTML assembly for the prerenderer and the runtime SSR path.
 *
 * The build (script/prerender.ts) and the request-time renderer
 * (server/skateStatusSsr.ts) must emit byte-identical head markup for the same
 * render output, otherwise a page served at runtime would quietly lose its
 * canonical, robots, or schema tags. Keeping one builder is the guard.
 */

export const SITE_URL = "https://iceskatingindex.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
export const HTML_MARKER = '<div id="root"></div>';

/** Marks schema emitted by the server so the browser can replace it instead of duplicating it. */
export const SSR_SCHEMA_ATTRIBUTE = "data-ssr-schema";

export interface RenderedHead {
  title?: string;
  description?: string;
  image?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath?: string;
  robots?: string;
  structuredData?: object[];
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function escapeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Strips the build-time defaults the renderer replaces, so tags are never emitted twice. */
export function cleanHtmlTemplate(indexHtml: string): string {
  return indexHtml
    .replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<meta\s+name="description"[^>]*>/gi, "")
    .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>/gi, "");
}

export function canonicalUrlFor(route: string, head?: RenderedHead | null): string {
  const canonicalPath = head?.canonicalPath;
  if (canonicalPath) {
    return canonicalPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${canonicalPath}`;
  }
  return `${SITE_URL}${route === "/" ? "/" : route}`;
}

export function buildHeadContent(route: string, head?: RenderedHead | null): string {
  const canonicalUrl = canonicalUrlFor(route, head);
  const socialTitle = head?.ogTitle || head?.title || "Ice Skating Index";
  const socialDescription =
    head?.ogDescription || head?.description || "Find ice skating rinks, schedules, and skating guides.";
  const socialImage = head?.image || DEFAULT_OG_IMAGE;

  let headContent = "";
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
    const href = head.canonicalPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${head.canonicalPath}`;
    headContent += `<link rel="canonical" href="${escapeHtml(href)}">\n`;
  }
  if (head?.robots) {
    headContent += `<meta name="robots" content="${escapeHtml(head.robots)}">\n`;
  }
  if (head?.structuredData?.length) {
    headContent +=
      head.structuredData
        .map(
          (data: object) =>
            `<script type="application/ld+json" ${SSR_SCHEMA_ATTRIBUTE}>${escapeJsonLd(data)}</script>`,
        )
        .join("\n") + "\n";
  }
  return headContent;
}

export function buildPageHtml(options: {
  template: string;
  route: string;
  bodyHtml: string;
  head?: RenderedHead | null;
}): string {
  const { template, route, bodyHtml, head } = options;
  return template
    .replace("</head>", buildHeadContent(route, head) + "</head>")
    .replace(HTML_MARKER, `<div id="root">${bodyHtml}</div>`);
}
