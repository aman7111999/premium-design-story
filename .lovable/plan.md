## Goal

Make every piece of visible copy, imagery, and structured content on the public site editable from the existing admin dashboard — no hardcoded strings left in section components.

## Current State

**Already CMS-driven (in DB + admin UI):** site settings (name, tagline, bio, email, location, profile image, resume, socials), projects, blogs, testimonials, experience, education, skills, SEO per-route.

**Currently hardcoded in components (needs to move):**
- **Hero:** headline (`Meet the Expert Product Designer`), highlighted word (`Expert`), subline, availability chip text, CTA labels, marquee brand list, orbiting tool icons/labels, badge sticker
- **Home / Featured Work:** eyebrow, heading, italic accent, "View all projects" link
- **Home / Experience section:** entire 3-role hardcoded list (DB `experience` exists but this section ignores it), heading, eyebrow
- **Home / StatsBand:** stat values + labels
- **Home / Testimonials:** 6 hardcoded testimonials + heading (DB table exists but section ignores it)
- **Home / FAQ:** 5 hardcoded Q&A + heading + subline
- **Home / FinalCta:** heading + subline + CTA
- **About page:** hero heading, meta chips, `PHILOSOPHY` (4), `WORKING_STYLE` (4), `BOOKS` (6), `FUN_FACTS` (5), `VALUES` (4), all section badges + headings
- **Contact page:** hero heading, italic accent, section labels, "Based in" card copy
- **Footer:** copyright suffix
- **Navbar:** link labels (About / Projects / Blog), CTA label

## Plan

### 1. Schema — add missing CMS surfaces

Single migration:

- **`home_sections`** — one row per section on `/`, editable JSON payload keyed by section id (`hero`, `featured_work`, `stats`, `faq`, `final_cta`, `experience_intro`, `testimonials_intro`). Each row: `section_id (pk)`, `enabled`, `sort_order`, `data jsonb`, timestamps.
- **`about_sections`** — same pattern for `/about` (`hero`, `philosophy`, `working_style`, `books`, `fun_facts`, `values`, section badges).
- **`contact_page`** — single-row (id=1) table: `heading`, `heading_accent`, `eyebrow`, `elsewhere_label`, `based_in_label`.
- **`nav_settings`** — single-row: `links jsonb` (array of {label, to}), `cta_label`, `mobile_cta_label`.
- **`footer_settings`** — single-row: `copyright_suffix`, `back_to_top_label`.
- **`hero_brands`** — many rows: `label`, `sort_order`, `enabled`.
- **`hero_tools`** — many rows: `label`, `icon_key` (matches an icon registry), `angle`, `orbit_radius`, `sort_order`, `enabled`.
- **`site_stats`** — many rows: `value`, `label`, `suffix`, `sort_order`, `enabled` (replaces hardcoded StatsBand).

All tables get: `GRANT SELECT ... TO anon, authenticated`, write access via `has_role(auth.uid(),'admin')`, `updated_at` trigger. Seed rows with the current hardcoded values so first render is unchanged.

### 2. Data layer

- Extend `src/lib/cms.ts` with typed hooks: `useHomeSection(id)`, `useAboutSection(id)`, `useContactPage()`, `useNavSettings()`, `useFooterSettings()`, `useHeroBrands()`, `useHeroTools()`, `useSiteStats()`.
- Wire each into `TanStack Query` with the existing query client.
- Types generated from Supabase after migration is approved.

### 3. Rewire public components

Replace every hardcoded string/array with the corresponding CMS hook. Every section keeps its exact current layout, motion, and design tokens — only the data source changes. Loading states use existing `Skeleton` component; empty state falls back to the seeded defaults so the site never looks broken during editing.

Files touched: `Hero.tsx`, `Navbar.tsx`, `Footer.tsx`, `components/home/*`, `pages/About.tsx`, `pages/Contact.tsx`.

### 4. Admin UI

Add to the existing `AdminLayout` sidebar. All editors reuse existing patterns (`RichEditor`, `ImageUploader`, `SortableList`, shadcn form components):

- **Home Sections** editor — accordion per section with fields matching that section's JSON schema; live preview link.
- **About Sections** editor — same pattern.
- **Hero** editor — headline, accent word, subline, availability chip, CTA labels, plus sortable Brands and Tools lists.
- **Stats** editor — sortable list of value/label/suffix rows.
- **FAQ** editor — sortable Q&A list (part of Home Sections).
- **Contact Page** editor — single form.
- **Navigation** editor — sortable link list + CTA labels.
- **Footer** editor — single form.

### 5. Verification

- Green build after each phase.
- Playwright snapshot of `/`, `/about`, `/contact` before → after; confirm pixel/text parity with seeded defaults.
- Manual admin flow: edit hero headline in admin → refresh public site → change visible.

## Technical Notes

- All new public-schema tables follow the required order: `CREATE TABLE` → `GRANT` → `ALTER ... ENABLE RLS` → `CREATE POLICY`. Anon gets `SELECT` only; writes gated by `has_role`.
- JSON payloads validated in the admin editor with `zod` before insert.
- Icon registry (`src/lib/iconRegistry.ts`) maps `icon_key` strings from `hero_tools` to `lucide-react` components so admins pick from a known set.
- Single migration approval, then all TS/TSX edits land in one pass.
- Rollout order to avoid partial-broken states: migration → hooks → rewire one section at a time (Hero → Home sections → About → Contact → chrome) → admin editors last.

## Scope Guardrails

- No visual redesign. Layout, colors, motion, spacing stay identical.
- No changes to existing tables' schemas (projects, blogs, testimonials, experience, education, skills, seo_settings, site_settings).
- Blog rendering, project case-study rendering, and admin auth flow are already CMS-driven — untouched.
- Icons in Hero orbit stay drawn from `lucide-react`; admins pick from a curated list (avoids arbitrary SVG uploads in v1).
