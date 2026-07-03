import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "framer-motion";
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
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const y = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.4 });

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block"
      aria-label={`${project.title} — ${project.company}`}
    >
      <motion.div
        ref={ref}
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduce ? undefined : { y: -6 }}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-hairline transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-30px_rgba(11,11,12,0.25)]"
        style={{ background: gradients[project.cover] ?? gradients["gradient-1"] }}
      >
        {/* Parallax visual layer */}
        <motion.div
          aria-hidden
          style={{ y: reduce ? undefined : y, background: gradients[project.cover] ?? gradients["gradient-1"] }}
          className="absolute -inset-8 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        {/* Soft sheen on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <span className="rounded-full bg-white/50 px-3 py-1 text-xs backdrop-blur-sm">
              {project.category}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="text-[var(--color-ink)] overflow-hidden">
            <p className="text-xs uppercase tracking-widest opacity-70 transition-transform duration-500 group-hover:-translate-y-0.5">
              {project.company}
            </p>
            <p className="font-display text-2xl leading-tight mt-1 transition-transform duration-500 group-hover:-translate-y-0.5">
              {project.title}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-sm text-[var(--color-muted)]">
          {project.role} · {project.duration}
        </p>
        <span className="text-xs uppercase tracking-widest text-[var(--color-muted)] opacity-0 -translate-x-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
          Read case →
        </span>
      </div>
    </Link>
  );
}
