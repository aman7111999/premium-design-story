import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

// Cinematic hero visual: cursor-reactive spotlight + floating UI cards
// arranged as a design-system tableau. Uses SVG so it renders crisp
// at any size and reads as an editorial product-thinking diagram.
export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Normalized -1..1 for cursor position within stage.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 15, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 15, mass: 0.6 });

  // Spotlight offsets (px)
  const lightX = useTransform(smx, (v) => 50 + v * 30);
  const lightY = useTransform(smy, (v) => 40 + v * 30);
  const spotBg = useTransform(
    [lightX, lightY] as never,
    ([lx, ly]: number[]) =>
      `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,90,31,0.18), rgba(255,90,31,0) 55%)`,
  );

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Per-card parallax transforms
  const layer = (depth: number) => ({
    x: useTransform(smx, (v) => v * depth),
    y: useTransform(smy, (v) => v * depth),
  });
  const l1 = layer(-14);
  const l2 = layer(22);
  const l3 = layer(-30);
  const l4 = layer(10);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-hairline bg-[#F4F1EA]"
      aria-hidden
    >
      {/* Blueprint grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden>
        <defs>
          <pattern id="hero-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#0b0b0c" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Cursor-reactive spotlight */}
      <motion.div className="absolute inset-0" style={{ background: spotBg }} />

      {/* Slowly rotating diagram ring */}
      <motion.svg
        className="absolute -right-16 -top-16 h-64 w-64 opacity-40"
        viewBox="0 0 200 200"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="#0b0b0c" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#0b0b0c" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx="100" cy="10" r="3" fill="#ff5a1f" />
      </motion.svg>

      {/* Floating UI cards */}
      {/* Card 1 — component card */}
      <motion.div
        style={{ x: l1.x, y: l1.y }}
        className="absolute left-[8%] top-[10%] w-[62%] rounded-md border border-black/10 bg-white p-4 shadow-[0_20px_50px_-30px_rgba(11,11,12,0.35)]"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Component / Button</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-8 flex-1 rounded bg-[var(--color-ink)]" />
          <div className="h-8 w-16 rounded border border-black/20" />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1.5 rounded-full" style={{ background: ["#0b0b0c","#6b6b70","#c9c4b8","#ff5a1f"][i] }} />
          ))}
        </div>
      </motion.div>

      {/* Card 2 — metric */}
      <motion.div
        style={{ x: l2.x, y: l2.y }}
        className="absolute right-[6%] top-[28%] w-[52%] rounded-md border border-black/10 bg-white p-4 shadow-[0_20px_50px_-30px_rgba(11,11,12,0.35)]"
      >
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Ship time</p>
        <p className="font-display text-3xl leading-none mt-2">−38%</p>
        <svg viewBox="0 0 100 30" className="mt-3 h-8 w-full">
          <path d="M0 22 L15 18 L30 20 L45 12 L60 14 L75 8 L100 4" fill="none" stroke="#0b0b0c" strokeWidth="1.2" />
          <path d="M0 22 L15 18 L30 20 L45 12 L60 14 L75 8 L100 4 L100 30 L0 30 Z" fill="#ff5a1f" opacity="0.12" />
        </svg>
      </motion.div>

      {/* Card 3 — token swatches */}
      <motion.div
        style={{ x: l3.x, y: l3.y }}
        className="absolute left-[12%] bottom-[14%] w-[46%] rounded-md border border-black/10 bg-white p-4 shadow-[0_20px_50px_-30px_rgba(11,11,12,0.35)]"
      >
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Tokens / Surface</p>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {["#0b0b0c","#2d2d2d","#6b6b70","#c9c4b8","#fafaf7"].map((c) => (
            <div key={c} className="aspect-square rounded" style={{ background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }} />
          ))}
        </div>
      </motion.div>

      {/* Card 4 — cursor label pill */}
      <motion.div
        style={{ x: l4.x, y: l4.y }}
        className="absolute right-[12%] bottom-[10%] flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 shadow-[0_15px_40px_-25px_rgba(11,11,12,0.35)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest">Prototype v3.2</span>
      </motion.div>

      {/* Corner tick marks — blueprint feel */}
      <Ticks />
    </div>
  );
}

function Ticks() {
  const c = "absolute h-3 w-3 border-[var(--color-ink)]";
  return (
    <>
      <span className={`${c} left-2 top-2 border-l border-t`} />
      <span className={`${c} right-2 top-2 border-r border-t`} />
      <span className={`${c} left-2 bottom-2 border-l border-b`} />
      <span className={`${c} right-2 bottom-2 border-r border-b`} />
    </>
  );
}
