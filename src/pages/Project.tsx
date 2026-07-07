import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, ArrowDown } from "lucide-react";
import { Seo } from "@/lib/seo";
import { useProject, useProjects, useSite, projectGradient, type ProjectRow } from "@/lib/cms";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Badge, Button } from "@/components/design";
import { CaseSection } from "@/components/case/CaseSection";
import { CaseGallery } from "@/components/case/CaseGallery";
import { CaseToc } from "@/components/case/CaseToc";
import { ReadingProgress } from "@/components/case/ReadingProgress";
import { ImpactGrid } from "@/components/case/ImpactGrid";
import { PrototypeEmbed, isPrototypeLink } from "@/components/case/PrototypeEmbed";
import { ProseHtml } from "@/components/case/ProseHtml";
import NotFound from "./NotFound";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Editorial layout rotation across chapters so no two adjacent
   sections share the same composition. */
const CHAPTER_VARIANTS = ["rail", "split", "rail", "wide", "rail", "bleed", "centered"] as const;

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const { data: project, isLoading } = useProject(slug);
  const { data: siblings } = useProjects({ publishedOnly: true });
  const { data: site } = useSite();
  const reduce = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const coverY = useTransform(heroProgress, [0, 1], ["0%", "22%"]);
  const coverScale = useTransform(heroProgress, [0, 1], [1.02, 1.12]);
  const coverOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.35]);
  const titleY = useTransform(heroProgress, [0, 1], ["0%", "-18%"]);
  const scrimOpacity = useTransform(heroProgress, [0, 0.6], [0.72, 0.95]);

  const prototypeLink = useMemo(
    () => (project?.links ?? []).find((l) => isPrototypeLink(l.url)),
    [project],
  );

  if (isLoading) {
    return (
      <div className="container-page py-40">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!project) return <NotFound />;

  const list = siblings ?? [];
  const i = list.findIndex((p) => p.slug === slug);
  const prev = i > 0 ? list[i - 1] : list[list.length - 1];
  const next = i < list.length - 1 ? list[i + 1] : list[0];

  const bg = project.thumbnail_url
    ? `center/cover url(${project.thumbnail_url})`
    : projectGradient(project.slug);

  const chapters = [
    { id: "overview",   chapter: "01", label: "Overview",   eyebrow: "The context",     title: "Overview",                html: project.overview },
    { id: "problem",    chapter: "02", label: "Problem",    eyebrow: "What we faced",   title: "Problem & business goal", html: project.problem_statement },
    { id: "research",   chapter: "03", label: "Research",   eyebrow: "What we learned", title: "Research & insights",     html: project.research },
    { id: "process",    chapter: "04", label: "Process",    eyebrow: "How we built it", title: "Design process",          html: project.design_process },
    { id: "solution",   chapter: "05", label: "Solution",   eyebrow: "High fidelity",   title: "The solution",            html: project.solution },
    { id: "impact",     chapter: "06", label: "Impact",     eyebrow: "The outcome",     title: "Impact",                  html: project.outcome },
    { id: "reflection", chapter: "07", label: "Reflection", eyebrow: "In hindsight",    title: "Reflection & learnings",  html: project.learnings },
  ] as const;

  const activeChapters = chapters.filter((c) => c.html && c.html.trim().length > 0);

  const tocEntries: { id: string; label: string; chapter: string }[] = [
    { id: "hero", label: "Intro", chapter: "00" },
    ...activeChapters.map((c) => ({ id: c.id, label: c.label, chapter: c.chapter })),
    ...(prototypeLink ? [{ id: "prototype", label: "Prototype", chapter: String(activeChapters.length + 1).padStart(2, "0") }] : []),
    ...(project.gallery.length > 0 ? [{ id: "gallery", label: "Gallery", chapter: String(activeChapters.length + (prototypeLink ? 2 : 1)).padStart(2, "0") }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    author: { "@type": "Person", name: site?.name ?? "" },
    about: project.category,
    creator: project.company,
  };

  return (
    <>
      <Seo
        title={project.title}
        description={project.short_description ?? ""}
        path={`/projects/${project.slug}`}
        ogType="article"
        jsonLd={jsonLd}
        siteName={site?.name ?? "Portfolio"}
      />

      <ReadingProgress />
      <CaseToc sections={tocEntries} />

      <article>
        {/* ==================== IMMERSIVE HERO ==================== */}
        <section
          id="hero"
          ref={heroRef}
          className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden text-white"
        >
          {/* Cover media */}
          <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute -inset-10"
              style={{
                background: bg,
                y: reduce ? undefined : coverY,
                scale: reduce ? undefined : coverScale,
                opacity: reduce ? undefined : coverOpacity,
              }}
            />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />
            {/* Grain */}
            <div
              className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                backgroundSize: "140px 140px",
              }}
            />
            {/* Bottom-anchored scrim for readable overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: reduce ? 0.8 : scrimOpacity,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.35) 100%)",
              }}
            />
          </div>

          {/* Top rail */}
          <div className="container-page relative z-10 pt-28 md:pt-32">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft size={12} /> Back to work
            </Link>
          </div>

          {/* Title cluster — bottom aligned */}
          <motion.div
            style={{ y: reduce ? undefined : titleY }}
            className="container-page relative z-10 mt-auto pb-14 md:pb-20"
          >
            <div className="flex flex-wrap items-center gap-2">
              {project.category && (
                <span className="mono rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {project.category}
                </span>
              )}
              {project.company && (
                <span className="mono rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                  {project.company}
                </span>
              )}
              {project.timeline && (
                <span className="mono rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                  {project.timeline}
                </span>
              )}
            </div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: EASE }}
              className="display-hero mt-8 max-w-[18ch] text-white"
              style={{ fontSize: "clamp(2.75rem, 9vw, 7.5rem)" }}
            >
              {project.title}
            </motion.h1>

            {project.short_description && (
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                className="mt-8 max-w-[62ch] text-lg leading-relaxed text-white/85 md:text-xl"
              >
                {project.short_description}
              </motion.p>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex items-center justify-center"
          >
            <div className="mono flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/60">
              <span className="h-px w-8 bg-white/40" />
              Scroll
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { y: [0, 4, 0] }}
                transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="grid h-6 w-6 place-items-center rounded-full border border-white/30 text-white/80"
              >
                <ArrowDown size={11} />
              </motion.span>
            </div>
          </motion.div>
        </section>

        {/* ==================== META STRIP ==================== */}
        <section className="container-page pt-[var(--space-16)] md:pt-[var(--space-20)]">
          <div className="grid gap-[var(--space-8)] border-y border-hairline py-[var(--space-8)] md:grid-cols-4">
            <Meta label="Role" value={project.role} />
            <Meta label="Timeline" value={project.timeline} />
            <Meta label="Duration" value={project.duration} />
            <Meta label="Category" value={project.category} />
          </div>

          {(project.tools.length > 0 || project.tags.length > 0) && (
            <div className="mt-[var(--space-8)] flex flex-wrap items-start gap-[var(--space-8)]">
              {project.tools.length > 0 && (
                <div>
                  <p className="eyebrow mb-[var(--space-3)]">Technology</p>
                  <div className="flex flex-wrap gap-[var(--space-2)]">
                    {project.tools.map((t) => (
                      <Badge key={t} tone="accent" size="sm">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {project.tags.length > 0 && (
                <div>
                  <p className="eyebrow mb-[var(--space-3)]">Tags</p>
                  <div className="flex flex-wrap gap-[var(--space-2)]">
                    {project.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ==================== STICKY METRIC RIBBON ==================== */}
        {project.metrics.length > 0 && (
          <section className="relative py-[var(--space-16)]">
            <div className="container-page">
              <div className="grid gap-[var(--space-4)] rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-card)] p-[var(--space-6)] shadow-[var(--elevation-1)] md:grid-cols-3">
                {project.metrics.slice(0, 3).map((m, idx) => (
                  <motion.div
                    key={`${m.label}-${idx}`}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: idx * 0.08, ease: EASE }}
                    className="flex items-baseline gap-4 border-hairline md:not-last:border-r md:pr-6 md:[&:not(:last-child)]:border-r"
                  >
                    <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none tracking-[var(--tracking-tightest)] text-[var(--color-accent)]">
                      {m.value}
                    </p>
                    <div>
                      <p className="eyebrow">{m.label}</p>
                      {m.hint && <p className="mt-1 text-[12px] text-[var(--color-muted)]">{m.hint}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================== CHAPTER SECTIONS ==================== */}
        {activeChapters.map((c, idx) => {
          const variant = CHAPTER_VARIANTS[idx % CHAPTER_VARIANTS.length];
          return (
            <CaseSection
              key={c.id}
              id={c.id}
              chapter={c.chapter}
              eyebrow={c.eyebrow}
              title={c.title}
              variant={variant}
              tone={c.id === "impact" ? "surface" : "default"}
            >
              {c.id === "impact" && project.metrics.length > 0 && (
                <div className="mb-[var(--space-10)]">
                  <ImpactGrid items={project.metrics} />
                </div>
              )}
              <ProseHtml html={c.html!} />
            </CaseSection>
          );
        })}

        {/* ==================== PROTOTYPE ==================== */}
        {prototypeLink && (
          <CaseSection
            id="prototype"
            chapter={String(activeChapters.length + 1).padStart(2, "0")}
            eyebrow="Try it live"
            title="Interactive prototype"
            variant="wide"
            intro={
              <>
                A working prototype of the flow — click through the way a user would.
                Best experienced on desktop. Tap the expand icon for fullscreen.
              </>
            }
          >
            <PrototypeEmbed url={prototypeLink.url} label={prototypeLink.label} />
          </CaseSection>
        )}

        {/* ==================== GALLERY ==================== */}
        {project.gallery.length > 0 && (
          <CaseSection
            id="gallery"
            chapter={String(activeChapters.length + (prototypeLink ? 2 : 1)).padStart(2, "0")}
            eyebrow="Visual archive"
            title="Selected artifacts"
            variant="wide"
            tone="surface"
            intro="Screens, flows, and moments from the design process — tap any image to expand."
          >
            <CaseGallery images={project.gallery} />
          </CaseSection>
        )}

        {/* ==================== IMPACT FALLBACK ==================== */}
        {!activeChapters.find((c) => c.id === "impact") && project.metrics.length > 0 && (
          <CaseSection
            id="impact"
            chapter={String(activeChapters.length + 3).padStart(2, "0")}
            eyebrow="The outcome"
            title="Impact"
            variant="split"
          >
            <ImpactGrid items={project.metrics} />
          </CaseSection>
        )}

        {/* ==================== LINKS ==================== */}
        {project.links.filter((l) => !isPrototypeLink(l.url)).length > 0 && (
          <section className="container-page py-[var(--space-16)]">
            <p className="eyebrow">External links</p>
            <ul className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
              {project.links
                .filter((l) => !isPrototypeLink(l.url))
                .map((l, idx) => (
                  <li key={idx}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-pill)] border border-hairline bg-[var(--color-elevated)] px-[var(--space-4)] py-[var(--space-2)] text-[13px] text-[var(--color-text)] transition-colors hover:border-[var(--color-hairline-strong)]"
                    >
                      {l.label} <ExternalLink size={12} />
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* ==================== NEXT / PREV ==================== */}
        {(prev || next) && (
          <section className="container-page mt-[var(--space-24)] border-t border-hairline pt-[var(--space-16)]">
            <div className="grid gap-[var(--space-10)] md:grid-cols-2">
              {prev && <NavCase project={prev} label="Previous" side="prev" />}
              {next && <NavCase project={next} label="Next" side="next" />}
            </div>
          </section>
        )}

        {/* ==================== CTA ==================== */}
        <section className="container-page mt-[var(--space-24)] pb-[var(--space-16)]">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-surface)] p-[var(--space-10)] md:p-[var(--space-16)]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(600px circle at 20% 0%, var(--color-accent-wash), transparent 55%)," +
                  "radial-gradient(500px circle at 100% 100%, var(--color-accent-wash), transparent 45%)",
              }}
            />
            <div className="relative flex flex-wrap items-end justify-between gap-[var(--space-6)]">
              <div>
                <p className="eyebrow">Let's build together</p>
                <h2 className="display-2 mt-[var(--space-4)] max-w-[18ch]">
                  Have a problem worth solving?
                </h2>
              </div>
              <Button to="/contact" variant="accent" size="lg">
                Start a conversation <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-[var(--space-2)] text-[15px] text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function NavCase({
  project,
  label,
  side,
}: {
  project: ProjectRow;
  label: string;
  side: "prev" | "next";
}) {
  const bg = project.thumbnail_url
    ? `center/cover url(${project.thumbnail_url})`
    : projectGradient(project.slug);
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group block ${side === "next" ? "md:text-right" : ""}`}
    >
      <p
        className={`flex items-center gap-[var(--space-2)] font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-muted)] ${
          side === "next" ? "md:justify-end" : ""
        }`}
      >
        {side === "prev" ? (
          <><ArrowLeft size={12} /> {label}</>
        ) : (
          <>{label} <ArrowRight size={12} /></>
        )}
      </p>
      <div className="relative mt-[var(--space-4)] aspect-[21/9] overflow-hidden rounded-[var(--radius-lg)] border border-hairline shadow-[var(--elevation-1)] transition-shadow duration-[var(--dur-slow)] group-hover:shadow-[var(--elevation-3)]">
        <div
          aria-hidden
          className="absolute -inset-6 transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out-quart)] group-hover:scale-[1.06]"
          style={{ background: bg }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
        />
        <div className="absolute inset-0 flex items-end p-[var(--space-8)] md:p-[var(--space-10)]">
          <p className="font-display text-3xl leading-tight text-white md:text-5xl">
            {project.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
