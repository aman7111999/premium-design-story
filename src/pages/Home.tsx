import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Seo } from "@/lib/seo";
import { useSite, useProjects, useExperience, useSkills, useTestimonials } from "@/lib/cms";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { HeroStage } from "@/components/HeroStage";
import { DotGrid } from "@/components/BackgroundFX";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const reduce = useReducedMotion();
  const { data: site } = useSite();
  const { data: featured, isLoading: fLoading } = useProjects({ publishedOnly: true, featuredOnly: true });
  const { data: experience } = useExperience();
  const { data: skills } = useSkills();
  const { data: testimonials } = useTestimonials();

  const jsonLd = site ? {
    "@context": "https://schema.org", "@type": "Person",
    name: site.name, jobTitle: "Product Designer", url: "/",
    sameAs: (site.socials ?? []).map((s) => s.url),
  } : undefined;

  return (
    <>
      <Seo title={site?.name ? `${site.name} — Product Designer` : "Portfolio"} description={site?.tagline ?? ""} path="/" jsonLd={jsonLd} siteName={site?.name ?? "Portfolio"} />

      <section className="relative container-page pt-24 pb-32 md:pt-40 md:pb-48">
        <DotGrid className="-z-0 opacity-40" />
        <div className="relative grid gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Product Designer{site?.location ? ` · ${site.location}` : ""}
            </motion.p>
            <h1 className="display-hero mt-8" style={{ fontSize: "clamp(3.5rem, 10.5vw, 9rem)" }}>
              {["Product", "you can", "feel."].map((word, i) => (
                <motion.span key={word} initial={reduce ? false : { y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.2 + i * 0.09, ease: [0.22, 1, 0.36, 1] }} className="block overflow-hidden pb-[0.05em]">
                  <span className="block">{word}</span>
                </motion.span>
              ))}
            </h1>
            <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-10 max-w-xl text-lg text-[var(--color-muted)] md:text-xl">
              {site?.bio ?? site?.tagline ?? ""}
            </motion.p>
            <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }} className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton to="/work">View projects</MagneticButton>
              {site?.resume_url && <MagneticButton href={site.resume_url} variant="ghost">Download résumé</MagneticButton>}
            </motion.div>
          </div>
          <div className="hidden md:col-span-4 md:block">
            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <HeroStage />
            </motion.div>
          </div>
        </div>
        <div className="mt-24 flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
          <ArrowDown size={14} /> Scroll for selected work
        </div>
      </section>

      <section className="container-page">
        <Reveal className="flex items-end justify-between border-b border-hairline pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">01 / Selected work</p>
            <h2 className="font-display text-3xl md:text-5xl mt-3">Case studies</h2>
          </div>
          <a href="/work" className="hidden text-sm link-underline md:inline">All projects →</a>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {fLoading && [1, 2].map((i) => <Skeleton key={i} className="aspect-[4/3] w-full" />)}
          {featured?.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
        </div>
      </section>

      <section className="container-page mt-40">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">02 / Experience</p>
          <h2 className="font-display text-3xl md:text-5xl mt-3">Where I've worked</h2>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2">
          {(experience ?? []).map((e: any, i: number) => (
            <Reveal key={e.id} delay={i * 0.05}>
              <div className="hairline-b pb-8">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-2xl">{e.company}</p>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{[e.start_date, e.end_date].filter(Boolean).join(" — ")}</p>
                </div>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{e.role}</p>
                {e.description && <p className="mt-4 max-w-md text-[15px] leading-relaxed">{e.description}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-40">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">03 / Craft</p>
          <h2 className="font-display text-3xl md:text-5xl mt-3">How I work</h2>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {(skills ?? []).map((g, i) => (
            <Reveal key={g.group} delay={i * 0.06}>
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{g.group}</p>
              <ul className="mt-4 space-y-2">
                {g.items.map((s) => <li key={s} className="text-lg">{s}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {(testimonials?.length ?? 0) > 0 && (
        <section className="container-page mt-40">
          <Reveal className="border-b border-hairline pb-6">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">04 / Kind words</p>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {(testimonials ?? []).map((t: any, i: number) => (
              <Reveal key={t.id} delay={i * 0.06}>
                <blockquote className="text-[17px] leading-relaxed">"{t.quote}"</blockquote>
                <p className="mt-6 text-sm">{t.author}</p>
                <p className="text-xs text-[var(--color-muted)]">{[t.role, t.company].filter(Boolean).join(" · ")}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
