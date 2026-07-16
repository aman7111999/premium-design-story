import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useProjects, useContent } from "@/lib/cms";
import { Reveal } from "@/components/Reveal";

type Data = {
  eyebrow: string;
  heading_line1: string;
  heading_line2: string;
  view_all_label: string;
  view_all_to: string;
};

const FALLBACK: Data = {
  eyebrow: "Selected Work",
  heading_line1: "Projects that shipped &",
  heading_line2: "moved the needle.",
  view_all_label: "View all projects",
  view_all_to: "/work",
};

export function FeaturedWork() {
  const reduce = useReducedMotion();
  const { data: projects } = useProjects({ publishedOnly: true });
  const { data: c } = useContent<Data>("home_featured", FALLBACK);
  const items = (projects ?? []).slice(0, 4);
  const d = c ?? FALLBACK;

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <span className="glass-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              {d.eyebrow}
            </span>
            <h2 className="mt-5 text-4xl md:text-6xl leading-[1.05]">
              {d.heading_line1}<br />
              <span className="font-serif italic text-[var(--color-accent)]">{d.heading_line2}</span>
            </h2>
          </div>
          <Link to={d.view_all_to} className="glass-pill hover:text-[var(--color-accent)] transition-colors">
            {d.view_all_label} <ArrowUpRight size={14} />
          </Link>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            className="min-w-0"
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
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-[22px] md:text-[24px] font-semibold tracking-[-0.015em]">{p.title}</h3>
                  {p.short_description && (
                    <p className="mt-1.5 truncate text-[15px] leading-relaxed text-[var(--color-muted)]">
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
