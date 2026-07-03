import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Seo } from "@/lib/seo";
import { site, featuredProjects, experience, skills, testimonials } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { HeroStage } from "@/components/HeroStage";
import { DotGrid } from "@/components/BackgroundFX";

export default function Home() {
  const reduce = useReducedMotion();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: "/",
    sameAs: Object.values(site.socials),
  };

  return (
    <>
      <Seo title={`${site.name} — ${site.role}`} description={site.tagline} path="/" jsonLd={jsonLd} />

      {/* Hero */}
      <section className="relative container-page pt-24 pb-32 md:pt-40 md:pb-48">
        <DotGrid className="-z-0 opacity-40" />
        <div className="relative grid gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]"
            >
              {site.role} · {site.location}
            </motion.p>
            <h1 className="display-hero mt-6 text-[13vw] leading-[0.9] md:text-[9.5rem]">
              {["Product", "you can", "feel."].map((word, i) => (
                <motion.span
                  key={word}
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="block overflow-hidden"
                >
                  <span className="block">{word}</span>
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10 max-w-xl text-lg text-[var(--color-muted)] md:text-xl"
            >
              I'm {site.name.split(" ")[0]} — a product designer with five years shipping fintech, AI,
              and design systems for teams that ship. I design through research, systems thinking,
              and a bias for the smallest working thing.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton to="/work">View projects</MagneticButton>
              <MagneticButton href={site.resumeUrl} variant="ghost">Download résumé</MagneticButton>
            </motion.div>
          </div>

          <div className="hidden md:col-span-4 md:block">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroStage />
            </motion.div>
          </div>
        </div>

        <div className="mt-24 flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
          <ArrowDown size={14} /> Scroll for selected work
        </div>
      </section>

      {/* Featured work */}
      <section className="container-page">
        <Reveal className="flex items-end justify-between border-b border-hairline pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">01 / Selected work</p>
            <h2 className="font-display text-3xl md:text-5xl mt-3">Case studies</h2>
          </div>
          <a href="/work" className="hidden text-sm link-underline md:inline">All projects →</a>
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="container-page mt-40">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">02 / Experience</p>
          <h2 className="font-display text-3xl md:text-5xl mt-3">Five years, four teams</h2>
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2">
          {experience.map((e, i) => (
            <Reveal key={e.company} delay={i * 0.05}>
              <div className="hairline-b pb-8">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-2xl">{e.company}</p>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{e.period}</p>
                </div>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{e.role}</p>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed">{e.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="container-page mt-40">
        <Reveal className="grid gap-12 md:grid-cols-12">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] md:col-span-3">
            03 / Philosophy
          </p>
          <div className="md:col-span-9">
            <p className="font-display text-3xl leading-tight md:text-5xl md:leading-[1.05]">
              I believe good design is <em className="not-italic underline decoration-[var(--color-accent)] decoration-2 underline-offset-[6px]">quiet</em>.
              It removes friction you never notice, honors the user's time, and earns
              trust by being honest about what it doesn't know. My best work is usually
              the work you can't see.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Skills */}
      <section className="container-page mt-40">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">04 / Craft</p>
          <h2 className="font-display text-3xl md:text-5xl mt-3">How I work</h2>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.06}>
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{g.group}</p>
              <ul className="mt-4 space-y-2">
                {g.items.map((s) => (
                  <li key={s} className="text-lg">{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page mt-40">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">05 / Kind words</p>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.06}>
              <blockquote className="text-[17px] leading-relaxed">"{t.quote}"</blockquote>
              <p className="mt-6 text-sm">{t.author}</p>
              <p className="text-xs text-[var(--color-muted)]">{t.role}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
