import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "rail" | "wide" | "split" | "centered" | "bleed";

/**
 * Case-study section wrapper with editorial layout variants.
 *
 *  - "rail"     (default) — sticky chapter rail on the left, body column on the right
 *  - "wide"     — full-width body under a compact top header (for galleries, prototypes)
 *  - "split"    — 2-column body, chapter header spans the top
 *  - "centered" — single narrow editorial column, centered (for hero paragraphs, quotes)
 *  - "bleed"    — edge-to-edge body inside a bordered surface tile
 */
export function CaseSection({
  id,
  chapter,
  eyebrow,
  title,
  intro,
  children,
  className,
  variant = "rail",
  tone = "default",
}: {
  id: string;
  chapter: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: Variant;
  tone?: "default" | "surface" | "accent";
}) {
  const reduce = useReducedMotion();

  const surfaceCls = tone === "surface"
    ? "bg-[var(--color-surface)] border-y border-hairline"
    : tone === "accent"
      ? "bg-[color:var(--color-accent-wash)]"
      : "";

  const introEl = intro && (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="mt-[var(--space-6)] max-w-[62ch] text-[18px] leading-[var(--leading-normal)] text-[var(--color-text)]"
    >
      {intro}
    </motion.div>
  );

  const bodyEl = children && (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="mt-[var(--space-10)]"
    >
      {children}
    </motion.div>
  );

  const titleEl = (
    <motion.h2
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="display-2 max-w-[22ch]"
    >
      {title}
    </motion.h2>
  );

  const chapterMark = (className?: string) => (
    <div className={clsx("flex items-baseline gap-[var(--space-3)] md:items-start", className)}>
      <span className="font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent)]">
        {chapter}
      </span>
      <span aria-hidden className="h-px w-8 translate-y-[6px] bg-[var(--color-hairline-strong)]" />
      <span className="eyebrow">{eyebrow}</span>
    </div>
  );

  return (
    <section
      id={id}
      className={clsx(
        "scroll-mt-32 relative",
        "py-[var(--space-20)] md:py-[var(--space-24)]",
        surfaceCls,
        className,
      )}
    >
      <div className="container-page">
        {variant === "rail" && (
          <div className="grid gap-[var(--space-10)] md:grid-cols-[180px_1fr] md:gap-[var(--space-16)]">
            <aside className="md:sticky md:top-32 md:self-start">
              <div className="flex items-baseline gap-[var(--space-3)] md:flex-col md:items-start md:gap-[var(--space-2)]">
                <span className="font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent)]">
                  {chapter}
                </span>
                <span aria-hidden className="h-px w-8 bg-[var(--color-hairline-strong)] md:mt-[var(--space-2)]" />
                <span className="eyebrow">{eyebrow}</span>
              </div>
            </aside>
            <div>
              {titleEl}
              {introEl}
              {bodyEl}
            </div>
          </div>
        )}

        {variant === "wide" && (
          <div>
            {chapterMark("mb-[var(--space-6)]")}
            <div className="max-w-[62ch]">
              {titleEl}
              {introEl}
            </div>
            {bodyEl}
          </div>
        )}

        {variant === "split" && (
          <div>
            <div className="grid items-end gap-[var(--space-10)] md:grid-cols-12">
              <div className="md:col-span-5">
                {chapterMark("mb-[var(--space-6)]")}
                {titleEl}
              </div>
              {intro && <div className="md:col-span-6 md:col-start-7">{introEl}</div>}
            </div>
            {bodyEl}
          </div>
        )}

        {variant === "centered" && (
          <div className="mx-auto max-w-[68ch] text-center">
            {chapterMark("mb-[var(--space-6)] justify-center")}
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display-2 mx-auto max-w-[22ch]"
            >
              {title}
            </motion.h2>
            {intro && (
              <div className="mx-auto mt-[var(--space-6)] max-w-[62ch] text-left md:text-center">
                {introEl}
              </div>
            )}
            {bodyEl}
          </div>
        )}

        {variant === "bleed" && (
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-card)] p-[var(--space-10)] md:p-[var(--space-16)] shadow-[var(--elevation-2)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(600px circle at 0% 0%, var(--color-accent-wash), transparent 55%)",
              }}
            />
            <div className="relative">
              {chapterMark("mb-[var(--space-6)]")}
              <div className="max-w-[62ch]">
                {titleEl}
                {introEl}
              </div>
              {bodyEl}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
