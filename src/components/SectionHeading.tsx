import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { clsx } from "clsx";

type Props = {
  eyebrow?: string;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, right, className }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className={clsx("relative pb-6", className)}
    >
      <motion.div
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
        }}
        style={{ transformOrigin: "0% 50%" }}
        className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-hairline)]"
      />
      <div className="flex items-end justify-between gap-6">
        <div>
          {eyebrow && (
            <motion.p
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              className="text-xs uppercase tracking-widest text-[var(--color-muted)]"
            >
              {eyebrow}
            </motion.p>
          )}
          {title && (
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="font-display text-3xl md:text-5xl mt-3"
            >
              {title}
            </motion.h2>
          )}
        </div>
        {right && (
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            {right}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
