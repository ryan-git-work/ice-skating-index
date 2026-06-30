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

Valid states are `normal`, `altered`, and `closed`.

No entry means no status claim is shown. Use `normal` only when the regular schedule was explicitly and recently verified. After 10 days, every state becomes a neutral reminder to check the official schedule.

## Weekly update

1. Edit the rink's `state`, `note`, and `updated` date.
2. Keep `source_url` pointed at the current official schedule.
3. Commit and push the change to GitHub.
4. Pull the new commit into Replit.
5. Run `npm run check` and `npm run build`.
6. Ryan manually republishes the site.

The site is statically prerendered, so a Git commit by itself does not update the live status or stale guard.

## Guardrails

- Publish only a public-facing schedule change. Never reproduce a private training grid or private email.
- Keep the note conservative and include a reminder to confirm before visiting.
- Keep `verified_by` honest.
- Delete the entry when there is no current information to publish.
