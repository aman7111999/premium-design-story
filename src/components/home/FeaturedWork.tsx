import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useProjects } from "@/lib/cms";
import { Reveal } from "@/components/Reveal";

export function FeaturedWork() {
  const reduce = useReducedMotion();
  const { data: projects } = useProjects({ publishedOnly: true });
  const items = (projects ?? []).slice(0, 4);

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
              Projects that shipped &<br />
              <span className="font-serif italic text-[var(--color-accent)]">moved the needle.</span>
            </h2>
          </div>
          <Link to="/work" className="glass-pill hover:text-[var(--color-accent)] transition-colors">
            View all projects <ArrowUpRight size={14} />
          </Link>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/projects/${p.slug}`}
              className="liquid-glass group block overflow-hidden p-5 md:p-6"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-hairline)]">
                {p.thumbnail_url ? (
                  <img
                    src={p.thumbnail_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="h-full w-full"
                    style={{
                      background:
                        "radial-gradient(120% 100% at 20% 10%, color-mix(in oklab, var(--color-accent) 35%, transparent) 0%, transparent 55%), linear-gradient(180deg, var(--color-elevated), var(--color-surface))",
                    }}
                  />
                )}
                <span className="glass-pill absolute left-4 top-4 !py-1 !px-3 text-[11px] uppercase tracking-[0.1em]">
                  {p.category ?? "Case study"}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-xl md:text-2xl font-semibold">{p.title}</h3>
                  {p.short_description && (
                    <p className="mt-1 truncate text-sm text-[var(--color-muted)]">
                      {p.short_description}
                    </p>
                  )}
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-contrast)] transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p className="text-[var(--color-muted)]">No projects yet.</p>
        )}
      </div>
    </section>
  );
}
