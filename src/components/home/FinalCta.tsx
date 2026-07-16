import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useSite, useContent } from "@/lib/cms";

type Data = {
  heading_line1: string;
  heading_accent: string;
  heading_line2: string;
  subline: string;
  cta_label: string;
};

const FALLBACK: Data = {
  heading_line1: "Let's",
  heading_accent: "Build",
  heading_line2: "Something Amazing!",
  subline: "Ready to elevate your brand with stunning, user-friendly design? Get started today and bring your vision to life!",
  cta_label: "Start New Project",
};

const MOCKS = [
  { hue: 340, top: "5%",  left: "-2%",  rot: -6 },
  { hue: 200, top: "12%", left: "18%",  rot: 3 },
  { hue: 40,  top: "0%",  left: "38%",  rot: -2 },
  { hue: 160, top: "8%",  left: "60%",  rot: 4 },
  { hue: 280, top: "3%",  left: "82%",  rot: -5 },
  { hue: 20,  top: "58%", left: "-4%",  rot: 5 },
  { hue: 180, top: "62%", left: "22%",  rot: -3 },
  { hue: 300, top: "55%", left: "58%",  rot: 2 },
  { hue: 100, top: "60%", left: "80%",  rot: -4 },
];

export function FinalCta() {
  const { data: site } = useSite();
  const { data: c } = useContent<Data>("home_cta", FALLBACK);
  const d = c ?? FALLBACK;

  return (
    <section className="relative overflow-hidden py-24 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {MOCKS.map((m, i) => (
          <div
            key={i}
            className="absolute h-40 w-64 rounded-xl border border-[var(--color-hairline-strong)] opacity-40 md:h-44 md:w-72"
            style={{
              top: m.top,
              left: m.left,
              transform: `rotate(${m.rot}deg)`,
              background: `linear-gradient(135deg, hsl(${m.hue}, 40%, 25%), hsl(${m.hue}, 30%, 12%))`,
            }}
          >
            <div className="flex gap-1 border-b border-[var(--color-hairline)] p-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
            </div>
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 20%, var(--color-bg) 70%)" }}
        />
      </div>

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            className="font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-text)]"
            style={{ fontSize: "clamp(2.4rem, 5.4vw, 4.5rem)" }}
          >
            {d.heading_line1} <span className="text-[var(--color-accent)]">{d.heading_accent}</span>
            <br /> {d.heading_line2}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-muted)]">
            {d.subline}
          </p>

          {site?.email && (
            <a href={`mailto:${site.email}`} className="btn-primary mt-10">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent-contrast)] text-[var(--color-accent)]">
                <ArrowRight size={15} />
              </span>
              {d.cta_label}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
