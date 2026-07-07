# Fix: Cursor visibility — premium but clearly visible

The current cursor is too faint (3px core + thin 18px ring at 55% opacity on a dark background) so it reads as invisible. Fix by making the reticle larger, higher contrast, and more sculpted — without losing the "quiet confidence" tone.

## Changes to `src/components/CursorFollower.tsx`

### Ring (trailing outer)
- Size **18px → 32px**.
- Border **1px → 1.5px**, color stays `--color-accent`.
- Default opacity **0.55 → 1**; add a subtle inner shadow ring for depth: `box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 18px -2px var(--color-accent-glow)`.
- Hover state: scale 1.5×, opacity stays 1, glow intensifies.

### Core (inner dot)
- Size **3px → 6px**.
- Solid `--color-accent` with a tight white halo (`box-shadow: 0 0 0 1.5px rgba(255,255,255,0.9)`) so it stays visible on both dark and light surfaces and on any background color.
- Hover state: scales to **1.4×** and stays opaque (was fading to 35% — that's what made it disappear).

### Contrast safety
- Add `mix-blend-mode: normal` (was inherited); no blend tricks — pure additive glow is what keeps it readable on gradient hero backgrounds.
- Increase z-index of core to sit above the ring's inner area.

### Untouched
- Trailing spring stiffness/damping (feel stays the same).
- Touch/reduced-motion guards.
- `cursor: none` scope.

## Not in scope
- No changes to nav, hero content, or any other component.
- No color/token additions.
