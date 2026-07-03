import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Animates the numeric part of a value string (e.g. "-38%", "146", "AA", "6/6").
// Non-numeric strings are rendered as-is.
export function CountUp({
  value,
  duration = 1600,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^(-?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match || reduce) {
      setDisplay(value);
      return;
    }
    const [, sign, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = (numStr.split(".")[1] ?? "").length;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const current = target * eased;
      setDisplay(`${sign}${current.toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
