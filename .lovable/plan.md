# Redesign Homepage — Dark Emerald Portfolio

Rebuild the site's look and homepage structure to match the attached reference. Portfolio-only (no pricing/marketplace). Also add light and dark theme toggle 

## Design tokens (update `src/index.css`)

- Background: `#0A0F0D` (near-black with green tint); surface `#0F1613`; card `#111A16`; hairlines `#1E2A24`
- Accent: `#00E28A` (neon emerald); accent-contrast `#001A10`
- Text: `#E8F1EC`; muted `#8A9A92`
- Glow: `0 0 40px rgba(0,226,138,0.35)` for CTAs and accent orbs
- Keep Instrument Serif for italic accents; body sans stays

## Homepage sections (`src/pages/Home.tsx` + new components)

1. **Hero — "Meet the Expert"**
  - Top pill: avatar + name on left, small "Available" status pill (green dot), CTA button on right — all inside one liquid-glass rounded pill (like reference top bar)
  - Big headline: "Meet the Expert **Product Designer**" (mix bold sans + italic serif emerald word)
  - Sub copy + primary CTA "Let's Talk" (emerald with glow) and secondary "See Work"
  - Right side: circular portrait with orbiting dotted ring + small floating icon chips (Figma, Framer badges)
  - Faint grid background + emerald radial glow
2. **"Crafting Next-Horizon Experiences" — services grid**
  - 6 cards in bento layout (2 large + 4 small) on dark surface with subtle hairline
  - Cards: UI/UX Design, Framer Development, Webflow / No-code, Design Systems, Motion, Prototyping (map to your actual skills)
  - Each card: eyebrow, title, short copy, small illustrated visual (emerald line-art / icon), hover lift + emerald edge glow
3. **Featured Projects** (keep existing `ProjectCard` grid, restyle to dark cards with emerald hover ring)
4. **"Designing Websites that Inspire & Convert" — stats + portrait band**
  - Left: eyebrow + heading + 3 metrics (years, projects, satisfaction)
  - Right: portrait card with quote overlay
5. **Testimonials** — 3-column card grid, dark cards, 5-star row, avatar + name/role
6. **FAQ** — accordion, left heading + right questions column
7. **Final CTA — "Let's Build Something Amazing"**
  - Full-width dark band with emerald glow, big centered headline, email CTA
  - Faint browser-mockup collage strip along the bottom edge
8. **Footer** — restyle to match (dark, emerald accent links)

## Motion (referencing the attached video)

- Hero portrait: subtle continuous float (y ±6px, 6s ease-in-out) + dotted ring slow rotate (40s linear)
- Section reveals: `Reveal` component with y:24 → 0, blur 8→0, 0.7s cubic-bezier(0.22,1,0.36,1), staggered by index
- Service cards: on hover, scale 1.02 + emerald border glow ease-out 300ms; icon does small y-lift
- CTA buttons: emerald glow pulse (opacity 0.6→1 loop 2.6s) + magnetic hover
- Numbers in stats: `CountUp` on in-view
- Testimonial row: horizontal auto-marquee (pauses on hover)
- Page transitions: existing `PageTransition` keeps fade+scale

## Files to change

- `src/index.css` — swap palette to dark emerald tokens; add `.glow-emerald`, `.card-dark`, marquee keyframes
- `src/pages/Home.tsx` — rebuild section order
- `src/components/Hero.tsx` — rebuild as "Meet the Expert" layout with portrait
- New: `src/components/home/ServicesBento.tsx`, `StatsBand.tsx`, `TestimonialsRow.tsx`, `FaqSection.tsx`, `FinalCta.tsx`
- `src/components/Navbar.tsx` — tighten to match reference top pill (avatar left, links center, emerald CTA right)
- `src/components/Footer.tsx` — dark restyle
- Force dark theme as default in `src/lib/theme.tsx`

## Out of scope

- Pricing tiers / template marketplace (per your answer)
- No new backend, no CMS schema changes

## Technical notes

- All colors go through CSS vars — no hardcoded hex in components
- Reuse existing `Reveal`, `CountUp`, `MagneticButton`, `liquid-glass` utility
- Portrait: uses `site.profile_image_url` from CMS; fallback to initials
- Services/FAQ content: hardcoded initially (can be moved to CMS later)