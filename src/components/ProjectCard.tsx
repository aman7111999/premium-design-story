import { Link } from "react-router-dom";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { useRef } from "react";
import type { ProjectRow } from "@/lib/cms";


/**
 * Salad-inspired project card.
 * - Bold color block background per project
 * - Title top-left in bold uppercase sans
 * - Short description below title
 * - "View Project" pill button
 * - Image/collage area at bottom (placeholder gradient until thumbnail is uploaded)
 * - Category sticker bottom-right
 */

// Vibrant Salad-style backgrounds — high-saturation, distinct per index
const CARD_PALETTES = [
  { bg: "#2a2a2a", ink: "#fff6ea", accent: "#ff3e7f" }, // charcoal + pink
  { bg: "#1c2f2c", ink: "#fff6ea", accent: "#7ee3a4" }, // deep teal + mint
  { bg: "#2b1e3f", ink: "#fff6ea", accent: "#c4a5ff" }, // indigo + lavender
  { bg: "#3a1e1e", ink: "#ffd6b3", accent: "#ff9d5a" }, // burgundy + peach
  { bg: "#1e2a3f", ink: "#fff6ea", accent: "#5cbdff" }, // navy + sky
  { bg: "#2f2611", ink: "#fff6ea", accent: "#ffd06b" }, // olive + gold
];

export function ProjectCard({
  project,
  index = 0,
  size = "md",
}: {
  project: ProjectRow;
  index?: number;
  size?: "lg" | "md";
}) {
  const reduce = useReducedMotion();
  const palette = CARD_PALETTES[index % CARD_PALETTES.length];
  const locked = !!(project as { locked?: boolean }).locked;
  const hoverVideo = (project as { hover_video_url?: string | null }).hover_video_url;

  const isLarge = size === "lg";

  // 3D tilt driven by cursor
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
      style={{ perspective: 1200 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`${project.title} — case study`}
        className="block h-full"
      >
        <motion.div
          ref={ref}
          style={{ backgroundColor: palette.bg, color: palette.ink, minHeight: isLarge ? 420 : 320, rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] p-6 shadow-[var(--elevation-2)] transition-shadow duration-500 group-hover:shadow-[var(--elevation-4)] md:p-7"
        >
          {/* Shimmer sweep on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100"
          />

          {/* Top: title + description + button */}
          <div className="relative z-10 flex flex-col gap-4">
            <h3
              className="font-heavy uppercase leading-[1.05] tracking-[-0.01em]"
              style={{
                fontWeight: 800,
                fontSize: isLarge ? "clamp(1.5rem, 2.2vw, 2rem)" : "clamp(1.15rem, 1.7vw, 1.4rem)",
                color: palette.ink,
              }}
            >
              {project.title}
            </h3>

            {project.short_description && (
              <p
                className="max-w-md text-[13px] leading-[1.55] opacity-75"
                style={{ color: palette.ink }}
              >
                {project.short_description}
              </p>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {locked ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]"
                  style={{
                    borderColor: `${palette.ink}30`,
                    color: palette.ink,
                    backgroundColor: `${palette.ink}10`,
                  }}
                >
                  <Lock size={11} /> Under NDA
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-heavy font-bold uppercase tracking-[0.08em] transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: palette.ink,
                    color: palette.bg,
                  }}
                >
                  View Project
                  <ArrowUpRight size={12} strokeWidth={2.5} />
                </span>
              )}
            </div>
          </div>

          {/* Image/collage area — colored placeholder until thumbnail exists */}
          <div
            className="relative mt-auto flex-1 min-h-[140px]"
          >
            {project.thumbnail_url ? (
              <div
                className="absolute inset-x-[-24px] bottom-[-24px] top-6 overflow-hidden rounded-t-[var(--radius-md)] md:inset-x-[-28px] md:bottom-[-28px]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                  style={{ backgroundImage: `url(${project.thumbnail_url})` }}
                />
                {hoverVideo && (
                  <video
                    src={hoverVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                )}
              </div>
            ) : (

              <div
                aria-hidden
                className="absolute inset-x-[-24px] bottom-[-24px] top-8 overflow-hidden rounded-t-[var(--radius-md)] md:inset-x-[-28px] md:bottom-[-28px]"
                style={{
                  background: `radial-gradient(120% 100% at 20% 10%, ${palette.accent}44 0%, transparent 55%), linear-gradient(180deg, ${palette.bg} 0%, ${palette.accent}22 100%)`,
                }}
              >
                {/* Giant numeral watermark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 -right-4 select-none font-heavy leading-none opacity-[0.14]"
                  style={{
                    fontSize: "clamp(9rem, 20vw, 16rem)",
                    color: palette.ink,
                    fontWeight: 900,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Category sticker inside media */}
                {project.category && (
                  <span
                    className="absolute right-6 top-4 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-heavy font-bold uppercase tracking-[0.12em]"
                    style={{
                      backgroundColor: palette.accent,
                      color: palette.bg,
                    }}
                  >
                    {project.category}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

      </Link>
    </motion.article>
  );
}
