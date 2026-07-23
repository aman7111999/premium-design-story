import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { useSite, useContent } from "@/lib/cms";
import portraitImg from "@/assets/portrait.jpg";
import { Quote } from "lucide-react";

type Data = {
  eyebrow: string;
  heading_line1: string;
  heading_accent: string;
  items: { v: string; l: string }[];
  body: string;
  quote: string;
};

const FALLBACK: Data = {
  eyebrow: "About",
  heading_line1: "Designing Websites that",
  heading_accent: "Inspire & Convert",
  items: [
    { v: "48+", l: "Projects Done" },
    { v: "90%", l: "Client Retention" },
    { v: "110%", l: "Avg. Conversion" },
  ],
  body: "I'm {name} — a product designer helping founders and teams ship digital experiences that people remember. Six years of pixel-craft, motion, and shipping.",
  quote: "Design is the bridge between a problem and a product people can love.",
};

export function StatsBand() {
  const { data: site } = useSite();
  const { data: c } = useContent<Data>("home_stats", FALLBACK);
  const d = c ?? FALLBACK;
  const avatar = site?.profile_image_url;
  const body = (d.body ?? "").replace("{name}", site?.name ?? "Aman");

  return (
    <section className="container-page py-24 md:py-32">
      <div className="grid items-center gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="eyebrow">{d.eyebrow}</p>
          <h2
            className="mt-3 font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--color-text)]"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}
          >
            {d.heading_line1}
            <br /> <span className="text-[var(--color-accent)]">{d.heading_accent}</span>
          </h2>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {(d.items ?? []).map((m) => (
              <div key={m.l} className="min-w-0">
                <div
                  className="font-semibold leading-none tracking-[-0.02em] text-[var(--color-text)]"
                  style={{ fontSize: "clamp(1.75rem, 6vw, 2.625rem)" }}
                >
                  <CountUp value={m.v} />
                </div>
                <div className="mt-2 text-[12px] leading-snug text-[var(--color-muted)] sm:text-[13px]">{m.l}</div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-md text-[15px] leading-[1.65] text-[var(--color-muted)]">{body}</p>
        </Reveal>

        <Reveal className="md:col-span-6">
          <div className="liquid-glass relative overflow-hidden p-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-lg)-6px)]">
              <img
                src={avatar || portraitImg}
                alt={site?.name ?? "Portrait"}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 40%, rgba(5,8,7,0.75) 100%)" }}
              />
              <div className="absolute inset-x-4 bottom-4 flex items-start gap-3 rounded-2xl border border-[var(--color-hairline-strong)] bg-[color-mix(in_oklab,var(--color-surface)_70%,transparent)] p-4 backdrop-blur-md">
                <Quote size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <p className="text-[14px] leading-[1.5] text-[var(--color-text)]">"{d.quote}"</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
