import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Focus-reticle cursor: outer trailing ring + near-instant inner core.
 * On interactive elements the ring scales up and the core fades, creating
 * a targeting-reticle feel instead of a blob. Hidden on touch / reduced-motion.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  // Ring (trailing)
  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const srx = useSpring(rx, { stiffness: 170, damping: 22, mass: 0.9 });
  const sry = useSpring(ry, { stiffness: 170, damping: 22, mass: 0.9 });

  // Core (near-instant)
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const scx = useSpring(cx, { stiffness: 800, damping: 40, mass: 0.4 });
  const scy = useSpring(cy, { stiffness: 800, damping: 40, mass: 0.4 });

  const raf = useRef(0);
  const pending = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pointerFine || reduce) return;
    setEnabled(true);

    const flush = () => {
      if (pending.current) {
        rx.set(pending.current.x);
        ry.set(pending.current.y);
        cx.set(pending.current.x);
        cy.set(pending.current.y);
        pending.current = null;
      }
      raf.current = 0;
    };
    const onMove = (e: PointerEvent) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (!raf.current) raf.current = requestAnimationFrame(flush);

      const target = e.target as HTMLElement | null;
      const clickable = !!target?.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor]"
      );
      setActive(clickable);
    };
    const onLeave = () => setActive(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [rx, ry, cx, cy]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer ring — trailing, scales on hover */}
      <motion.div
        aria-hidden
        style={{ x: srx, y: sry }}
        className="pointer-events-none fixed left-0 top-0 z-[80] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ scale: active ? 1.5 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="h-8 w-8 rounded-full"
          style={{
            border: "1.5px solid var(--color-accent)",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 22px -2px var(--color-accent-glow)",
          }}
        />
      </motion.div>

      {/* Inner core — near-instant, always opaque */}
      <motion.div
        aria-hidden
        style={{ x: scx, y: scy }}
        className="pointer-events-none fixed left-0 top-0 z-[82] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ scale: active ? 1.4 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: "var(--color-accent)",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.9), 0 0 10px var(--color-accent-glow)",
          }}
        />
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
