import { Reveal } from "@/components/Reveal";
import { Briefcase, MapPin } from "lucide-react";

type Role = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  tags: string[];
};

const ROLES: Role[] = [
  {
    company: "Freelance",
    role: "Product & Framer Designer",
    period: "2024 — Present",
    location: "Remote",
    summary:
      "Partnering with startups and agencies to design and ship high-converting product surfaces, marketing sites, and design systems in Framer and Figma.",
    tags: ["Product", "Framer", "Design Systems"],
  },
  {
    company: "Studio Nord",
    role: "Senior Product Designer",
    period: "2022 — 2024",
    location: "Berlin, DE",
    summary:
      "Led end-to-end product design for B2B SaaS clients — from discovery and prototyping through motion and hand-off to engineering.",
    tags: ["SaaS", "Prototyping", "Motion"],
  },
  {
    company: "Northlane",
    role: "Product Designer",
    period: "2020 — 2022",
    location: "Amsterdam, NL",
    summary:
      "Shipped onboarding, billing, and dashboard experiences used by 40k+ teams. Built the first version of the internal design system.",
    tags: ["Dashboard", "Onboarding", "DS v1"],
  },
  {
    company: "Kernel Labs",
    role: "UI/UX Designer",
    period: "2018 — 2020",
    location: "Bengaluru, IN",
    summary:
      "Designed mobile-first fintech and consumer apps. Ran usability testing sprints and defined the visual language for two flagship products.",
    tags: ["Mobile", "Fintech", "Research"],
  },
];

export function Experience() {
  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <div className="max-w-2xl">
          <span className="glass-pill">
            <Briefcase size={12} className="text-[var(--color-accent)]" />
            Experience
          </span>
          <h2 className="mt-5 text-4xl md:text-6xl leading-[1.05]">
            A decade of shipping<br />
            <span className="font-serif italic text-[var(--color-accent)]">thoughtful product work.</span>
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5">
        {ROLES.map((r, i) => (
          <Reveal key={r.company} delay={i * 0.05}>
            <div className="liquid-glass p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[240px_1fr_auto] md:items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    {r.period}
                  </p>
                  <p className="mt-2 text-xl font-semibold">{r.company}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                    <MapPin size={11} /> {r.location}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-medium text-[var(--color-accent)]">{r.role}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted)]">
                    {r.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--color-hairline-strong)] px-3 py-1 text-[11px] text-[var(--color-text)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
