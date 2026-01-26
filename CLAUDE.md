# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A high-performance personal portfolio and digital garden for a security consultant and systems engineer. Built with **Astro v5**, **React 19**, and **Tailwind CSS v4**. The site features an interactive bento grid layout with real-time status components (GitHub, Discord, Spotify), an advanced blog system with MDX support, and a premium "Cyber-Glass" design aesthetic.

**Key characteristics:**
- Static site generation (SSG) with selective React hydration (islands architecture)
- "Systems Engineer Hacker" aesthetic: sharp edges, monospace fonts, dark mode default
- Custom cursor (PixelTrail), hidden system cursor
- Real-time integrations via React components with Discord Lanyard API

## Commands

### Development
```bash
npm run dev          # Start dev server on http://localhost:4321
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Deployment
- **Platform**: Vercel
- **Config**: `astro.config.mjs` with Vercel adapter
- Automatic deployments from `main` branch

## Architecture

### Content Management (Type-Safe Collections)

The site uses **Astro Content Collections** for type-safe content management:

- **Blog posts**: `src/content/blog/`
  - Supports `.md` and `.mdx` files
  - Schema defined in `src/content/config.ts`
  - Hierarchical posts supported via folder structure (e.g., `japan-trip/day-1.md`)
  - Helper utilities in `src/lib/subpost-utils.ts` for parent/child relationships
  - Frontmatter fields: `title`, `description`, `date`, `updated`, `draft`, `tags`, `authors[]`, `cover`, `thumbnail`, `order`

- **Authors**: `src/content/authors/`
  - Multi-author blog support
  - Schema: `name`, `bio`, `pronouns`, `avatar`, social links (`website`, `github`, `twitter`, `linkedin`, `discord`, `mail`)

### Layout System

**BaseLayout** (`src/layouts/BaseLayout.astro`):
- Wraps all pages
- Handles SEO meta tags, Open Graph, Twitter cards
- Includes Header, Footer, PixelTrail cursor, Search
- Theme initialization script (prevents flash on load)
- Uses Astro ViewTransitions for smooth page navigation

### Component Architecture

**Bento Grid Components** (`src/components/bento/`):
- Interactive dashboard tiles for homepage
- Each component is a React island (client-side hydration)
- Examples: `DiscordPresence.tsx`, `SpotifyPresence.tsx`, `GitHubProfile.tsx`, `BugBountyCard.tsx`, `RetroTV.tsx`, `XCard.tsx`
- All wrapped in `FeatureCard` (from `src/components/ui/`) which handles noise texture, borders, hover effects

**UI Components** (`src/components/ui/`):
- `FeatureCard.tsx`: Base wrapper for bento items (noise overlay, borders, spotlight on hover)
- `PixelTrail.tsx`: Custom cursor component (`client:only="react"`)

**Page Components** (`src/components/`):
- Mostly `.astro` files for static generation
- React `.tsx` components used where interactivity is needed
- Examples: `Header.astro`, `Footer.astro`, `TableOfContents.tsx`, `Search.astro`, `Breadcrumb.astro`

### Routing

Standard Astro file-based routing in `src/pages/`:
- `index.astro` - Homepage with bento grid
- `about.astro` - About page
- `blog/` - Blog index and dynamic post routes
- `authors/` - Author profile pages
- `tags/` - Tag archive pages
- `api/github.ts` - Server endpoint for GitHub data
- `rss.xml.js` - RSS feed generation

### Styling System

**Tailwind CSS v4** with custom theming:
- `src/styles/global.css` - Color system, theme definitions, glass effects
- `src/styles/typography.css` - Optimized reading styles for blog posts
- Uses `@theme inline` directive (Tailwind v4 syntax)
- **Color system**: OKLCH color space for modern gradients
- **Font**: JetBrains Mono (monospace) for everything
- **Custom CSS variables**: `--background`, `--foreground`, `--primary`, `--border`, etc.

**Theme system:**
- Default theme is "dark" (Mono/Neutral: black background, white text)
- Custom themes stored in localStorage
- Theme persistence via inline script in `BaseLayout.astro`
- Color picker is hidden (Easter egg accessible via theme toggle)

### Design System Rules (from .cursorrules)

**Critical constraints:**
1. **NO ROUNDED CORNERS** - All UI elements must be sharp-edged (`rounded-none`)
   - Exception: Circular avatars if they fit the design
2. **Mono aesthetic** - White foreground, black background, neutral borders
3. **Bento grid layout** - Gap-based, no grid borders, negative space defines structure
4. **Custom cursor** - System cursor is hidden (`cursor: none`), replaced with PixelTrail
5. **Animations** - Keep snappy (<0.3s) using `framer-motion`

### Blog System Features

- **MDX support**: Can use React components in markdown
- **Series/subposts**: Parent posts can have child posts (see `subpost-utils.ts`)
- **Code highlighting**: `astro-expressive-code` with `vitesse-dark` theme
- **Math rendering**: KaTeX via `rehype-katex` and `remark-math`
- **External links**: Auto-add `target="_blank"` and security attributes
- **Search**: Pagefind integration (triggered with `Cmd+K`)
- **RSS feed**: Generated at `/rss.xml`

### Configuration Files

- `astro.config.mjs` - All framework configuration, plugins, markdown processing
- `src/consts.ts` - Site metadata (`SITE`, `SOCIAL_LINKS`, `NAV_LINKS`, `DISCORD_USER_ID`)
- `src/content/config.ts` - Content collection schemas
- `tsconfig.json` - TypeScript config with path aliases (`@/*`, `@/components/*`, etc.)
- `.env` - Environment variables:
  - `PUBLIC_GIPHY_API_KEY` (optional)
  - `GITHUB_TOKEN` (optional, for API rate limits)

### Integration Points

- **Discord**: Lanyard API via `react-use-lanyard` package
- **GitHub**: Custom API route at `/api/github.ts` for contribution data
- **Spotify**: Via Discord Lanyard (shows currently playing)
- **Vercel**: Deployment adapter configured in `astro.config.mjs`

## Path Aliases

Use TypeScript path aliases for cleaner imports:
```typescript
@/*              → src/*
@/components/*   → src/components/*
@/layouts/*      → src/layouts/*
@/lib/*          → src/lib/*
@/styles/*       → src/styles/*
```

## Important Notes

- Avoid breaking the theme persistence script in `BaseLayout.astro` (inline script in `<head>`)
- Never re-add rounded corners to UI elements
- Keep bright/saturated colors for "states" only (Online, Error) - not default styles
- React components must use `client:*` directives appropriately:
  - `client:load` - Load immediately
  - `client:visible` - Load when visible
  - `client:only="react"` - Only render on client (for components with browser-only APIs)
- When adding new blog posts, follow the schema in `src/content/config.ts`
- For hierarchical posts, use folder structure: `parent/child.md`
