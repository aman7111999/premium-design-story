import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Seo } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getProject, getAdjacentProjects, site } from "@/lib/content";
import NotFound from "./NotFound";

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

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const reduce = useReducedMotion();

  if (!project) return <NotFound />;
  const { prev, next } = getAdjacentProjects(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    author: { "@type": "Person", name: site.name },
    about: project.category,
    creator: project.company,
  };

  return (
    <>
      <Seo
        title={project.title}
        description={project.summary}
        path={`/projects/${project.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />
      <ReadingProgress />

      <article>
        {/* Hero */}
        <section className="container-page pt-24 pb-16 md:pt-40">
          <Reveal>
            <Link to="/work" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted)] link-underline">
              <ArrowLeft size={12} /> Back to work
            </Link>
            <p className="mt-8 text-xs uppercase tracking-widest text-[var(--color-muted)]">
              {project.company} · {project.category}
            </p>
            <h1 className="display-hero mt-6 max-w-5xl text-4xl md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-[var(--color-muted)]">
              {project.summary}
            </p>
          </Reveal>
        </section>

        {/* Cover */}
        <section className="container-page">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-hairline"
            style={{ background: gradients[project.cover] ?? gradients["gradient-1"] }}
            aria-hidden
          />
        </section>

        {/* Meta */}
        <section className="container-page mt-24 grid gap-8 md:grid-cols-4">
          <Meta label="Role" value={project.role} />
          <Meta label="Timeline" value={project.timeline} />
          <Meta label="Duration" value={project.duration} />
          <Meta label="Category" value={project.category} />
        </section>

        <section className="container-page mt-16 grid gap-8 md:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Team</p>
            <ul className="mt-3 space-y-1 text-[15px]">
              {project.team.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Constraints</p>
            <ul className="mt-3 space-y-1 text-[15px]">
              {project.constraints.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </Reveal>
        </section>

        {/* Metrics */}
        <section className="container-page mt-24 hairline-t hairline-b">
          <div className="grid divide-y divide-[var(--color-hairline)] md:grid-cols-4 md:divide-x md:divide-y-0">
            {project.metrics.map((m) => (
              <div key={m.label} className="p-8">
                <p className="font-display text-4xl md:text-5xl">{m.value}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sections */}
        <section className="container-page mt-24 space-y-24">
          {project.sections.map((s, i) => (
            <Reveal key={s.heading}>
              <div className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-display text-2xl mt-3 md:text-3xl">{s.heading}</h2>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <p className="text-lg leading-relaxed md:text-xl md:leading-relaxed">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Prev / Next */}
        <section className="container-page mt-40 hairline-t pt-16">
          <div className="grid gap-8 md:grid-cols-2">
            {prev && (
              <Link to={`/projects/${prev.slug}`} className="group block">
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] flex items-center gap-2">
                  <ArrowLeft size={12} /> Previous
                </p>
                <p className="mt-4 font-display text-3xl md:text-4xl link-underline">{prev.title}</p>
              </Link>
            )}
            {next && (
              <Link to={`/projects/${next.slug}`} className="group block md:text-right">
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] flex items-center gap-2 md:justify-end">
                  Next <ArrowRight size={12} />
                </p>
                <p className="mt-4 font-display text-3xl md:text-4xl link-underline">{next.title}</p>
              </Link>
            )}
          </div>
        </section>

        <section className="container-page mt-24">
          <Link to="/contact" className="inline-flex items-center gap-2 link-underline">
            Want to work together? <ArrowUpRight size={16} />
          </Link>
        </section>
      </article>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-[15px]">{value}</p>
    </div>
  );
}
