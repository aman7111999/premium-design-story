import { useRef, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectRow } from "@/lib/cms";
import { projectGradient } from "@/lib/cms";
import { Tag, Badge } from "@/components/design/Tag";

/**
 * Premium project showcase card.
 * - Large media surface with parallax + zoom on hover
 * - Magnetic pointer tilt (subtle) on the media
 * - Accent glow depth on hover
 * - Rich meta rail: role · timeline · company · impact metrics · tech
 * - Animated CTA arrow-tile
 * - Scroll-reveal, stagger via `index`
 *
 * All data comes from ProjectRow (CMS). No hardcoded content.
 */
export function ProjectCard({
  project,
  index = 0,
}: {
  project: ProjectRow;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Parallax on the background image as the card scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const parallaxY = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.4 });

  // Magnetic pointer tilt on the media
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { stiffness: 200, damping: 22, mass: 0.6 });
  const sTiltY = useSpring(tiltY, { stiffness: 200, damping: 22, mass: 0.6 });

  const onMediaMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !mediaRef.current) return;
    const r = mediaRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 6); // rotateY
    tiltX.set(-py * 5); // rotateX
  };
  const onMediaLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const bg = project.thumbnail_url
    ? `center/cover no-repeat url(${project.thumbnail_url})`
    : projectGradient(project.slug);

  const tags = (project.tags ?? []).slice(0, 4);
  const tools = (project.tools ?? []).slice(0, 5);
  const metrics = (project.metrics ?? []).slice(0, 3);

  return (
    <motion.article
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={reduce ? undefined : { scale: 1.02 }}
      transition={{
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative will-change-transform"
    >
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`${project.title} — case study${
          project.company ? ", " + project.company : ""
        }`}
        data-cursor="View case"
        className="block"
      >
        {/* ---------------- Media surface ---------------- */}
        <motion.div
          ref={mediaRef}
          onPointerMove={onMediaMove}
          onPointerLeave={onMediaLeave}
          style={{
            perspective: 1200,
            transformStyle: "preserve-3d",
          }}
          className={
            "relative aspect-[16/10] w-full overflow-hidden " +
            "rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-card)] " +
            "shadow-[var(--elevation-2)] " +
            "transition-[border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-out-quart)] " +
            "group-hover:border-[var(--color-hairline-strong)] " +
            "group-hover:shadow-[0_60px_120px_-40px_var(--color-accent-glow),var(--elevation-3)]"
          }
        >
          {/* Tilt wrapper */}
          <motion.div
            aria-hidden
            style={{
              rotateX: reduce ? 0 : sTiltX,
              rotateY: reduce ? 0 : sTiltY,
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-0"
          >
            {/* Parallax + zoom media */}
            <motion.div
              aria-hidden
              style={{
                y: reduce ? undefined : parallaxY,
                background: bg,
              }}
              className="absolute -inset-8 transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out-quart)] group-hover:scale-[1.05]"
            />

            {/* Subtle inner grid overlay for depth */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* Bottom gradient for text legibility */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)",
              }}
            />

            {/* Sheen sweep on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-1/2 -top-1/2 h-[200%] w-[200%] -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 transition-all duration-[900ms] ease-[var(--ease-out-quart)] group-hover:translate-x-1/3 group-hover:opacity-100"
            />
          </motion.div>

          {/* ---------------- Overlay chrome ---------------- */}
          <div className="relative flex h-full flex-col justify-between p-[var(--space-6)] md:p-[var(--space-8)]">
            {/* Top row: category + index + CTA tile */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-[var(--space-2)]">
                {project.category && (
                  <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-white/20 bg-black/40 px-[var(--space-3)] py-[var(--space-1)] font-mono text-[10px] uppercase tracking-[var(--tracking-widest)] text-white/85 backdrop-blur-sm">
                    {project.category}
                  </span>
                )}
                <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-white/15 bg-black/30 px-[var(--space-3)] py-[var(--space-1)] font-mono text-[10px] uppercase tracking-[var(--tracking-widest)] text-white/70 backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")} / Case
                </span>
              </div>

              <span
                aria-hidden
                className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm"
              >
                <span className="absolute inset-0 -translate-y-full bg-[var(--color-accent)] transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-quart)] group-hover:translate-y-0" />
                <ArrowUpRight
                  size={18}
                  className="relative transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-quart)] group-hover:rotate-45"
                />
              </span>
            </div>

            {/* Bottom: company · timeline · title */}
            <div className="text-white">
              {(project.company || project.timeline) && (
                <p className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-1 font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-white/70">
                  {project.company && <span>{project.company}</span>}
                  {project.company && project.timeline && (
                    <span aria-hidden className="h-px w-6 bg-white/30" />
                  )}
                  {project.timeline && <span>{project.timeline}</span>}
                </p>
              )}
              <h3 className="mt-[var(--space-3)] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] tracking-[var(--tracking-tight)]">
                {project.title}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* ---------------- Meta rail below the media ---------------- */}
        <div className="mt-[var(--space-6)] grid gap-[var(--space-6)]">
          {/* Left: description + facts */}
          <div className="min-w-0">
            {project.short_description && (
              <p className="max-w-xl text-[15px] leading-[var(--leading-normal)] text-[var(--color-muted)] line-clamp-3">
                {project.short_description}
              </p>
            )}

            {(project.role || project.duration) && (
              <dl className="mt-[var(--space-5)] flex flex-wrap gap-x-[var(--space-8)] gap-y-[var(--space-3)] text-[13px]">
                {project.role && (
                  <div className="flex flex-col">
                    <dt className="eyebrow">Role</dt>
                    <dd className="mt-1 text-[var(--color-text)]">{project.role}</dd>
                  </div>
                )}
                {project.duration && (
                  <div className="flex flex-col">
                    <dt className="eyebrow">Duration</dt>
                    <dd className="mt-1 text-[var(--color-text)]">{project.duration}</dd>
                  </div>
                )}
                {project.company && (
                  <div className="flex flex-col">
                    <dt className="eyebrow">Company</dt>
                    <dd className="mt-1 text-[var(--color-text)]">{project.company}</dd>
                  </div>
                )}
              </dl>
            )}

            {(tags.length > 0 || tools.length > 0) && (
              <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
                {tags.map((t) => (
                  <Tag key={`tag-${t}`}>{t}</Tag>
                ))}
                {tools.map((t) => (
                  <Badge key={`tool-${t}`} tone="accent" size="sm">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right: impact metrics */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-surface)] p-[var(--space-4)] sm:grid-cols-3 md:p-[var(--space-5)]">
              {metrics.map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  className="min-w-0 border-b border-hairline pb-[var(--space-3)] last:border-none last:pb-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-[var(--space-3)] sm:last:pr-0"
                >
                  <p className="font-display text-[clamp(1.25rem,2vw,1.75rem)] leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                    {m.value}
                  </p>
                  <p className="mt-[var(--space-2)] text-[10px] uppercase leading-[1.4] tracking-[0.08em] text-[var(--color-muted)]">
                    {m.label}
                  </p>
                  {m.hint && (
                    <p className="mt-1 text-[11px] leading-[1.4] text-[var(--color-subtle)]">
                      {m.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- Read case CTA ---------------- */}
        <div className="mt-[var(--space-6)] flex items-center gap-[var(--space-3)] border-t border-hairline pt-[var(--space-5)]">
          <span
            aria-hidden
            className="h-px flex-1 origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out-quart)] group-hover:scale-x-100"
          />
          <span className="inline-flex items-center gap-[var(--space-2)] text-[13px] text-[var(--color-muted)] transition-colors duration-[var(--dur-base)] group-hover:text-[var(--color-text)]">
            Read the case study
            <ArrowUpRight
              size={14}
              className="transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quart)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
