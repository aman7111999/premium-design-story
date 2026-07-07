import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { clsx } from "clsx";

/**
 * Case-study section wrapper.
 * - Sticky chapter label on the left (desktop)
 * - Reveal-on-view heading
 * - Consistent scroll offset for TOC jumps
 * - Unique `variant` slots control the body layout
 */
export function CaseSection({
  id,
  chapter,
  eyebrow,
  title,
  intro,
  children,
  className,
  bleed = false,
}: {
  id: string;
  chapter: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <section
      id={id}
      className={clsx(
        "scroll-mt-32 relative",
        bleed ? "" : "container-page",
        "py-[var(--space-20)] md:py-[var(--space-24)]",
        className,
      )}
    >
      <div className={clsx(bleed && "container-page")}>
        <div className="grid gap-[var(--space-10)] md:grid-cols-[180px_1fr] md:gap-[var(--space-16)]">
          {/* Sticky chapter rail */}
          <aside className="md:sticky md:top-32 md:self-start">
            <div className="flex items-baseline gap-[var(--space-3)] md:flex-col md:items-start md:gap-[var(--space-2)]">
              <span className="font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent)]">
                {chapter}
              </span>
              <span
                aria-hidden
                className="h-px w-8 bg-[var(--color-hairline-strong)] md:mt-[var(--space-2)]"
              />
              <span className="eyebrow">{eyebrow}</span>
            </div>
          </aside>

          {/* Content column */}
          <div>
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display-2 max-w-[22ch]"
            >
              {title}
            </motion.h2>

            {intro && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-[var(--space-6)] max-w-[62ch] text-[18px] leading-[var(--leading-normal)] text-[var(--color-text)]"
              >
                {intro}
              </motion.div>
            )}

            {children && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-[var(--space-10)]"
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
