import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

// Global cursor follower. Reads `data-cursor` attribute on hovered ancestors
// for contextual labels (e.g. "View case"). Hidden on touch / reduced motion.
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 400, damping: 40, mass: 0.5 });
  const raf = useRef(0);
  const pending = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pointerFine || reduce) return;
    setEnabled(true);

    const flush = () => {
      if (pending.current) {
        x.set(pending.current.x);
        y.set(pending.current.y);
        pending.current = null;
      }
      raf.current = 0;
    };
    const onMove = (e: PointerEvent) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (!raf.current) raf.current = requestAnimationFrame(flush);

      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(cursorEl?.dataset.cursor ?? null);

      const clickable =
        !!target?.closest("a, button, [role='button'], input, textarea, select, label");
      setActive(clickable);
    };
    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[80] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      >
        <motion.div
          animate={{
            width: label ? 92 : active ? 40 : 10,
            height: label ? 36 : active ? 40 : 10,
            borderRadius: label ? 999 : active ? 999 : 999,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="flex items-center justify-center border border-white/70 bg-transparent text-[11px] uppercase tracking-[0.14em] text-white"
        >
          <AnimatePresence mode="wait">
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap px-2"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <style>{`
        @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
          html, body { cursor: none; }
          a, button, [role='button'], input, textarea, select, label { cursor: none; }
        }
      `}</style>
    </>
  );
}
