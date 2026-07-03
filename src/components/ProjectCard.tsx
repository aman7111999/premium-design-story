import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";

const gradients: Record<string, string> = {
  "gradient-1":
    "radial-gradient(120% 100% at 10% 0%, #F1EDE4 0%, #D9D3C4 45%, #B8AF9C 100%)",
  "gradient-2":
    "radial-gradient(120% 100% at 80% 20%, #F5E9E2 0%, #E5C7B8 40%, #8C6A5C 100%)",
  "gradient-3":
    "radial-gradient(120% 100% at 20% 80%, #E7EDE7 0%, #B6C5BE 40%, #3F5A55 100%)",
  "gradient-4":
    "radial-gradient(120% 100% at 60% 30%, #EDEAF3 0%, #C6BEDA 40%, #4E4570 100%)",
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const reduce = useReducedMotion();
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block"
      aria-label={`${project.title} — ${project.company}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-hairline"
        style={{ background: gradients[project.cover] ?? gradients["gradient-1"] }}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <span className="rounded-full bg-white/40 px-3 py-1 text-xs backdrop-blur">
              {project.category}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="text-[var(--color-ink)]">
            <p className="text-xs uppercase tracking-widest opacity-70">{project.company}</p>
            <p className="font-display text-2xl leading-tight mt-1">{project.title}</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-sm text-[var(--color-muted)]">
          {project.role} · {project.duration}
        </p>
      </div>
    </Link>
  );
}
