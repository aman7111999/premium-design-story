
# Aman Mishra — Portfolio (Core build, GitHub Pages)

## Stack decision (locked)

Tear out the current TanStack Start scaffold and rebuild as a **React + Vite + React Router SPA**, deployable to GitHub Pages. All routing/rendering is client-side. SEO handled via `react-helmet-async` + prerendered `index.html` meta + a static `sitemap.xml` / `robots.txt` / `404.html` (copy of `index.html` for SPA fallback).

## What ships in this first pass

**Routes**
- `/` — Home (Hero, Featured Projects, Experience snapshot, Philosophy, Skills, Testimonials, Contact CTA, Footer)
- `/work` — All projects grid
- `/projects/:slug` — Case study template (renders MDX + frontmatter-driven sections)
- `/about` — Bio, timeline, values, tools
- `/contact` — Large-type contact page
- `*` — 404

Deferred to follow-ups: `/process`, `/playground`, `/resume`, command palette, image lightbox, theme toggle, search, cursor follower.

**Content model**

MDX for case studies (rich prose + inline components), JSON for structured lists.

```text
content/
  site.json               # name, tagline, socials
  navigation.json         # nav + footer links
  experience.json         # roles, dates, blurbs
  skills.json             # grouped skills
  testimonials.json       # quotes
  projects/
    _index.json           # slug order + featured flags
    blitz-design-system/
      index.mdx           # frontmatter (title, company, role, cover, metrics...) + case study body
      cover.jpg
```

Adding a project = new folder + `index.mdx` + images, plus a line in `_index.json`. No component edits. MDX is loaded via `import.meta.glob(..., { eager: true })` so it works with static Vite build.

**Case study page sections** (rendered from frontmatter + MDX):
Hero · Overview · Context/Problem/Goals · Role/Team/Timeline/Constraints · Research · IA/Flows · Wireframes · Iterations · Final Solution · Design System · Accessibility · Prototype embed slot · Impact/Metrics · Learnings · Next Project.
Includes sticky TOC, reading progress bar, prev/next nav.

**Motion**
- Framer Motion: hero reveal, stagger, scroll-reveal wrapper, shared-layout on project cards → case study hero, animated underlines, magnetic primary buttons.
- Lenis smooth scroll with `prefers-reduced-motion` bail-out.
- All motion gated on `useReducedMotion()`.

**Design language**
- Typography: Fraunces (display, editorial serif) + Inter Tight (body) via `@fontsource`. Tight tracking on display, generous leading on body.
- Palette (semantic tokens in `src/index.css`): near-black ink `#0B0B0C`, paper `#FAFAF7`, muted `#6B6B70`, hairline border `#E7E5DE`, single accent `#FF5A1F` (used sparingly for CTA + underline). Dark mode uses inverted ink/paper — theme toggle deferred but tokens ready.
- Grid: 12-col, generous gutters, max-width 1240px, editorial asymmetry on hero and case studies.
- No gradients, no glass, no drop-shadow decoration. Hairlines and space do the work.

**Components (built in this pass)**
Navbar (floating, transparent → solid on scroll, active state), Footer, Hero, ProjectCard, SectionHeader, Timeline, MetricCard, TestimonialCard, StickyTOC, ReadingProgress, Button (primary/ghost/magnetic), Tag, ScrollReveal wrapper, MDX component map.

**Accessibility**
Semantic landmarks, skip link, visible focus rings, ARIA on nav/toc, `prefers-reduced-motion` respected everywhere, WCAG AA contrast on both themes.

**SEO**
`react-helmet-async` per route: unique title, description, canonical, OG/Twitter tags. Home + each project ships JSON-LD (`Person` for home, `CreativeWork` for projects). Static `sitemap.xml` generated at build time from `content/projects/_index.json` via a small Vite plugin. `robots.txt` allows all.

## Technical section

**Cleanup (removed)**
`src/routes/`, `src/routeTree.gen.ts`, `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/styles.css`, TanStack Start Vite plugin, TanStack Router/Start deps, server middleware, Supabase integration files (not needed).

**New scaffold**
- `index.html` (Vite entry, root meta, font preloads)
- `src/main.tsx` — mounts `<BrowserRouter basename={import.meta.env.BASE_URL}>` + `HelmetProvider`
- `src/App.tsx` — routes + layout
- `src/index.css` — Tailwind v4 entry, `@theme` tokens, base resets
- `src/lib/lenis.tsx` — smooth scroll provider with reduced-motion guard
- `src/lib/content.ts` — loads MDX via `import.meta.glob('/content/projects/**/index.mdx', { eager: true })` and merges with `_index.json`
- `src/lib/seo.tsx` — `<Seo>` helper wrapping Helmet
- `src/components/*` — components listed above
- `src/pages/{Home,Work,Project,About,Contact,NotFound}.tsx`
- `content/**` — as above, seeded with 4 realistic case studies you can rewrite from your MDX

**Vite config**
- `@vitejs/plugin-react`, `@mdx-js/rollup` (with `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`), Tailwind v4 Vite plugin.
- `base: process.env.VITE_BASE ?? '/'` — set `VITE_BASE=/repo-name/` when deploying to a project page. Documented in README.
- Post-build step (in `package.json` `build` script) copies `dist/index.html` → `dist/404.html` for SPA deep-link fallback on GitHub Pages.
- Small custom plugin emits `dist/sitemap.xml` from project slugs.

**Deps to add**
`react-router-dom`, `framer-motion`, `@studio-freight/lenis`, `react-helmet-async`, `@mdx-js/rollup`, `@mdx-js/react`, `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`, `@fontsource/fraunces`, `@fontsource/inter-tight`, `clsx`, `tailwind-merge`.

**Deps to remove**
`@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin`, related Start server bits, `@supabase/*`.

**GitHub Pages files**
- `README.md` — install / dev / build / deploy steps, base-path note, custom-domain note.
- `.gitignore` — node_modules, dist, .env
- `LICENSE` — MIT (change if you want another)
- `public/robots.txt`, generated `sitemap.xml`, `404.html` fallback
- Optional `.github/workflows/deploy.yml` — GH Actions to build + publish `dist` to `gh-pages` branch on push to `main`. Included so deploy is truly one-click after enabling Pages.

**Content you'll paste in**
For each project: `content/projects/<slug>/index.mdx` with frontmatter:
```yaml
title, company, role, duration, category, cover, summary,
metrics: [{label, value}], team, timeline, constraints,
featured: true|false, order: 1
```
Body is free-form MDX with `<Gallery>`, `<Metric>`, `<Quote>` components from the MDX map.

I'll seed 4 realistic placeholders (Blitz Design System, Research Home, Meera AI, Fintech Dashboard) so the site is fully populated on first build — you overwrite the MDX with your real content whenever you're ready.

## Out of scope for this pass (called out so nothing is silently missing)

`/process`, `/playground`, `/resume` routes; command palette (⌘K); image lightbox; theme toggle UI (tokens ready); search; custom cursor follower; embedded live prototype iframes; Lighthouse tuning pass. All are one-turn follow-ups on top of this scaffold.
