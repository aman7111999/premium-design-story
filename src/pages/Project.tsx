import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Seo } from "@/lib/seo";
import { useProject, useProjects, useSite, projectGradient, type ProjectRow } from "@/lib/cms";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "./NotFound";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const { data: project, isLoading } = useProject(slug);
  const { data: siblings } = useProjects({ publishedOnly: true });
  const { data: site } = useSite();
  const reduce = useReducedMotion();
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: coverProgress } = useScroll({ target: coverRef, offset: ["start start", "end start"] });
  const coverY = useTransform(coverProgress, [0, 1], ["0%", "20%"]);
  const coverScale = useTransform(coverProgress, [0, 1], [1, 1.08]);

  if (isLoading) return <div className="container-page py-40"><Skeleton className="h-96 w-full" /></div>;
  if (!project) return <NotFound />;

  const list = siblings ?? [];
  const i = list.findIndex((p) => p.slug === slug);
  const prev = i > 0 ? list[i - 1] : list[list.length - 1];
  const next = i < list.length - 1 ? list[i + 1] : list[0];

  const bg = project.thumbnail_url ? `center/cover url(${project.thumbnail_url})` : projectGradient(project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    author: { "@type": "Person", name: site?.name ?? "" },
    about: project.category,
    creator: project.company,
  };

  const sections: { id: string; label: string; html: string | null }[] = [
    { id: "overview", label: "Overview", html: project.overview },
    { id: "problem", label: "Problem", html: project.problem_statement },
    { id: "research", label: "Research", html: project.research },
    { id: "design", label: "Design process", html: project.design_process },
    { id: "solution", label: "Solution", html: project.solution },
    { id: "outcome", label: "Outcome", html: project.outcome },
    { id: "learnings", label: "Learnings", html: project.learnings },
  ].filter((s) => s.html && s.html.trim().length > 0);

  return (
    <>
      <Seo title={project.title} description={project.short_description ?? ""} path={`/projects/${project.slug}`} ogType="article" jsonLd={jsonLd} siteName={site?.name ?? "Portfolio"} />

      <article>
        <section className="relative">
          <div className="container-page pt-24 pb-14 md:pt-36 md:pb-20">
            <Link to="/work" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted)] link-underline">
              <ArrowLeft size={12} /> Back to work
            </Link>
            <p className="mt-10 text-xs uppercase tracking-widest text-[var(--color-muted)]">
              {[project.company, project.category].filter(Boolean).join(" · ")}
            </p>
            <h1 className="display-hero mt-6 max-w-5xl text-4xl md:text-[5.5rem] md:leading-[0.98]">{project.title}</h1>
            {project.short_description && (
              <p className="mt-8 max-w-2xl text-lg text-[var(--color-muted)] md:text-xl">{project.short_description}</p>
            )}
          </div>

          <div className="container-page">
            <motion.div
              ref={coverRef}
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-hairline"
              aria-hidden
            >
              <motion.div className="absolute -inset-8" style={{ background: bg, y: reduce ? undefined : coverY, scale: reduce ? undefined : coverScale }} />
            </motion.div>
          </div>
        </section>

        <section className="container-page mt-20 grid gap-8 border-y border-hairline py-10 md:grid-cols-4">
          <Meta label="Role" value={project.role} />
          <Meta label="Timeline" value={project.timeline} />
          <Meta label="Duration" value={project.duration} />
          <Meta label="Category" value={project.category} />
        </section>

        {(project.tools.length > 0 || project.metrics.length > 0) && (
          <section className="container-page mt-16 grid gap-10 md:grid-cols-2">
            {project.tools.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Tools</p>
                <p className="mt-4 text-[15px]">{project.tools.join(" · ")}</p>
              </div>
            )}
            {project.metrics.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Impact</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {project.metrics.map((m, idx) => (
                    <div key={idx}>
                      <p className="font-display text-3xl">{m.value}</p>
                      <p className="text-xs text-[var(--color-muted)]">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="container-page mt-16 grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="sticky top-24 space-y-2">
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Contents</p>
              <ul className="space-y-1.5 text-sm">
                {sections.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">{s.label}</a></li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="lg:col-span-9 space-y-16">
            {sections.map((s) => (
              <section id={s.id} key={s.id} className="scroll-mt-32">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">{s.label}</p>
                <div className="prose prose-neutral max-w-none mt-4" dangerouslySetInnerHTML={{ __html: s.html! }} />
              </section>
            ))}

            {project.gallery.length > 0 && (
              <section id="gallery" className="scroll-mt-32">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Gallery</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {project.gallery.map((img, idx) => (
                    <figure key={idx} className="overflow-hidden rounded-lg border border-hairline">
                      <img src={img.url} alt={img.caption ?? ""} className="w-full h-auto" />
                      {img.caption && <figcaption className="p-3 text-xs text-[var(--color-muted)]">{img.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {project.links.length > 0 && (
              <section>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Links</p>
                <ul className="mt-4 space-y-2">
                  {project.links.map((l, idx) => (
                    <li key={idx}><a href={l.url} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-1">{l.label} <ArrowUpRight size={14} /></a></li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>

        {(prev || next) && (
          <section className="container-page mt-32 hairline-t pt-16">
            <div className="grid gap-10 md:grid-cols-2">
              {prev && <NavCase project={prev} label="Previous" side="prev" />}
              {next && <NavCase project={next} label="Next" side="next" />}
            </div>
          </section>
        )}

        <section className="container-page mt-24 pb-12">
          <Link to="/contact" className="inline-flex items-center gap-2 link-underline">
            Want to work together? <ArrowUpRight size={16} />
          </Link>
        </section>
      </article>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-[15px]">{value}</p>
    </div>
  );
}

function NavCase({ project, label, side }: { project: ProjectRow; label: string; side: "prev" | "next" }) {
  const bg = project.thumbnail_url ? `center/cover url(${project.thumbnail_url})` : projectGradient(project.slug);
  return (
    <Link to={`/projects/${project.slug}`} className={`group block ${side === "next" ? "md:text-right" : ""}`}>
      <p className={`flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted)] ${side === "next" ? "md:justify-end" : ""}`}>
        {side === "prev" ? <><ArrowLeft size={12} /> {label}</> : <>{label} <ArrowRight size={12} /></>}
      </p>
      <div className="mt-4 relative aspect-[21/9] overflow-hidden rounded-lg border border-hairline" style={{ background: bg }}>
        <div className="absolute inset-0 flex items-end p-6 md:p-10">
          <p className="font-display text-3xl md:text-5xl text-[var(--color-ink)]">{project.title}</p>
        </div>
      </div>
    </Link>
  );
}
