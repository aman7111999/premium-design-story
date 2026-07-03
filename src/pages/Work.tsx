import { Seo } from "@/lib/seo";
import { projects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";

export default function Work() {
  return (
    <>
      <Seo title="Work" description="Selected case studies in fintech, AI, and design systems." path="/work" />

      <section className="container-page pt-24 pb-16 md:pt-40">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">All projects</p>
          <h1 className="display-hero mt-4 text-6xl md:text-8xl">Work</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-muted)]">
            A cross-section of what I've shipped over the last five years — from design systems
            to AI products to end-to-end merchant flows.
          </p>
        </Reveal>
      </section>

      <section className="container-page pb-40">
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
