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
- **Single source of truth**: All blog post metadata lives in `client/src/data/blog-posts.json`
- **Client registry**: `client/src/data/blogRegistry.ts` imports from `blog-posts.json` and calls `registerPost()` for each entry
- **Server sitemap**: `server/routes.ts` imports the same `blog-posts.json` directly for sitemap generation
- **Utilities**: Front matter parsing, excerpt extraction in `client/src/lib/blog.ts`
- **Routes**: `/blog` (index), `/blog/:slug` (individual posts)
- **Features**: Category filtering, related posts by category, JSON-LD structured data, byline, rehypeRaw for HTML rendering
- **Typography**: `@tailwindcss/typography` plugin for prose styling
- **Dynamic rink linking**: Set `hasDynamicRinkLinks: true` in blog-posts.json; use `[RINK: exact-db-slug]` in markdown
- **Adding a new blog post**:
  1. Create `.md` file in `client/public/posts/`
  2. Add one entry to `client/src/data/blog-posts.json` — this is the only metadata file; both the client blog and server sitemap read from it automatically

## Sitemap
- **Auto-generated**: `/sitemap.xml` is dynamically generated in `server/routes.ts`
- **Includes**: Homepage, browse page, freestyle hub, all state hubs, all individual rink pages, blog index, and all blog posts
- **Single source**: Both blog index and sitemap read from `blog-posts.json` — no duplicate data files to maintain
- **Rink data**: Pulled from `client/src/data/rinks.json` (slugs include location suffix, e.g., `ford-ice-center-antioch-antioch-tn`)

## Navigation
- Text links: Freestyle, Learn to Skate, Skate Sharpening, Blog
- Styled "Find a Rink" button
- Footer: 3-column layout (logo/description, Directory links, Top States)

## Important Files
- `client/src/data/rinks.json` — Rink data
- `client/src/data/blog-posts.json` — Blog post metadata (single source of truth for client + server)
- `client/src/data/blogRegistry.ts` — Imports blog-posts.json and registers posts for client use
- `client/src/lib/data.ts` — Data helpers and types
- `client/src/lib/blog.ts` — Blog utilities (registerPost, getCategories, getRelatedPosts, etc.)
- `client/public/posts/` — Markdown blog post files
- `server/routes.ts` — Sitemap, robots.txt, blog image API
- `client/src/pages/Home.tsx` — Homepage
- `client/src/pages/Browse.tsx` — Rink browser
- `client/src/pages/BlogIndex.tsx` — Blog listing page
- `client/src/pages/BlogPost.tsx` — Individual blog post page
- `client/src/pages/NashvilleHub.tsx` — Nashville city hub
- `client/src/components/Layout.tsx` — Site layout with nav and footer
- `client/src/App.tsx` — Route definitions

## Images
- 5 images in `attached_assets/` served via `/attached_assets` route
- Blog post images assigned via `/api/blog/image/:slug` endpoint, stored in `client/public/data/post-image-map.json`
