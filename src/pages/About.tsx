import { Seo } from "@/lib/seo";
import { useSite, useExperience, useEducation, useSkills, useAllContent } from "@/lib/cms";
import { Reveal } from "@/components/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, Tag } from "@/components/design";
import { ExperienceCard, type ExperienceRow } from "@/components/about/ExperienceCard";
import { ScrollTimeline, type Milestone } from "@/components/about/ScrollTimeline";
import { PortraitFrame } from "@/components/about/PortraitFrame";
import { motion } from "framer-motion";

function toYear(d?: string | null) {
  if (!d) return "";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? d : String(dt.getFullYear());
}

export default function About() {
  const { data: site } = useSite();
  const { data: experience, isLoading: expLoading } = useExperience();
  const { data: education } = useEducation();
  const { data: skills } = useSkills();
  const { data: content } = useAllContent();
  const c = content ?? {};

  const hero = c.about_hero ?? {};
  const philosophy = c.about_philosophy ?? {};
  const workingStyle = c.about_working_style ?? {};
  const books = c.about_books ?? {};
  const values = c.about_values ?? {};
  const funFacts = c.about_fun_facts ?? {};
  const timeline = c.about_timeline ?? {};
  const experienceCopy = c.about_experience ?? {};
  const educationCopy = c.about_education ?? {};
  const toolsCopy = c.about_tools ?? {};

  const exps = (experience ?? []) as ExperienceRow[];

  const yearsValue = exps.length > 0
    ? `${Math.max(1, new Date().getFullYear() - Math.min(...exps.map((e) => Number(toYear(e.start_date)) || new Date().getFullYear())))}+`
    : "—";

  const meta = (hero.meta ?? []).map((m: any) => {
    let v = m.v;
    if (v === "__location__") v = site?.location ?? "—";
    if (v === "__years__") v = yearsValue;
    return { k: m.k, v };
  });

  const milestones: Milestone[] = [
    ...exps.map((e) => ({
      id: `exp-${e.id}`,
      year: toYear(e.start_date) || "—",
      title: `${e.role} · ${e.company}`,
      place: e.location ?? undefined,
      body: e.description ?? undefined,
      _sort: e.start_date ?? "",
    })),
    ...((education ?? []) as any[]).map((ed) => ({
      id: `edu-${ed.id}`,
      year: toYear(ed.start_date) || "—",
      title: `${ed.degree ?? "Studies"}${ed.field ? " in " + ed.field : ""} · ${ed.institution}`,
      place: ed.description ?? undefined,
      body: undefined,
      _sort: ed.start_date ?? "",
    })),
  ]
    .sort((a: any, b: any) => (b._sort > a._sort ? 1 : -1))
    .map(({ _sort, ...rest }: any) => rest);

  return (
    <>
      <Seo
        title="About"
        description={site?.bio ?? site?.tagline ?? ""}
        path="/about"
        siteName={site?.name ?? "Portfolio"}
      />

      <section className="container-page pt-[var(--space-24)] pb-[var(--space-16)] md:pt-40">
        <div className="grid gap-[var(--space-8)] md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <Badge tone="accent" size="sm">{hero.badge ?? "About · Chapter 01"}</Badge>
            <h1 className="display-hero mt-[var(--space-5)] text-5xl md:text-8xl leading-[0.95]">
              {hero.heading_before ?? "A designer who"}{" "}
              <em className="font-serif italic text-[var(--color-accent)]">{hero.heading_accent ?? "listens"}</em>{" "}
              {hero.heading_after ?? "before he draws."}
            </h1>
          </Reveal>
          <Reveal className="md:col-span-4">
            <dl className="grid grid-cols-2 gap-[var(--space-4)] border-t border-hairline pt-[var(--space-5)]">
              {meta.map((m: any) => (
                <div key={m.k}>
                  <dt className="eyebrow">{m.k}</dt>
                  <dd className="mt-[var(--space-1)] font-display text-lg">{m.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="container-page grid gap-[var(--space-12)] pb-[var(--space-24)] md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <PortraitFrame src={site?.profile_image_url ?? undefined} alt={site?.name ?? undefined} />
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7 md:pt-[var(--space-12)]">
          <p className="eyebrow">{hero.bio_eyebrow ?? "Prologue"}</p>
          <div className="mt-[var(--space-5)] space-y-[var(--space-5)] text-lg leading-relaxed">
            {site?.bio ? (
              site.bio.split(/\n\n+/).map((p, i) => (
                <p key={i} className={i === 0 ? "font-display text-2xl md:text-3xl leading-snug" : ""}>
                  {p}
                </p>
              ))
            ) : (
              <p className="text-[var(--color-muted)]">Add your bio in the CMS.</p>
            )}
          </div>
          {site?.email && (
            <div className="mt-[var(--space-8)] flex items-center gap-[var(--space-4)] border-t border-hairline pt-[var(--space-5)]">
              <span className="eyebrow">{hero.say_hello ?? "Say hello"}</span>
              <a href={`mailto:${site.email}`} className="story-link font-display text-xl text-[var(--color-text)]">
                {site.email}
              </a>
            </div>
          )}
        </Reveal>
      </section>

      {milestones.length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge tone="accent" size="sm">{timeline.badge ?? "02 · Timeline"}</Badge>
            <h2 className="display-2 mt-[var(--space-5)]">{timeline.heading ?? "A path built one decision at a time."}</h2>
            <p className="mt-[var(--space-5)] text-[var(--color-muted)]">
              {timeline.subline ?? "Roles, studies, and quiet inflection points — animated as you read."}
            </p>
          </Reveal>
          <div className="mt-[var(--space-16)]">
            <ScrollTimeline items={milestones} />
          </div>
        </section>
      )}

      <section className="container-page py-[var(--space-24)]">
        <div className="grid gap-[var(--space-8)] md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <Badge tone="accent" size="sm">{experienceCopy.badge ?? "03 · Experience"}</Badge>
            <h2 className="display-2 mt-[var(--space-5)] leading-[1.05]">{experienceCopy.heading ?? "The rooms I've worked in."}</h2>
            <p className="mt-[var(--space-5)] text-[var(--color-muted)]">
              {experienceCopy.subline ?? "Expand a card to read the highlights, wins, and lessons carried forward."}
            </p>
          </Reveal>
          <div className="md:col-span-8 space-y-[var(--space-5)]">
            {expLoading && <Skeleton className="h-40 rounded-[var(--radius-lg)]" />}
            {exps.map((e, i) => (
              <ExperienceCard key={e.id} item={e} index={i} />
            ))}
            {!expLoading && exps.length === 0 && (
              <p className="text-[var(--color-muted)]">Add experience entries in the CMS.</p>
            )}
          </div>
        </div>
      </section>

      {education && education.length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <div className="grid gap-[var(--space-12)] md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <Badge tone="accent" size="sm">{educationCopy.badge ?? "04 · Education"}</Badge>
              <h2 className="display-2 mt-[var(--space-5)] leading-[1.05]">{educationCopy.heading ?? "Where the fundamentals were forged."}</h2>
            </Reveal>
            <div className="md:col-span-8 divide-y divide-[var(--color-hairline)] border-y border-hairline">
              {(education as any[]).map((ed) => (
                <Reveal key={ed.id}>
                  <div className="grid gap-[var(--space-6)] py-[var(--space-6)] md:grid-cols-12">
                    <p className="eyebrow md:col-span-3">
                      {[toYear(ed.start_date), toYear(ed.end_date)].filter(Boolean).join(" — ")}
                    </p>
                    <div className="md:col-span-9">
                      <p className="font-display text-2xl">{ed.institution}</p>
                      <p className="mt-[var(--space-1)] text-[var(--color-muted)]">
                        {[ed.degree, ed.field].filter(Boolean).join(" · ")}
                      </p>
                      {ed.description && (
                        <p className="mt-[var(--space-3)] max-w-2xl text-[15px] leading-relaxed">{ed.description}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <Reveal className="border-b border-hairline pb-[var(--space-6)]">
            <Badge tone="accent" size="sm">{toolsCopy.badge ?? "05 · Tools"}</Badge>
            <h2 className="display-2 mt-[var(--space-5)]">{toolsCopy.heading ?? "The instruments in the studio."}</h2>
          </Reveal>
          <div className="mt-[var(--space-12)] grid gap-[var(--space-10)] md:grid-cols-3">
            {skills.map((g) => (
              <Reveal key={g.group}>
                <p className="eyebrow">{g.group}</p>
                <ul className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
                  {g.items.map((s) => (
                    <li key={s}><Tag>{s}</Tag></li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {(philosophy.items ?? []).length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <div className="grid gap-[var(--space-12)] md:grid-cols-12">
            <Reveal className="md:col-span-5 md:sticky md:top-32 md:self-start">
              <Badge tone="accent" size="sm">{philosophy.badge ?? "06 · Design Philosophy"}</Badge>
              <h2 className="display-2 mt-[var(--space-5)] leading-[1.05]">{philosophy.heading ?? "Four beliefs that outrank every trend."}</h2>
            </Reveal>
            <ol className="md:col-span-7 space-y-[var(--space-1)]">
              {philosophy.items.map((p: any, i: number) => (
                <motion.li
                  key={p.k + i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="group grid grid-cols-[auto_1fr] gap-[var(--space-6)] border-t border-hairline py-[var(--space-6)] last:border-b"
                >
                  <span className="font-mono text-xs text-[var(--color-subtle)] pt-[var(--space-2)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-2xl md:text-3xl">{p.k}</p>
                    <p className="mt-[var(--space-2)] text-[var(--color-muted)] leading-relaxed">{p.v}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(workingStyle.items ?? []).length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <Reveal>
            <Badge tone="accent" size="sm">{workingStyle.badge ?? "07 · Working Style"}</Badge>
            <h2 className="display-2 mt-[var(--space-5)] max-w-3xl">{workingStyle.heading ?? "How the sausage gets made."}</h2>
          </Reveal>
          <div className="mt-[var(--space-12)] grid gap-[var(--space-5)] md:grid-cols-2">
            {workingStyle.items.map((w: any, i: number) => (
              <motion.div
                key={w.k + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)] p-[var(--space-6)]"
                style={{ boxShadow: "var(--elevation-1)" }}
              >
                <p className="font-mono text-xs text-[var(--color-subtle)]">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-[var(--space-3)] font-display text-2xl">{w.k}</p>
                <p className="mt-[var(--space-2)] text-[var(--color-muted)] leading-relaxed">{w.v}</p>
                <span
                  aria-hidden
                  className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full opacity-40"
                  style={{ background: "radial-gradient(circle, var(--color-accent-glow), transparent 70%)" }}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {(books.items ?? []).length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <div className="grid gap-[var(--space-8)] md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <Badge tone="accent" size="sm">{books.badge ?? "08 · Reading Shelf"}</Badge>
              <h2 className="display-2 mt-[var(--space-5)] leading-[1.05]">{books.heading ?? "Books that keep coming back."}</h2>
            </Reveal>
            <ul className="md:col-span-8 divide-y divide-[var(--color-hairline)] border-y border-hairline">
              {books.items.map((b: any, i: number) => (
                <motion.li
                  key={b.title + i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="group flex items-baseline justify-between gap-[var(--space-6)] py-[var(--space-5)]"
                >
                  <span className="flex items-baseline gap-[var(--space-5)]">
                    <span className="font-mono text-xs text-[var(--color-subtle)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-xl md:text-2xl transition-colors group-hover:text-[var(--color-accent)]">{b.title}</span>
                  </span>
                  <span className="eyebrow text-right">{b.author}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(values.items ?? []).length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge tone="accent" size="sm">{values.badge ?? "09 · Values"}</Badge>
            <h2 className="display-2 mt-[var(--space-5)]">{values.heading ?? "The compass, not the map."}</h2>
          </Reveal>
          <div className="mt-[var(--space-12)] grid gap-[var(--space-1)] md:grid-cols-4">
            {values.items.map((v: any, i: number) => (
              <motion.div
                key={v.k + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="border border-hairline bg-[var(--color-surface)] p-[var(--space-6)]"
              >
                <p className="font-mono text-xs text-[var(--color-subtle)]">V/{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-[var(--space-4)] font-display text-3xl">{v.k}</p>
                <p className="mt-[var(--space-3)] text-sm text-[var(--color-muted)] leading-relaxed">{v.v}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {(funFacts.items ?? []).length > 0 && (
        <section className="container-page py-[var(--space-24)] mb-[var(--space-16)]">
          <Reveal>
            <Badge tone="accent" size="sm">{funFacts.badge ?? "10 · Off the Clock"}</Badge>
            <h2 className="display-2 mt-[var(--space-5)] max-w-3xl">{funFacts.heading ?? "A few unimportant, telling things."}</h2>
          </Reveal>
          <ul className="mt-[var(--space-10)] flex flex-wrap gap-[var(--space-3)]">
            {funFacts.items.map((f: string, i: number) => (
              <motion.li
                key={f + i}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-[var(--radius-pill)] border border-hairline bg-[var(--color-card)] px-[var(--space-5)] py-[var(--space-3)] text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] hover:border-[var(--color-hairline-strong)]"
              >
                {f}
              </motion.li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
