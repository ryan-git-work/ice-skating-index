# Ice Skating Index - Blog Section Build Guide
## Replit Import Instructions and Prompt Template

---

## HOW TO USE THESE FILES

Each blog post file follows the same structure. At the top of every file
you will find metadata fields that map to your CMS or blog database.
Feed these into your Replit build with the prompt below.

---

## REPLIT PROMPT - Blog Section Builder

Paste this into your Replit AI assistant or project setup:

---

I am building a blog section for iceskatingindex.com.

Please create a blog system that:

1. RENDERS each blog post from a markdown file with these front-matter fields:
   - Slug (URL path)
   - Meta Description (for the meta description tag)
   - Target Keyword (primary SEO keyword)
   - Secondary Keywords (comma-separated)
   - Category (for filtering and tagging)
   - Post body in standard markdown

2. GENERATES individual post pages at each slug URL with:
   - Title tag using the H1 heading
   - Meta description populated from front matter
   - Clean readable typography
   - Related Posts section at the bottom by category

3. GENERATES a blog index page at /blog that:
   - Lists all posts with title, category, and excerpt
   - Supports filtering by category
   - Sorted by publish date newest first

4. USES this consistent post structure:
   - H1 title, intro paragraph, H2 sections, tables, CTA link at bottom
   - Byline: Published by Ice Skating Index

Posts are stored as markdown files in a /posts directory.
Start by scaffolding the blog index and a single post template.

---

## FILE NAMING CONVENTION

post-1-beginners-guide.md         ->  /blog/ice-skating-for-beginners
post-2-what-to-wear.md            ->  /blog/what-to-wear-ice-skating
post-3-hockey-vs-figure-skates.md ->  /blog/hockey-skates-vs-figure-skates
post-4-ice-skating-exercise.md    ->  /blog/is-ice-skating-good-exercise

---

## INTERNAL LINK PLACEHOLDER

Every post has this CTA: [Ice Skating Index](#)
Replace # with your actual rink finder path before publishing.
Example: [Ice Skating Index](/find-a-rink)

---

## SEO CHECKLIST BEFORE PUBLISHING

- H1 contains the target keyword
- Meta description under 160 characters includes target keyword
- First 100 words contain target keyword naturally
- 2-3 H2 subheadings contain secondary keywords
- Internal link to rink finder at bottom
- Images with descriptive alt text added before publishing
- Slug uses hyphens not underscores

---

## NEXT POSTS TO WRITE (priority order)

1. Best Ice Skating Rinks for Families with Kids
2. How to Stop on Ice Skates
3. Best Ice Skating Rinks in [City] - do for 5 major metros
4. 2026 Winter Olympics Figure Skating Recap - timely and high volume now
5. Ice Skating in Summer: Rinks Open Year Round

---

Ice Skating Index - Blog Build Package v1