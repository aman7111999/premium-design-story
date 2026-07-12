import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useProjects } from "@/lib/cms";
import { Reveal } from "@/components/Reveal";

export function FeaturedWork() {
  const reduce = useReducedMotion();
  const { data: projects } = useProjects({ publishedOnly: true });
  const items = (projects ?? []).slice(0, 6);

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <span className="glass-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Selected Work
            </span>
            <h2 className="mt-5 text-4xl md:text-6xl leading-[1.05]">
              See How I Helped Businesses{" "}
              <span className="font-serif italic text-[var(--color-accent)]">Stand</span> Online
            </h2>
          </div>
          <Link to="/work" className="glass-pill hover:text-[var(--color-accent)] transition-colors">
            View all projects <ArrowUpRight size={14} />
          </Link>
        </div>
      </Reveal>

      {/* Table-row list */}
      <div className="mt-14 liquid-glass overflow-hidden">
        <ul className="divide-y divide-[var(--color-hairline)]">
          {items.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link
                to={`/projects/${p.slug}`}
                className="relative grid items-center gap-6 px-6 py-7 md:grid-cols-[160px_1fr_auto] md:gap-10 md:px-10 md:py-8"
              >
                {/* Hover glow wash */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(60% 120% at 0% 50%, color-mix(in oklab, var(--color-accent) 14%, transparent) 0%, transparent 70%)",
                  }}
                />

                <span className="relative text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {p.category ?? "Case Study"}
                </span>

                <div className="relative min-w-0">
                  <h3 className="text-xl md:text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                    {p.title}
                  </h3>
                  {p.short_description && (
                    <p className="mt-2 line-clamp-2 max-w-xl text-[14px] leading-relaxed text-[var(--color-muted)]">
                      {p.short_description}
                    </p>
                  )}
                </div>

                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--color-hairline-strong)] text-[var(--color-text)] transition-all duration-300 group-hover:-rotate-45 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-contrast)]">
                  <ArrowUpRight size={18} strokeWidth={2.2} />
                </span>
              </Link>
            </motion.li>
          ))}
          {items.length === 0 && (
            <li className="px-10 py-10 text-[var(--color-muted)]">No projects yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
