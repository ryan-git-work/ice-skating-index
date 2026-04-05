# Replit Prompt: Import Rich Rink Content + Add FAQ Rendering

Paste this entire prompt into Replit AI.

---

I've added three new fields to some rinks in `client/src/data/rinks.json`:

1. **`description`** — already used in the About section, but now contains multi-paragraph text separated by `\n\n` instead of a single short sentence. Update the About section to render each paragraph as a separate `<p>` tag by splitting on `\n\n`.

2. **`what_to_know`** — a new string array field (e.g. `["Check the website for current public skating schedules before visiting.", "Skate rental is available at the front desk — no reservation needed.", ...]`). If a rink has this field and it's non-empty, render a **"What to Know Before You Go"** section below the About section, showing each item as a bullet point.

3. **`faq`** — a new array field containing objects with `question` and `answer` string properties. If a rink has this field and it's non-empty, render a **"Frequently Asked Questions"** section near the bottom of the rink detail page (below Sharpening, above the footer). Use an accordion/collapsible pattern — each question is a clickable header that expands to show the answer. Add `schema.org FAQPage` structured data (JSON-LD `<script>` tag) for these FAQ items.

**Steps to implement:**

1. Find the rink detail page component (likely in `client/src/pages/` or `client/src/components/` — search for where `rink.description` is rendered).

2. Update the About section to split `rink.description` on `\n\n` and render each chunk as a `<p>`.

3. After the About section, conditionally render a "What to Know Before You Go" section if `rink.what_to_know` exists and has items:
   - Section heading: "What to Know Before You Go"
   - Render as a `<ul>` list with each item as a `<li>`

4. Near the bottom of the page (after Sharpening, before the footer), conditionally render a FAQ accordion if `rink.faq` exists and has items:
   - Section heading: "Frequently Asked Questions"
   - Each FAQ item: clicking the question toggles the answer open/closed
   - Match the existing site design/styling

5. Add a `<script type="application/ld+json">` tag in the page `<head>` (or at the bottom of the component) with `FAQPage` schema when `rink.faq` is present:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here"
      }
    }
  ]
}
```

Make sure all new sections are only rendered when the relevant data fields are present and non-empty — existing rinks without these fields should look exactly the same as before.
