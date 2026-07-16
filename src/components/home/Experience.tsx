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
    company: "Motilal Oswal Financial Services",
    role: "Assistant Manager, Product Design",
    period: "Aug 2025 — Present",
    location: "Mumbai, India",
    summary:
      "Leading the end-to-end UX revamp of the Riise investment platform across Stocks, F&O, Mutual Funds, US Stocks, and Algo Trading. Architecting ‘Mira AI’ and the 0-to-1 ‘Screener’ product line.",
    tags: ["Fintech", "AI", "Design Systems"],
  },
  {
    company: "Trinkerr",
    role: "Product Designer",
    period: "Feb 2023 — Apr 2025",
    location: "Bangalore, India",
    summary:
      "Designed SEBI-registered advisory flows driving 30% adoption uplift. Revamped Portfolio Health Report and Feed for a 60% engagement lift. Co-architected the TIQS 2.0 Design System across iOS and Android.",
    tags: ["SEBI", "Data Storytelling", "TIQS 2.0"],
  },
  {
    company: "Trinkerr",
    role: "Associate Product Designer",
    period: "Jan 2022 — Feb 2023",
    location: "Bangalore, India",
    summary:
      "Redesigned the portfolio import flow with progressive disclosure — a 90% lift in successful completions. Shipped watchlist, portfolio, and transaction features driving 60% feature adoption.",
    tags: ["Mobile", "Research", "Investing"],
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
