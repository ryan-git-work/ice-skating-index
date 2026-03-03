# Ice Skating Index

## Overview
A programmatic SEO directory for ice skating rinks featuring a clean, modern Nordic design. Built with React + Express + TypeScript.

## Architecture
- **Frontend**: React with Vite, Tailwind CSS, shadcn/ui components
- **Routing**: wouter for client-side routing
- **Data**: JSON-based content directory with Zod validation (no traditional database)
- **Design**: Nordic Clean aesthetic with ice blue palette (HSL 201 96% 32% primary)
- **Font**: Serif headings with sans-serif body text

## Key Patterns
- **isTruthy()**: Always use `isTruthy()` from `lib/data.ts` for filtering offerings/amenities/freestyle due to mixed data types (boolean, "true"/"false", "unknown", null)
- **Educational Pages**: Sidebar ToC → content sections → "Coming soon" callout → collapsible rinks section
- **City Hub URL Pattern**: `/tennessee/nashville-ice-skating`

## Blog System
- **Posts**: Stored as markdown files in `client/public/posts/`
- **Registry**: Post metadata registered in `client/src/data/blogRegistry.ts`
- **Utilities**: Front matter parsing, excerpt extraction in `client/src/lib/blog.ts`
- **Routes**: `/blog` (index), `/blog/:slug` (individual posts)
- **File naming**: `post-N-short-name.md` → slug from front matter
- **Features**: Category filtering, related posts by category, JSON-LD structured data, byline
- **Typography**: `@tailwindcss/typography` plugin for prose styling
- **Adding a post**: 1) Create `.md` file in `client/public/posts/`, 2) Add `registerPost()` call in `blogRegistry.ts`

## Navigation
- Text links: Freestyle, Learn to Skate, Skate Sharpening, Blog
- Styled "Find a Rink" button
- Footer: 3-column layout (logo/description, Directory links, Top States)

## Important Files
- `client/src/data/rinks.json` — Rink data
- `client/src/lib/data.ts` — Data helpers and types
- `client/src/lib/blog.ts` — Blog utilities
- `client/src/data/blogRegistry.ts` — Blog post metadata registry
- `client/public/posts/` — Markdown blog post files
- `client/src/pages/Home.tsx` — Homepage
- `client/src/pages/Browse.tsx` — Rink browser
- `client/src/pages/BlogIndex.tsx` — Blog listing page
- `client/src/pages/BlogPost.tsx` — Individual blog post page
- `client/src/pages/NashvilleHub.tsx` — Nashville city hub
- `client/src/components/Layout.tsx` — Site layout with nav and footer
- `client/src/App.tsx` — Route definitions

## Images
- 5 images in `attached_assets/` served via `/attached_assets` route
