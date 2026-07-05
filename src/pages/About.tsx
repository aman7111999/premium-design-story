import { Seo } from "@/lib/seo";
import { useSite, useExperience, useSkills } from "@/lib/cms";
import { Reveal } from "@/components/Reveal";
import { Skeleton } from "@/components/ui/skeleton";

export default function About() {
  const { data: site } = useSite();
  const { data: experience, isLoading: expLoading } = useExperience();
  const { data: skills } = useSkills();
  return (
    <>
      <Seo title="About" description={site?.bio ?? site?.tagline ?? ""} path="/about" siteName={site?.name ?? "Portfolio"} />

      <section className="container-page pt-24 pb-16 md:pt-40">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">About</p>
          <h1 className="display-hero mt-4 max-w-4xl text-5xl md:text-8xl">I design products that carry their weight quietly.</h1>
        </Reveal>
      </section>

      <section className="container-page grid gap-16 pb-24 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <div
            className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-hairline"
            style={{
              background: site?.profile_image_url
                ? `center/cover url(${site.profile_image_url})`
                : "linear-gradient(160deg, #E7EDE7 0%, #B6C5BE 60%, #3F5A55 100%)",
            }}
            aria-label={site?.name ?? undefined}
          />
        </Reveal>
        <Reveal className="md:col-span-7 md:col-start-6">
          <div className="space-y-6 text-lg leading-relaxed">
            {site?.bio ? <p>{site.bio}</p> : <p className="text-[var(--color-muted)]">Add your bio in the CMS.</p>}
          </div>
        </Reveal>
      </section>

      <section className="container-page mt-16">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Timeline</p>
          <h2 className="font-display text-3xl md:text-5xl mt-3">The path so far</h2>
        </Reveal>
        <div className="mt-12 divide-y divide-[var(--color-hairline)]">
          {expLoading && <Skeleton className="h-32" />}
          {(experience ?? []).map((e: any) => (
            <Reveal key={e.id}>
              <div className="grid gap-6 py-10 md:grid-cols-12">
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] md:col-span-3">
                  {[e.start_date, e.end_date].filter(Boolean).join(" — ")}
                </p>
                <div className="md:col-span-9">
                  <p className="font-display text-3xl">{e.company}</p>
                  <p className="text-sm text-[var(--color-muted)] mt-1">{e.role}</p>
                  {e.description && <p className="mt-4 max-w-2xl leading-relaxed">{e.description}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-32 mb-24">
        <Reveal className="border-b border-hairline pb-6">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Craft</p>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {(skills ?? []).map((g) => (
            <div key={g.group}>
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{g.group}</p>
              <ul className="mt-4 space-y-1 text-lg">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
