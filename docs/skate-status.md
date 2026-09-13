# Skate Status update guide

`client/src/data/skate-status.json` powers the live status block on rink pages and status chips elsewhere.

## Record shape

```json
{
  "rink-slug": {
    "state": "altered",
    "note": "Plain-language public change, ending with a reminder to confirm before visiting.",
    "updated": "2026-06-29",
    "verified_by": "a local coach",
    "source_url": "https://official-schedule.example"
  }
}
```

Valid states are `normal`, `altered`, and `closed`. These describe Nashville Skating Academy ice at the listed facility, not public-skate availability. Headings and chips explicitly identify academy ice. Include the facility, academy scope, and exact covered dates in each note; send public skaters to the official schedule to confirm their session.

No entry means no status claim is shown. Use `normal` only when the academy's regular ice schedule was explicitly and recently verified. The guard becomes neutral when the floored record age exceeds 10 days (September 24 for a September 13 update). It is a freshness fallback, not expiry at the end of the note's date range.

## Weekly update

1. Edit the rink's `state`, `note`, and `updated` date.
2. Keep `source_url` pointed at the current official schedule.
3. Commit and push the change to GitHub.
4. Pull the new commit into Replit.
5. Run `npm run check` and `npm run build`.
6. Ryan manually republishes the site.

The site is statically prerendered, so a Git commit by itself does not update the live status or stale guard. Static HTML retains the build-time status until rebuilt and republished; browser rendering reevaluates freshness when loaded. Refresh or remove a dated notice after its covered week; do not rely on the guard for week-end expiry.

## Guardrails

- Publish only a public-facing schedule change. Never reproduce a private training grid or private email.
- Keep the note conservative and include a reminder to confirm before visiting.
- Keep `verified_by` honest.
- Delete the entry when there is no current information to publish.
