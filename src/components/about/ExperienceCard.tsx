import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Badge, Tag } from "@/components/design";

export type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  highlights?: string[] | null;
};

function fmt(d?: string | null) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function ExperienceCard({ item, index }: { item: ExperienceRow; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const reduce = useReducedMotion();
  const period = [fmt(item.start_date), item.end_date ? fmt(item.end_date) : "Present"]
    .filter(Boolean)
    .join(" — ");

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)]"
      style={{ boxShadow: open ? "var(--elevation-3)" : "var(--elevation-1)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-[var(--space-6)] px-[var(--space-6)] py-[var(--space-5)] text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-[var(--space-3)]">
            <Badge tone="accent" size="sm">
              {String(index + 1).padStart(2, "0")}
            </Badge>
            <p className="eyebrow">{period}</p>
            {item.location && <p className="eyebrow text-[var(--color-subtle)]">· {item.location}</p>}
          </div>
          <h3 className="font-display text-2xl md:text-4xl mt-[var(--space-3)] leading-tight">
            {item.company}
          </h3>
          <p className="mt-[var(--space-1)] text-[var(--color-muted)]">{item.role}</p>
        </div>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-hairline text-[var(--color-text)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-hairline px-[var(--space-6)] py-[var(--space-6)]">
              {item.description && (
                <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--color-muted)]">
                  {item.description}
                </p>
              )}
              {item.highlights && item.highlights.length > 0 && (
                <ul className="mt-[var(--space-5)] space-y-[var(--space-3)]">
                  {item.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                      className="flex gap-[var(--space-3)] text-[15px] leading-relaxed"
                    >
                      <span className="mt-[10px] h-px w-6 shrink-0 bg-[var(--color-accent)]" />
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* accent glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-24 h-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, var(--color-accent-glow), transparent 70%)" }}
      />
    </motion.article>
  );
}
