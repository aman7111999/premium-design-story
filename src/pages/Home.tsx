import { Seo } from "@/lib/seo";
import { useSite, useProjects } from "@/lib/cms";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/Hero";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ServicesBento } from "@/components/home/ServicesBento";
import { StatsBand } from "@/components/home/StatsBand";
import { TestimonialsRow } from "@/components/home/TestimonialsRow";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  const { data: site } = useSite();
  const { data: featured, isLoading: fLoading } = useProjects({
    publishedOnly: true,
    featuredOnly: true,
  });

  const jsonLd = site
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.name ?? "Aman Mishra",
        jobTitle: "Product Designer",
        url: "/",
        sameAs: (site.socials ?? []).map((s) => s.url),
      }
    : undefined;

  const featuredArr = featured ?? [];
  const large = featuredArr.slice(0, 2);
  const small = featuredArr.slice(2, 6);

  return (
    <>
      <Seo
        title={`${site?.name ?? "Aman Mishra"} — Product Designer`}
        description={site?.tagline ?? "Product designer crafting next-horizon experiences."}
        path="/"
        jsonLd={jsonLd}
        siteName={site?.name ?? "Aman Mishra"}
      />

      <Hero />
      <ServicesBento />

      {/* Featured projects */}
      <section id="work" className="container-page py-20 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Selected Work</p>
          <h2 className="display-2 mt-4 text-[var(--color-text)]">
            Featured <em className="italic text-[var(--color-accent)]">Projects</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--color-muted)]">
            Products, systems, and 0→1 experiments shipped recently.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-7">
          {fLoading &&
            [1, 2].map((i) => (
              <Skeleton key={i} className="h-[420px] w-full rounded-[var(--radius-lg)]" />
            ))}
          {large.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} size="lg" />
          ))}
        </div>

        {small.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-7">
            {small.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i + 2} size="md" />
            ))}
          </div>
        )}

        {featuredArr.length > 0 && (
          <div className="mt-14 flex justify-center">
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] px-6 py-3 font-heavy text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              All Projects
              <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </section>

      <StatsBand />
      <TestimonialsRow />
      <FaqSection />
      <FinalCta />
    </>
  );
}
