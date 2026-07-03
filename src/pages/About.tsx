import { Seo } from "@/lib/seo";
import { site, experience, skills } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export default function About() {
  return (
    <>
      <Seo title="About" description={`About ${site.name}, ${site.role}.`} path="/about" />

      <section className="container-page pt-24 pb-16 md:pt-40">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">About</p>
          <h1 className="display-hero mt-4 max-w-4xl text-5xl md:text-8xl">
            I design products that carry their weight quietly.
          </h1>
        </Reveal>
      </section>

      <section className="container-page grid gap-16 pb-24 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <div
            className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-hairline"
            style={{
              background:
                "linear-gradient(160deg, #E7EDE7 0%, #B6C5BE 60%, #3F5A55 100%)",
            }}
            aria-label="Portrait placeholder"
          />
          <p className="mt-4 text-xs text-[var(--color-muted)]">
            Portrait placeholder — replace with a real photo.
          </p>
        </Reveal>

        <Reveal className="md:col-span-7 md:col-start-6">
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              I'm {site.name}, a product designer based in {site.location}. I've spent the
              last five years working across fintech, AI, and design systems at companies
              like Razorpay and CRED.
            </p>
            <p>
              My path into design was slow and non-linear. I studied engineering, worked
              briefly in research, then found my way to product design through the side
              door of front-end code. That path shows up in how I work: I care about
              why the thing exists, how the system supports it, and how the code
              eventually ships.
            </p>
            <p>
              Outside of work I read too much fiction, take photographs on film, and
              try to run before it gets hot in Bengaluru.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="container-page mt-16">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Timeline</p>
          <h2 className="font-display text-3xl md:text-5xl mt-3">The path so far</h2>
        </Reveal>

        <div className="mt-12 divide-y divide-[var(--color-hairline)]">
          {experience.map((e) => (
            <Reveal key={e.company}>
              <div className="grid gap-6 py-10 md:grid-cols-12">
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] md:col-span-3">
                  {e.period}
                </p>
                <div className="md:col-span-9">
                  <p className="font-display text-3xl">{e.company}</p>
                  <p className="text-sm text-[var(--color-muted)] mt-1">{e.role}</p>
                  <p className="mt-4 max-w-2xl leading-relaxed">{e.summary}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-32">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">What I value</p>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {[
            {
              t: "Rigor over polish",
              b: "I'd rather ship a rough thing that answers the right question than a perfect thing that answers the wrong one.",
            },
            {
              t: "Systems, not screens",
              b: "I try to design the smallest number of decisions that produce the largest number of good outcomes.",
            },
            {
              t: "Honest interfaces",
              b: "The best products tell users what they know, what they don't, and what to do next. Everything else is noise.",
            },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <p className="font-display text-2xl">{v.t}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">{v.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-32 mb-24">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Craft</p>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {skills.map((g) => (
            <div key={g.group}>
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{g.group}</p>
              <ul className="mt-4 space-y-1 text-lg">
                {g.items.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
