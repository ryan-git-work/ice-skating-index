import type { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { buildPageHtml, HTML_MARKER, type RenderedHead } from "../shared/pageHtml.ts";

/**
 * Request-time re-render for the handful of pages that consume academy ice
 * status.
 *
 * The site is prerendered, so a dated advisory would otherwise stay in the
 * served HTML until someone rebuilt and republished. This server already runs on
 * autoscale, so those pages are rendered again per request against one Nashville
 * snapshot, using the SSR bundle and HTML template the build produced. Every
 * other route keeps serving its static file untouched.
 *
 * The route list comes from the build (dist/ssr/status-routes.json), recorded by
 * the renderer itself, so a page that starts or stops reading status is picked up
 * without anyone maintaining a list by hand.
 *
 * Fail-closed, deliberately: if the artifacts this path needs are missing or
 * damaged, there is no safe way to serve the prerendered copies of these pages,
 * because the stale copy is exactly the thing that may still be asserting an
 * expired advisory. Startup fails with a message naming the cause, and a render
 * failure answers 503 rather than falling back to the dated snapshot.
 */

type Renderer = (
  url: string,
  options?: { asOf?: Date },
) => { html: string; head: RenderedHead | null };

export type SkateStatusSsrArtifactReason =
  | "legacy-build"
  | "incomplete-artifacts"
  | "corrupt-manifest"
  | "corrupt-template"
  | "missing-ssr-bundle"
  | "renderer-unloadable"
  | "renderer-invalid";

/** Startup failure for the runtime status path. Distinguishes each cause by `reason`. */
export class SkateStatusSsrArtifactError extends Error {
  readonly reason: SkateStatusSsrArtifactReason;

  constructor(reason: SkateStatusSsrArtifactReason, message: string, cause?: unknown) {
    super(message);
    this.name = "SkateStatusSsrArtifactError";
    this.reason = reason;
    if (cause !== undefined) this.cause = cause;
  }
}

export interface SkateStatusSsrOptions {
  /** Build output root: the directory holding `public/` and `ssr/`. */
  distDir: string;
  /** Clock seam for tests. Production uses the request time. */
  now?: () => Date;
  /** Per-request render failures, reported rather than swallowed. */
  onError?: (route: string, error: unknown) => void;
  /** Startup notes worth seeing in the log, such as an empty route manifest. */
  onInfo?: (message: string) => void;
}

/**
 * esbuild rewrites `import()` in its CJS output into a `require()`, which cannot
 * load the ESM SSR bundle. Going through the Function constructor keeps a real
 * dynamic import in the shipped bundle.
 */
const dynamicImport = new Function("specifier", "return import(specifier);") as (
  specifier: string,
) => Promise<Record<string, unknown>>;

const REBUILD_HINT = "Run `npm run build` to produce it, then restart.";

function normalizeRoute(requestPath: string): string {
  let decoded: string;
  try { decoded = decodeURIComponent(requestPath); } catch { return requestPath; }
  const normalized = path.posix.normalize(decoded);
  const withoutIndex = normalized.replace(/\/index\.html$/, "") || "/";
  return withoutIndex.length > 1 ? withoutIndex.replace(/\/$/, "") : withoutIndex;
}

function unavailableBody(route: string): string {
  return (
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
    '<meta name="robots" content="noindex">' +
    "<title>Temporarily unavailable | Ice Skating Index</title></head><body>" +
    "<h1>This page is temporarily unavailable</h1>" +
    "<p>We could not confirm the current rink status for this page, so we are not showing " +
    "the last version of it. Please try again shortly.</p>" +
    `<!-- route: ${route.replace(/[<>&]/g, "")} -->` +
    "</body></html>"
  );
}

/**
 * Validates the build artifacts and returns the middleware.
 *
 * Throws {@link SkateStatusSsrArtifactError} when the artifacts cannot support
 * the path. Callers in development never reach this: the dev server renders from
 * source, where status is always evaluated live.
 */
export async function createSkateStatusSsr(
  options: SkateStatusSsrOptions,
): Promise<RequestHandler> {
  const ssrDir = path.join(options.distDir, "ssr");
  const entryPath = path.join(ssrDir, "entry-ssr.js");
  const templatePath = path.join(ssrDir, "template.html");
  const manifestPath = path.join(ssrDir, "status-routes.json");

  const hasEntry = fs.existsSync(entryPath);
  const hasTemplate = fs.existsSync(templatePath);
  const hasManifest = fs.existsSync(manifestPath);

  if (!hasEntry) {
    throw new SkateStatusSsrArtifactError(
      "missing-ssr-bundle",
      `SSR bundle not found at ${entryPath}. The academy ice status on prerendered pages cannot expire without it. ${REBUILD_HINT}`,
    );
  }

  // A build from before this path existed has the SSR bundle but neither new
  // artifact. Say so plainly instead of quietly serving its dated HTML.
  if (!hasTemplate && !hasManifest) {
    throw new SkateStatusSsrArtifactError(
      "legacy-build",
      `This build predates the academy ice status runtime renderer: ${templatePath} and ${manifestPath} are both absent. ` +
        `Serving it would publish academy status that cannot expire. ${REBUILD_HINT}`,
    );
  }

  if (!hasTemplate || !hasManifest) {
    throw new SkateStatusSsrArtifactError(
      "incomplete-artifacts",
      `Incomplete build artifacts for the academy ice status renderer: ` +
        `${hasTemplate ? manifestPath : templatePath} is missing while its counterpart is present. ${REBUILD_HINT}`,
    );
  }

  let routes: unknown;
  try {
    routes = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } catch (error) {
    throw new SkateStatusSsrArtifactError(
      "corrupt-manifest",
      `Could not read ${manifestPath} as JSON. ${REBUILD_HINT}`,
      error,
    );
  }
  if (!Array.isArray(routes) || routes.some((route) => typeof route !== "string")) {
    throw new SkateStatusSsrArtifactError(
      "corrupt-manifest",
      `${manifestPath} is not an array of route strings. ${REBUILD_HINT}`,
    );
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  if (!template.trim() || !template.includes("</head>") || template.split(HTML_MARKER).length !== 2) {
    throw new SkateStatusSsrArtifactError(
      "corrupt-template",
      `${templatePath} must be HTML with exactly one empty root marker. ${REBUILD_HINT}`,
    );
  }

  let render: Renderer;
  try {
    const module = await dynamicImport(pathToFileURL(entryPath).href);
    const candidate = module.render;
    if (typeof candidate !== "function") {
      throw new SkateStatusSsrArtifactError(
        "renderer-invalid",
        `${entryPath} does not export a render function. ${REBUILD_HINT}`,
      );
    }
    render = candidate as Renderer;
  } catch (error) {
    if (error instanceof SkateStatusSsrArtifactError) throw error;
    throw new SkateStatusSsrArtifactError(
      "renderer-unloadable",
      `Could not load the SSR bundle at ${entryPath}. ${REBUILD_HINT}`,
      error,
    );
  }

  const routeSet = new Set(routes as string[]);
  if (routeSet.size === 0) {
    options.onInfo?.(
      "No routes consume academy ice status in this build; all pages serve their prerendered HTML.",
    );
  } else {
    options.onInfo?.(`${routeSet.size} routes re-render per request for academy ice status.`);
  }

  const now = options.now ?? (() => new Date());

  return (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();

    const route = normalizeRoute(req.path);
    if (!routeSet.has(route)) return next();
    // A direct index.html request must not bypass expiry via express.static.
    if (req.path !== route) {
      const queryAt = req.originalUrl.indexOf("?");
      return res.redirect(301, route + (queryAt < 0 ? "" : req.originalUrl.slice(queryAt)));
    }

    let page: string;
    try {
      // One snapshot per request: the card, the chips, the FAQ copy, and the
      // schema in this response all describe the same instant.
      const asOf = now();
      const { html, head } = render(route, { asOf });
      if (typeof html !== "string" || html.trim() === "") {
        throw new Error("renderer returned an empty document body");
      }
      page = buildPageHtml({ template, route, bodyHtml: html, head });
    } catch (error) {
      // No fallback to the prerendered file: that copy may still be asserting an
      // advisory that has run out, which is the failure this path exists to stop.
      options.onError?.(route, error);
      res.status(503);
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Retry-After", "60");
      res.type("html").send(unavailableBody(route));
      return;
    }

    res.setHeader("Cache-Control", "no-cache");
    res.type("html").send(page);
  };
}
