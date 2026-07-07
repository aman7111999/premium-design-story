import { motion, useReducedMotion } from "framer-motion";

/**
 * Impact metric grid — first item rendered as a "hero metric" occupying
 * a full row when there are 4+ items, otherwise a proportional grid.
 */
export function ImpactGrid({
  items,
}: {
  items: { label: string; value: string; hint?: string }[];
}) {
  const reduce = useReducedMotion();
  if (!items.length) return null;

  const [hero, ...rest] = items;
  const showHero = items.length >= 3;

  const restList = showHero ? rest : items;
  const cols =
    restList.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" :
    restList.length === 3 ? "md:grid-cols-3" :
    restList.length === 2 ? "md:grid-cols-2" :
    "md:grid-cols-1";

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      {showHero && <HeroMetric item={hero} reduce={!!reduce} />}
      <div className={"grid gap-[var(--space-4)] " + cols}>
        {restList.map((m, i) => (
          <motion.div
            key={`${m.label}-${i}`}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)] p-[var(--space-6)] shadow-[var(--elevation-1)] transition-shadow duration-[var(--dur-slow)] hover:shadow-[var(--elevation-2)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[var(--dur-slow)] group-hover:opacity-100"
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
    </div>
  );
}

function HeroMetric({
  item,
  reduce,
}: {
  item: { label: string; value: string; hint?: string };
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-card)] p-[var(--space-10)] shadow-[var(--elevation-2)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(700px circle at 90% 0%, var(--color-accent-wash), transparent 55%)," +
            "radial-gradient(500px circle at 0% 100%, var(--color-accent-wash), transparent 55%)",
        }}
      />
      <div className="relative flex flex-wrap items-end justify-between gap-[var(--space-8)]">
        <div>
          <p className="eyebrow">{item.label}</p>
          <p
            className="mt-[var(--space-4)] font-display leading-[0.9] tracking-[var(--tracking-tightest)] text-[var(--color-accent)]"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
          >
            {item.value}
          </p>
        </div>
        {item.hint && (
          <p className="max-w-sm text-[15px] leading-relaxed text-[var(--color-muted)]">
            {item.hint}
          </p>
        )}
      </div>
    </motion.div>
  );
}
