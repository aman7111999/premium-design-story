/**
 * Motion tokens — single source of truth for animation timing & easing.
 * Every motion primitive in the app should read from here.
 */
import type { Transition, Variants } from "framer-motion";

/* -------- Durations (seconds) -------- */
export const duration = {
  instant: 0.12,
  fast: 0.24,
  base: 0.4,
  slow: 0.6,
  slower: 0.9,
  hero: 1.2,
} as const;

/* -------- Easings -------- */
export const ease = {
  /** Editorial "out-expo-ish". Default for reveals. */
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  in: [0.7, 0, 0.84, 0] as [number, number, number, number],
  /** Small controlled overshoot for interactive feedback. */
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

/* -------- Spring presets -------- */
export const spring = {
  soft: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.9 },
  snappy: { type: "spring" as const, stiffness: 260, damping: 24, mass: 0.8 },
  magnetic: { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.6 },
} as const;

/* -------- Distances (px) — restraint is the point -------- */
export const distance = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
} as const;

/* -------- Shared transitions -------- */
export const t = {
  fast: { duration: duration.fast, ease: ease.out } satisfies Transition,
  base: { duration: duration.base, ease: ease.out } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.out } satisfies Transition,
  hero: { duration: duration.hero, ease: ease.out } satisfies Transition,
};

/* -------- Reusable variants -------- */
export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: distance.md },
    visible: { opacity: 1, y: 0, transition: t.slow },
  } satisfies Variants,

  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: t.base },
  } satisfies Variants,

  blurReveal: {
    hidden: { opacity: 0, filter: "blur(14px)", y: distance.sm },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: duration.slower, ease: ease.out },
    },
  } satisfies Variants,

  scaleReveal: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: duration.slow, ease: ease.out },
    },
  } satisfies Variants,

  /** Parent + child stagger for hero lockups. */
  stagger: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  } satisfies Variants,

  staggerChild: {
    hidden: { opacity: 0, y: distance.sm, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: duration.slow, ease: ease.out },
    },
  } satisfies Variants,

  page: {
    hidden: { opacity: 0, y: distance.xs },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
    exit: { opacity: 0, y: -distance.xs / 2, transition: { duration: duration.fast, ease: ease.in } },
  } satisfies Variants,

  section: {
    hidden: { opacity: 0, y: distance.md },
    visible: { opacity: 1, y: 0, transition: { duration: duration.hero, ease: ease.out } },
  } satisfies Variants,
} as const;

/** Standard viewport for whileInView. */
export const viewport = { once: true, margin: "-80px" } as const;
