import { motion, useReducedMotion } from "framer-motion";

/**
 * Impact metric grid — token-driven, animated count-in.
 */
export function ImpactGrid({
  items,
}: {
  items: { label: string; value: string; hint?: string }[];
}) {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-[var(--space-4)] md:grid-cols-3">
      {items.map((m, i) => (
        <motion.div
          key={`${m.label}-${i}`}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)] p-[var(--space-6)] shadow-[var(--elevation-1)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(400px circle at 100% 0%, var(--color-accent-wash), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="eyebrow">{m.label}</p>
            <p className="mt-[var(--space-3)] font-display text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-[var(--tracking-tightest)] text-[var(--color-accent)]">
              {m.value}
            </p>
            {m.hint && (
              <p className="mt-[var(--space-3)] text-[13px] text-[var(--color-muted)]">
                {m.hint}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
