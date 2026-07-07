import { Seo } from "@/lib/seo";
import { useSite, useExperience, useEducation, useSkills } from "@/lib/cms";
import { Reveal } from "@/components/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, Tag } from "@/components/design";
import { ExperienceCard, type ExperienceRow } from "@/components/about/ExperienceCard";
import { ScrollTimeline, type Milestone } from "@/components/about/ScrollTimeline";
import { PortraitFrame } from "@/components/about/PortraitFrame";
import { motion } from "framer-motion";

/* Editorial content — non-CMS accents. Adjust freely. */
const PHILOSOPHY = [
  { k: "Clarity over cleverness", v: "The best interfaces disappear. Craft is what you remove." },
  { k: "Systems, not screens", v: "Every component earns its place through reuse and restraint." },
  { k: "Type is the design", v: "Rhythm, scale, and hierarchy do more than any illustration." },
  { k: "Motion with meaning", v: "Animation clarifies cause and effect. Never decoration." },
];

const WORKING_STYLE = [
  { k: "Deep work, mornings", v: "First 4 hours are always for the hardest problem." },
  { k: "Prototype in public", v: "Ship the sketch. Real feedback beats rehearsed decks." },
  { k: "Async by default", v: "Written thinking scales; meetings compound entropy." },
  { k: "Ship weekly", v: "Small, honest increments over quarterly reveals." },
];

const BOOKS = [
  { title: "The Design of Everyday Things", author: "Don Norman" },
  { title: "Refactoring UI", author: "Adam Wathan & Steve Schoger" },
  { title: "Shape Up", author: "Ryan Singer" },
  { title: "Thinking in Systems", author: "Donella Meadows" },
  { title: "A Pattern Language", author: "Christopher Alexander" },
  { title: "The Elements of Typographic Style", author: "Robert Bringhurst" },
];

const FUN_FACTS = [
  "Collects mechanical keyboards but only uses one.",
  "Brews pour-over on a 1:16 ratio, no exceptions.",
  "Has read every issue of Offscreen Magazine.",
  "Once redesigned a menu at a café — for free.",
  "Owns 12 notebooks. Uses one at a time.",
];

