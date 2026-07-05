import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectRow } from "@/lib/cms";
import { projectGradient } from "@/lib/cms";

export function ProjectCard({ project, index = 0 }: { project: ProjectRow; index?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const y = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.4 });

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rx = useSpring(tiltX, { stiffness: 200, damping: 20 });
  const ry = useSpring(tiltY, { stiffness: 200, damping: 20 });
  const onTiltMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 8);
    tiltX.set(-py * 6);
  };
  const onTiltLeave = () => { tiltX.set(0); tiltY.set(0); };

  const bg = project.thumbnail_url
    ? `center/cover no-repeat url(${project.thumbnail_url})`
    : projectGradient(project.slug);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block"
      aria-label={`${project.title} — ${project.company ?? ""}`}
      data-cursor="View case"
    >
      <motion.div
        ref={ref}
        onPointerMove={onTiltMove}
        onPointerLeave={onTiltLeave}
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduce ? undefined : { y: -6 }}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-hairline transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-30px_rgba(11,11,12,0.25)]"
        style={{
          background: bg,
          rotateX: rx as unknown as MotionValue<number>,
          rotateY: ry as unknown as MotionValue<number>,
          transformPerspective: 1000,
        }}
      >
        <motion.div
          aria-hidden
          style={{ y: reduce ? undefined : y, background: bg }}
          className="absolute -inset-8 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
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
            {project.category && (
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs backdrop-blur-sm">
                {project.category}
              </span>
            )}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="text-[var(--color-ink)] overflow-hidden">
            {project.company && (
              <p className="text-xs uppercase tracking-widest opacity-70 transition-transform duration-500 group-hover:-translate-y-0.5">
                {project.company}
              </p>
            )}
            <p className="font-display text-2xl leading-tight mt-1 transition-transform duration-500 group-hover:-translate-y-0.5">
              {project.title}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-sm text-[var(--color-muted)]">
          {[project.role, project.duration].filter(Boolean).join(" · ")}
        </p>
        <span className="text-xs uppercase tracking-widest text-[var(--color-muted)] opacity-0 -translate-x-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
          Read case →
        </span>
      </div>
    </Link>
  );
}
