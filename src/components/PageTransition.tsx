import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { variants } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div variants={variants.page} initial="hidden" animate="visible" exit="exit">
      {children}
    </motion.div>
  );
}
