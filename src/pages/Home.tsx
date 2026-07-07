import { ArrowUpRight, Sparkles } from "lucide-react";
import { Seo } from "@/lib/seo";
import { useSite, useProjects, useExperience, useTestimonials } from "@/lib/cms";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/design/Button";
import { Metric } from "@/components/design/Metric";
import { QuoteBlock } from "@/components/design/QuoteBlock";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const HERO_SUB =
  "Senior Product Designer with 4.5+ years crafting AI-powered investment experiences, scalable design systems, and 0→1 products for modern financial platforms.";

const HEADLINE_METRICS = [
  { value: "4.5+", label: "Years shipping", hint: "Fintech · AI · Design Systems" },
  { value: "12", label: "0→1 launches", hint: "From research to release" },
  { value: "3", label: "Design systems", hint: "Scaled across product teams" },
];

export default function Home() {
  const { data: site } = useSite();
  const { data: featured, isLoading: fLoading } = useProjects({ publishedOnly: true, featuredOnly: true });
  const { data: experience } = useExperience();
  const { data: testimonials } = useTestimonials();

  const jsonLd = site
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.name ?? "Aman Mishra",
        jobTitle: "Senior Product Designer",
        url: "/",
        sameAs: (site.socials ?? []).map((s) => s.url),
      }
    : undefined;

  return (
    <>
      <Seo
        title={`${site?.name ?? "Aman Mishra"} — Senior Product Designer`}
        description={site?.tagline ?? HERO_SUB}
        path="/"
        jsonLd={jsonLd}
        siteName={site?.name ?? "Aman Mishra"}
      />

      {/* ==================== HERO ==================== */}
      <Hero />


      {/* ==================== METRICS STRIP ==================== */}
      <section className="container-page py-24 md:py-32">
        <div className="grid gap-10 border-y border-hairline py-14 md:grid-cols-3">
          {HEADLINE_METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <Metric value={m.value} label={m.label} hint={m.hint} size="md" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==================== FEATURED WORK ==================== */}
      <section id="work" className="container-page py-24 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-8">
          <div>
            <p className="eyebrow">01 — Selected work</p>
            <h2 className="display-2 mt-4">Case studies</h2>
            <p className="mt-3 max-w-xl text-[var(--color-muted)]">
              Long-form deep dives into how the product changed, and what changed
              because of it — problem, decisions, tradeoffs, and measurable impact.
            </p>
          </div>
          <Link
            to="/work"
            className="group inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            All projects
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>

        <div className="mt-16 flex flex-col gap-24 md:gap-32">
          {fLoading &&
            [1, 2].map((i) => (
              <Skeleton
                key={i}
                className="aspect-[16/10] w-full rounded-[var(--radius-xl)]"
              />
            ))}
          {featured?.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>


      {/* ==================== EXPERIENCE TEASER ==================== */}
      {(experience?.length ?? 0) > 0 && (
        <section className="container-page py-24 md:py-32">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-8">
            <div>
              <p className="eyebrow">02 — Experience</p>
              <h2 className="display-2 mt-4">Where I've shipped</h2>
            </div>
            <Link to="/about" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Full timeline →
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {(experience ?? []).slice(0, 4).map((e: any, i: number) => (
              <Reveal key={e.id} delay={i * 0.06}>
                <div className="border-b border-hairline pb-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-2xl">{e.company}</p>
                    <p className="eyebrow">{[e.start_date, e.end_date].filter(Boolean).join(" — ")}</p>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{e.role}</p>
                  {e.description && <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-muted)]">{e.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ==================== TESTIMONIALS ==================== */}
      {(testimonials?.length ?? 0) > 0 && (
        <section className="container-page py-24 md:py-32">
          <Reveal className="border-b border-hairline pb-8">
            <p className="eyebrow">03 — In their words</p>
            <h2 className="display-2 mt-4">Kind things people said</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(testimonials ?? []).map((t: any, i: number) => {
              const author = (t.author ?? "").trim();
              const meta = [t.role, t.company].filter(Boolean).join(" · ").trim();
              const norm = (s: string) => s.toLowerCase().replace(/[\s/·|,-]+/g, " ").trim();
              const showMeta = meta && !norm(author).includes(norm(meta));
              return (
                <Reveal key={t.id} delay={i * 0.06}>
                  <QuoteBlock author={author || undefined} meta={showMeta ? meta : undefined}>
                    {t.quote}
                  </QuoteBlock>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== CTA BAND ==================== */}
      <section className="container-page py-24 md:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-surface)] p-10 md:p-16">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(600px circle at 20% 0%, var(--color-accent-wash), transparent 50%), radial-gradient(500px circle at 100% 100%, var(--color-accent-wash), transparent 40%)",
              }}
            />
            <div className="relative">
              <p className="eyebrow flex items-center gap-2">
                <Sparkles size={12} /> Let's build something meaningful
              </p>
              <h2 className="display-1 mt-6 max-w-[18ch]">Have a problem worth solving?</h2>
              <p className="mt-6 max-w-lg text-lg text-[var(--color-muted)]">
                I'm currently open to senior product design roles and selective consulting.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button to="/contact" variant="accent" size="lg">
                  Start a conversation
                  <ArrowUpRight size={16} />
                </Button>
                {site?.email && (
                  <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
                    {site.email}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
