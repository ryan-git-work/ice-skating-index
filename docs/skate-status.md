# Skate Status update guide

`client/src/data/skate-status.json` powers the academy ice status block on rink pages, the status
chips on cards and hubs, the two status FAQ entries, and the status-derived schema dates. Every one
of those reads the same evaluated result, so a notice cannot expire in one place and survive in
another.

## Record shape

```json
{
  "rink-slug": {
    "state": "altered",
    "note": "Pointer-only plain-language change, scoped to the academy, ending with where to confirm.",
    "covered_from": "2026-09-28",
    "covered_through": "2026-10-03",
    "updated": "2026-10-01",
    "verified_by": "a local coach",
    "source_url": "https://official-schedule.example"
  }
}
```

- `state` — `normal`, `altered`, or `closed`. Any other value evaluates neutral.
- `note` — what changed, in pointer-only terms. No session times, no timetable, no class grid.
- `covered_from` / `covered_through` — **required**, `YYYY-MM-DD`, inclusive. These are the dates the
  note describes and they are what makes the note expire.
- `updated` — the date the change was confirmed. Must not be in the future.
- `verified_by` — who confirmed it, honestly, or `null`.
- `source_url` — where a reader confirms it. For academy ice at Centennial this is the academy's
  public Centennial portal (`https://nashvilleskatingacademycentennial.finnlyconnect.com/`). Public
  skate at Centennial is booked separately through Predators DaySmart and is not this field.

These records describe **Nashville Skating Academy ice** at the listed facility. They are not a
public-skate availability claim, and headings and chips say so. No entry means no status claim is
shown anywhere.

## How expiry is evaluated

`client/src/lib/skateStatus.ts` holds the evaluation and has no imports, so it is testable on its
own. The date comparison happens in **America/Chicago**, derived from the request or browser instant
through `Intl`. Nothing parses a date string in the machine's local zone.

A record is current only when all of the following hold on the Chicago calendar date:

- `state` is one of the three supported values;
- `updated` is a real date and is not after today;
- both covered dates are real dates and `covered_from <= covered_through`;
- today is within `covered_from … covered_through`, inclusive, so the through-date stays current all
  day in Nashville and goes neutral at the next Chicago midnight;
- the record is no more than ten days older than today (`STALE_AFTER_DAYS`).

Anything else is neutral, and the evaluation says why: `invalid-as-of`, `invalid-state`,
`invalid-updated`, `future-updated`, `missing-coverage`, `invalid-coverage`, `future-coverage`,
`expired-coverage`, `stale-age`.

Two consequences worth knowing:

- A legacy entry with no covered dates is **neutral**, not fresh for ten days. The ten-day window is
  a supplemental backstop against a forgotten entry; it was never an expiry for a dated note.
- Neutral means absent, not softened. No card, no chip, no status FAQ entries, and no status date in
  `dateModified`. `lastReviewed` stays the page's own review date and is never borrowed from a weekly
  advisory.

## How the served HTML stays honest

The site is prerendered, so a dated notice would otherwise sit in built HTML until someone rebuilt
and republished. `.replit` deploys this repo as an **autoscale Express server**, so the pages that
actually read status are rendered again per request:

1. The build records which routes consumed academy status while rendering
   (`dist/ssr/status-routes.json`). The current build generates **eight** such routes — the three
   advisory rink pages plus the hubs, listing pages, and the one blog post whose HTML reads status.
   Nothing is maintained by hand, so a page that starts or stops reading status is picked up on the
   next build.
2. The build also saves the cleaned HTML template it used (`dist/ssr/template.html`), because route
   `/` overwrites `dist/public/index.html`.
3. At runtime `server/skateStatusSsr.ts` re-renders only those routes, with **one request-time
   Chicago snapshot** passed into the existing `dist/ssr/entry-ssr.js` renderer, and assembles the
   page with the same `shared/pageHtml.ts` builder the prerenderer uses. Title, description, social
   tags, canonical, robots, schema, and hashed asset tags are therefore identical in shape to the
   built page. Every other route serves its static file untouched, and 404 behaviour is unchanged.
4. Status-route aliases — a trailing slash, or a direct `…/index.html` request — canonical-redirect
   to the no-slash route, so the runtime path cannot be stepped around by URL shape. Template root
   validation is tightened on the same path. (Both are Codex's in-flight source fixes; this guide
   describes the intended served behaviour.)

**Fail-closed, on purpose.** The stale prerendered copy is exactly the thing that may still be
asserting an advisory that has run out, so it is never used as a fallback:

- Missing `dist/ssr/entry-ssr.js` → the server refuses to start (`missing-ssr-bundle`).
- Both new artifacts absent, i.e. a build from before this path existed → refuses to start
  (`legacy-build`), naming the rebuild.
- One artifact present and the other missing → refuses to start (`incomplete-artifacts`).
- Manifest that is not a JSON array of route strings, or an empty/non-HTML template → refuses to
  start (`corrupt-manifest`, `corrupt-template`).
- Renderer that will not load or exports no `render` → refuses to start (`renderer-unloadable`,
  `renderer-invalid`).
- A per-request render failure, or an empty rendered body → **503** with `Cache-Control: no-store`
  and `Retry-After`, never the dated snapshot.
- An empty manifest is valid: nothing consumes status, so nothing needs re-rendering.
- Development is unaffected. The dev server renders from source, where status is always live.

**In the browser.** `client/src/lib/asOf.tsx` holds the instant for a render: the server passes its
snapshot, and the browser tracks the clock and refreshes at the exact next Chicago midnight
(computed, not assumed, so it holds across both DST transitions). A tab left open overnight therefore
drops an advisory that has run out, and `useHead` replaces the page's JSON-LD with it. That
replacement is ownership-scoped: it removes only schema this application emitted — the
`data-ssr-schema` blocks from the prerenderer or runtime renderer and its own `data-head-schema`
blocks — and leaves any unrelated head schema alone. One copy of each schema, no stale SSR script
left behind.

## Weekly update

1. Edit the rink's `state`, `note`, `covered_from`, `covered_through`, and `updated`.
2. Keep `source_url` pointed at the source that confirms *that* change: the academy portal for
   academy ice, the public booking system for public skate.
3. Commit and push to GitHub, then pull the commit into Replit.
4. Run `npm run check` and `npm run build`. The build regenerates `dist/ssr/status-routes.json` and
   `dist/ssr/template.html`, which the server requires.
5. Ryan republishes manually. Nothing here auto-deploys, and no deployment is part of this change.

Between republishes the covered-date expiry still works on the served HTML, because the status pages
are re-rendered per request. A rebuild is needed to change the *content* of a notice, not to let an
existing one expire.

### Limitation worth remembering

If `dist/public` is ever served directly — a CDN, a proxy, or a static host in front of or instead of
this Express app — the runtime path and its fail-closed guard are bypassed, and that copy can serve
an expired advisory until the next rebuild. The guarantee above holds for traffic that reaches the
Express server.

## Guardrails

- Publish only a public-facing schedule change. Never reproduce a private training grid, a class
  grid, exact session times, or a private email.
- Keep the note pointer-only: what changed, which dates, where to confirm.
- Do not infer public-skate availability from academy ice, or the reverse.
- Keep `verified_by` honest.
- Always set the covered dates. A note without them will not display.
- Delete the entry when there is no current information to publish.
