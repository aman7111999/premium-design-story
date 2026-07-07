import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { variants, viewport } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
};

/**
 * Legacy Reveal — kept for backwards compatibility.
 * New code should import { FadeUp, BlurReveal, ScaleReveal } from "@/components/motion".
 */
export function Reveal({ children, className, delay = 0, once = true }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={variants.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewport, once }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
