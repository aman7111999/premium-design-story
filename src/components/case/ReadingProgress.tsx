import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { useState } from "react";

/**
 * Thin accent-colored reading progress bar fixed under the nav.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <motion.div
        style={{ scaleX: p, transformOrigin: "0 0" }}
        className="h-full w-full bg-[var(--color-accent)]"
      />
    </div>
  );
}
