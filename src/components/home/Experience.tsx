import { Reveal } from "@/components/Reveal";
import { Briefcase, MapPin } from "lucide-react";
import { useExperience, useContent } from "@/lib/cms";

type Data = { eyebrow: string; heading_line1: string; heading_line2: string };
const FALLBACK: Data = {
  eyebrow: "Experience",
  heading_line1: "A decade of shipping",
  heading_line2: "thoughtful product work.",
};

function fmtPeriod(s?: string | null, e?: string | null) {
  const a = (s ?? "").trim();
  const b = (e ?? "").trim() || "Present";
  return [a, b].filter(Boolean).join(" — ");
}

export function Experience() {
  const { data: rows } = useExperience();
  const { data: c } = useContent<Data>("home_experience", FALLBACK);
  const d = c ?? FALLBACK;
  const roles = (rows ?? []) as any[];

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <div className="max-w-2xl">
          <span className="glass-pill">
            <Briefcase size={12} className="text-[var(--color-accent)]" />
            {d.eyebrow}
          </span>
          <h2 className="mt-5 text-4xl md:text-6xl leading-[1.05]">
            {d.heading_line1}<br />
            <span className="font-serif italic text-[var(--color-accent)]">{d.heading_line2}</span>
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5">
        {roles.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.05}>
            <div className="liquid-glass p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-start">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {fmtPeriod(r.start_date, r.end_date)}
                  </p>
                  <p className="mt-2 text-[22px] font-semibold tracking-[-0.015em] text-[var(--color-text)]">{r.company}</p>
                  {r.location && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
                      <MapPin size={12} /> {r.location}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[17px] font-medium text-[var(--color-accent)]">{r.role}</p>
                  {r.description && (
                    <p className="mt-2.5 text-[16px] leading-[1.65] text-[var(--color-muted)]">
                      {r.description}
                    </p>
                  )}
                  {(r.highlights?.length ?? 0) > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.highlights.map((t: string) => (
                        <span
                          key={t}
                          className="rounded-full border border-[var(--color-hairline-strong)] px-3 py-1 text-[12px] text-[var(--color-text)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
