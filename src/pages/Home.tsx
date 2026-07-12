import { Seo } from "@/lib/seo";
import { useSite, useProjects } from "@/lib/cms";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/Hero";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram } from "lucide-react";

const PERSONAL_LINE_PARTS = [
  { text: "BESIDES design, I ", italic: false },
  { text: "love", italic: true },
  { text: " * ", italic: false },
  { text: "hip-hop, ", italic: true },
  { text: " petting street ", italic: false },
  { text: "cats, ", italic: true },
  { text: " exploring cities, ", italic: false },
  { text: "making art & illustrations.", italic: true },
];

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
        jobTitle: "Senior Product Designer",
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
        description={site?.tagline ?? ""}
        path="/"
        jsonLd={jsonLd}
        siteName={site?.name ?? "Aman Mishra"}
      />

      {/* ==================== HERO ==================== */}
      <Hero />

      {/* ==================== FEATURED PROJECTS ==================== */}
      <section id="work" className="container-page py-16 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            className="font-display italic leading-[1.02] text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            Featured Projects
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-[var(--color-muted)]">
            A handful of the products, systems, and 0→1 experiments I've shipped recently.
          </p>
        </Reveal>


        {/* 2 large hero cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-7">
          {fLoading &&
            [1, 2].map((i) => (
              <Skeleton
                key={i}
                className="h-[420px] w-full rounded-[var(--radius-lg)]"
              />
            ))}
          {large.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} size="lg" />
          ))}
        </div>

        {/* Small grid — up to 4 more */}
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
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        )}
      </section>

      {/* ==================== BESIDES DESIGN ==================== */}
      <section className="container-page py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p
              className="font-display leading-[1.15] text-[var(--color-text)]"
              style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)" }}
            >
              {PERSONAL_LINE_PARTS.map((part, i) =>
                part.italic ? (
                  <em
                    key={i}
                    className="italic text-[var(--color-accent)]"
                    style={{ fontStyle: "italic" }}
                  >
                    {part.text}
                  </em>
                ) : (
                  <span
                    key={i}
                    className="font-heavy uppercase tracking-[-0.01em] text-[var(--color-text)]"
                    style={{ fontWeight: 800, fontSize: "0.85em" }}
                  >
                    {part.text}
                  </span>
                ),
              )}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {(site?.socials ?? [])
                .filter((s) => /instagram|art|dribbble|behance/i.test(s.label))
                .slice(0, 1)
                .map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-hairline-strong)] px-5 py-3 font-heavy text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    <Instagram size={13} />
                    My {s.label}
                    <ArrowUpRight size={12} />
                  </a>
                ))}
            </div>
          </Reveal>

          {/* Playful collage — three colored blocks (placeholder for real photos) */}
          <Reveal className="md:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="aspect-[3/4] rounded-[var(--radius-lg)] border border-[var(--color-hairline-strong)]"
                style={{
                  background:
                    "radial-gradient(120% 100% at 30% 20%, #ff3e7f33 0%, transparent 60%), linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
                }}
              />
              <div className="flex flex-col gap-4">
                <div
                  className="aspect-square rounded-[var(--radius-lg)] border border-[var(--color-hairline-strong)]"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 70% 30%, #ffd6b344 0%, transparent 60%), linear-gradient(180deg, #2b1e3f 0%, #1a1425 100%)",
                  }}
                />
                <div
                  className="aspect-square rounded-[var(--radius-lg)] border border-[var(--color-hairline-strong)]"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 40% 70%, #7ee3a444 0%, transparent 60%), linear-gradient(180deg, #1c2f2c 0%, #10201d 100%)",
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
