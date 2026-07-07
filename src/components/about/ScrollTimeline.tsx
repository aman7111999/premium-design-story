import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export type Milestone = {
  id: string;
  year: string;
  title: string;
  place?: string;
  body?: string;
};

export function ScrollTimeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      {/* rail */}
      <span
        aria-hidden
        className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-hairline)] md:left-1/2"
      />
      {/* filled progress */}
      <motion.span
        aria-hidden
        style={{ height: reduce ? "100%" : lineHeight }}
        className="absolute left-4 top-0 w-px bg-[var(--color-accent)] md:left-1/2"
      />
      <ol className="relative space-y-[var(--space-12)]">
        {items.map((m, i) => {
          const flip = i % 2 === 1;
          return (
            <li
              key={m.id}
              className={`relative grid grid-cols-1 gap-[var(--space-6)] pl-12 md:grid-cols-2 md:pl-0 ${
                flip ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              {/* Dot */}
              <motion.span
                aria-hidden
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-40%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-[9px] top-2 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border border-hairline bg-[var(--color-bg)] md:left-1/2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              </motion.span>

              {/* Side A: year */}
              <div className={`md:px-[var(--space-8)] ${flip ? "md:text-left" : "md:text-right"}`}>
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30%" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-4xl md:text-6xl leading-none tracking-tight"
                >
                  {m.year}
                </motion.p>
                {m.place && <p className="eyebrow mt-[var(--space-2)]">{m.place}</p>}
              </div>

              {/* Side B: body */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30%" }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="md:px-[var(--space-8)]"
              >
                <h4 className="font-display text-xl md:text-2xl">{m.title}</h4>
                {m.body && (
                  <p className="mt-[var(--space-3)] text-[15px] leading-relaxed text-[var(--color-muted)]">
                    {m.body}
                  </p>
                )}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
