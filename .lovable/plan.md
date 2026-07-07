# Refinement: Premium brand mark + cursor treatment

Two small but high-signal fixes to the hero/nav so the first impression reads as senior and considered instead of "template with a blue dot."

## What changes

### 1. Name as a proper logo lockup (top-left of nav)
Replace the current `• Aman Mishra` inline text with a real brand lockup:

- **Monogram mark** — a compact `AM` glyph set in Geist Display, tight tracking (`-0.06em`), rendered inside a 28×28 rounded-square tile with a hairline border and a subtle inner gradient (`--color-elevated` → `--color-surface`). Sits on a whisper of accent glow instead of a solid blue dot.
- **Wordmark** — `Aman Mishra` beside the monogram, plus a muted `/ Product Designer` slug in mono (hidden on mobile). Uses `link-underline` on hover, not a color swap.
- Alignment tuned so the lockup optically centers with the nav pill regardless of scrolled/expanded state.

### 2. Retire the blue dots — introduce a premium accent language
The two "blue dots" (nav brand dot + hero "Available" pinging dot) both feel generic. Replace with a single, consistent motif used sparingly:

- **Nav** — drop the standalone dot entirely; the monogram tile carries the brand weight.
- **Hero status badge** — swap the pinging solid dot for a **concentric ring pulse**: a 6px accent ring with a 2px filled core, and a slow outward ring that fades (1.6s, ease-out), not a hard ping. Reads as a signal indicator, not a notification dot.
- **Cursor / interactive accents elsewhere** (scroll indicator arrow circle, CTA hover) — align to the same ring motif so the accent color appears as *linework*, not filled dots.

### 3. Cursor follower polish
The custom cursor is currently a solid accent dot with trail. Upgrade to match:

- **Outer ring** (18px, 1px accent border, 40% opacity) trailing with soft spring.
- **Inner core** (3px, filled accent) tracking near-instant.
- Scales the outer ring to `1.5×` and drops the core opacity on link/button/card hover — creates a "focus reticle" feel instead of a blob.
- Hidden on touch devices and when `prefers-reduced-motion` is set.

## Files touched
- `src/components/Navbar.tsx` — new lockup markup, remove brand dot
- `src/components/Hero.tsx` — replace pinging dot with ring pulse in the availability badge
- `src/components/CursorFollower.tsx` — split into ring + core, update hover targets
- `src/index.css` — add `@keyframes ring-pulse` and a `.ring-pulse` utility so the motif is reusable

## Not in scope
- No layout, color palette, font, or section-order changes
- No changes to Work, About, Writing, Contact, Resume routes
- No CMS / backend / Supabase changes
