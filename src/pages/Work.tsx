import { Seo } from "@/lib/seo";
import { useProjects, useSite } from "@/lib/cms";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Skeleton } from "@/components/ui/skeleton";

export default function Work() {
  const { data: projects, isLoading } = useProjects({ publishedOnly: true });
  const { data: site } = useSite();
  return (
    <>
      <Seo title="Work" description="Selected case studies." path="/work" siteName={site?.name ?? "Portfolio"} />

      <section className="container-page pt-24 pb-16 md:pt-40">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">All projects</p>
          <h1 className="display-hero mt-4 text-6xl md:text-8xl">Work</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-muted)]">A cross-section of what I've shipped.</p>
        </Reveal>
      </section>

      <section className="container-page pb-40">
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {isLoading && [1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-[4/3] w-full" />)}
          {projects?.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
        </div>
      </section>
    </>
  );
}