const VALUES = [
  { k: "Craft", v: "Details are the design." },
  { k: "Honesty", v: "Say what the product actually does." },
  { k: "Curiosity", v: "The best answer is often the next question." },
  { k: "Generosity", v: "Teach what you learn." },
];

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

  const exps = (experience ?? []) as ExperienceRow[];

  // Build combined milestones from experience + education, sorted by start date desc
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

      {/* ─────────────────────────────────  HERO  ───────────────────────────────── */}
      <section className="container-page pt-[var(--space-24)] pb-[var(--space-16)] md:pt-40">
        <div className="grid gap-[var(--space-8)] md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <Badge tone="accent" size="sm">About · Chapter 01</Badge>
            <h1 className="display-hero mt-[var(--space-5)] text-5xl md:text-8xl leading-[0.95]">
              A designer who <em className="font-serif italic text-[var(--color-accent)]">listens</em>{" "}
              before he draws.
            </h1>
          </Reveal>
          <Reveal className="md:col-span-4">
            <dl className="grid grid-cols-2 gap-[var(--space-4)] border-t border-hairline pt-[var(--space-5)]">
              <div>
                <dt className="eyebrow">Based in</dt>
                <dd className="mt-[var(--space-1)] font-display text-lg">{site?.location ?? "—"}</dd>
              </div>
              <div>
                <dt className="eyebrow">Currently</dt>
                <dd className="mt-[var(--space-1)] font-display text-lg">Open to briefs</dd>
              </div>
              <div>
                <dt className="eyebrow">Years</dt>
                <dd className="mt-[var(--space-1)] font-display text-lg">
                  {exps.length > 0 ? `${Math.max(1, new Date().getFullYear() - Math.min(...exps.map((e) => Number(toYear(e.start_date)) || new Date().getFullYear())))}+` : "—"}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Discipline</dt>
                <dd className="mt-[var(--space-1)] font-display text-lg">Product · Brand</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────  PORTRAIT + BIO  ────────────────────── */}
      <section className="container-page grid gap-[var(--space-12)] pb-[var(--space-24)] md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <PortraitFrame src={site?.profile_image_url ?? undefined} alt={site?.name ?? undefined} />
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7 md:pt-[var(--space-12)]">
          <p className="eyebrow">Prologue</p>
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
              <span className="eyebrow">Say hello</span>
              <a
                href={`mailto:${site.email}`}
                className="story-link font-display text-xl text-[var(--color-text)]"
              >
                {site.email}
              </a>
            </div>
          )}
        </Reveal>
      </section>

      {/* ─────────────────────────────────  TIMELINE  ──────────────────────────── */}
      {milestones.length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge tone="accent" size="sm">02 · Timeline</Badge>
            <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)]">
              A path built one decision at a time.
            </h2>
            <p className="mt-[var(--space-5)] text-[var(--color-muted)]">
              Roles, studies, and quiet inflection points — animated as you read.
            </p>
          </Reveal>
          <div className="mt-[var(--space-16)]">
            <ScrollTimeline items={milestones} />
          </div>
        </section>
      )}

      {/* ─────────────────────────────────  EXPERIENCE  ────────────────────────── */}
      <section className="container-page py-[var(--space-24)]">
        <div className="grid gap-[var(--space-8)] md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <Badge tone="accent" size="sm">03 · Experience</Badge>
            <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)] leading-[1.05]">
              The rooms I've worked in.
            </h2>
            <p className="mt-[var(--space-5)] text-[var(--color-muted)]">
              Expand a card to read the highlights, wins, and lessons carried forward.
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

      {/* ─────────────────────────────────  EDUCATION  ─────────────────────────── */}
      {education && education.length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <div className="grid gap-[var(--space-12)] md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <Badge tone="accent" size="sm">04 · Education</Badge>
              <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)] leading-[1.05]">
                Where the fundamentals were forged.
              </h2>
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
                        <p className="mt-[var(--space-3)] max-w-2xl text-[15px] leading-relaxed">
                          {ed.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────  TOOLS  ─────────────────────────────── */}
      {skills && skills.length > 0 && (
        <section className="container-page py-[var(--space-24)]">
          <Reveal className="border-b border-hairline pb-[var(--space-6)]">
            <Badge tone="accent" size="sm">05 · Tools</Badge>
            <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)]">
              The instruments in the studio.
            </h2>
          </Reveal>
          <div className="mt-[var(--space-12)] grid gap-[var(--space-10)] md:grid-cols-3">
            {skills.map((g) => (
              <Reveal key={g.group}>
                <p className="eyebrow">{g.group}</p>
                <ul className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
                  {g.items.map((s) => (
                    <li key={s}>
                      <Tag>{s}</Tag>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────  PHILOSOPHY  ────────────────────────── */}
      <section className="container-page py-[var(--space-24)]">
        <div className="grid gap-[var(--space-12)] md:grid-cols-12">
          <Reveal className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <Badge tone="accent" size="sm">06 · Design Philosophy</Badge>
            <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)] leading-[1.05]">
              Four beliefs that outrank every trend.
            </h2>
          </Reveal>
          <ol className="md:col-span-7 space-y-[var(--space-1)]">
            {PHILOSOPHY.map((p, i) => (
              <motion.li
                key={p.k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group grid grid-cols-[auto_1fr] gap-[var(--space-6)] border-t border-hairline py-[var(--space-6)] last:border-b"
              >
                <span className="font-mono text-xs text-[var(--color-subtle)] pt-[var(--space-2)]">
                  0{i + 1}
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

      {/* ─────────────────────────────────  WORKING STYLE  ─────────────────────── */}
      <section className="container-page py-[var(--space-24)]">
        <Reveal>
          <Badge tone="accent" size="sm">07 · Working Style</Badge>
          <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)] max-w-3xl">
            How the sausage gets made.
          </h2>
        </Reveal>
        <div className="mt-[var(--space-12)] grid gap-[var(--space-5)] md:grid-cols-2">
          {WORKING_STYLE.map((w, i) => (
            <motion.div
              key={w.k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)] p-[var(--space-6)]"
              style={{ boxShadow: "var(--elevation-1)" }}
            >
              <p className="font-mono text-xs text-[var(--color-subtle)]">0{i + 1}</p>
              <p className="mt-[var(--space-3)] font-display text-2xl">{w.k}</p>
              <p className="mt-[var(--space-2)] text-[var(--color-muted)] leading-relaxed">{w.v}</p>
              <span
                aria-hidden
                className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-accent-glow), transparent 70%)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────  BOOKS  ─────────────────────────────── */}
      <section className="container-page py-[var(--space-24)]">
        <div className="grid gap-[var(--space-8)] md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <Badge tone="accent" size="sm">08 · Reading Shelf</Badge>
            <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)] leading-[1.05]">
              Books that keep coming back.
            </h2>
          </Reveal>
          <ul className="md:col-span-8 divide-y divide-[var(--color-hairline)] border-y border-hairline">
            {BOOKS.map((b, i) => (
              <motion.li
                key={b.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group flex items-baseline justify-between gap-[var(--space-6)] py-[var(--space-5)]"
              >
                <span className="flex items-baseline gap-[var(--space-5)]">
                  <span className="font-mono text-xs text-[var(--color-subtle)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl md:text-2xl transition-colors group-hover:text-[var(--color-accent)]">
                    {b.title}
                  </span>
                </span>
                <span className="eyebrow text-right">{b.author}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────────────────────  VALUES  ────────────────────────────── */}
      <section className="container-page py-[var(--space-24)]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Badge tone="accent" size="sm">09 · Values</Badge>
          <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)]">
            The compass, not the map.
          </h2>
        </Reveal>
        <div className="mt-[var(--space-12)] grid gap-[var(--space-1)] md:grid-cols-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="border border-hairline bg-[var(--color-surface)] p-[var(--space-6)]"
            >
              <p className="font-mono text-xs text-[var(--color-subtle)]">V/0{i + 1}</p>
              <p className="mt-[var(--space-4)] font-display text-3xl">{v.k}</p>
              <p className="mt-[var(--space-3)] text-sm text-[var(--color-muted)] leading-relaxed">
                {v.v}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────  FUN FACTS  ─────────────────────────── */}
      <section className="container-page py-[var(--space-24)] mb-[var(--space-16)]">
        <Reveal>
          <Badge tone="accent" size="sm">10 · Off the Clock</Badge>
          <h2 className="font-display text-4xl md:text-6xl mt-[var(--space-5)] max-w-3xl">
            A few unimportant, telling things.
          </h2>
        </Reveal>
        <ul className="mt-[var(--space-10)] flex flex-wrap gap-[var(--space-3)]">
          {FUN_FACTS.map((f, i) => (
            <motion.li
              key={f}
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
    </>
  );
}
