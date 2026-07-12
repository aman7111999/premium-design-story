import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { useSite } from "@/lib/cms";
import portraitImg from "@/assets/portrait.jpg";
import { Quote } from "lucide-react";


export function StatsBand() {
  const { data: site } = useSite();
  const avatar = site?.profile_image_url;

  return (
    <section className="container-page py-24 md:py-32">
      <div className="grid items-center gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="eyebrow">About</p>
          <h2
            className="mt-3 font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--color-text)]"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}
          >
            Designing Websites that
            <br /> <span className="text-[var(--color-accent)]">Inspire &amp; Convert</span>
          </h2>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { v: "48+", l: "Projects Done" },
              { v: "90%", l: "Client Retention" },
              { v: "110%", l: "Avg. Conversion" },
            ].map((m) => (
              <div key={m.l}>
                <div className="text-[42px] font-semibold leading-none tracking-[-0.02em] text-[var(--color-text)]">
                  <CountUp value={m.v} />
                </div>
                <div className="mt-2 text-[12px] text-[var(--color-muted)]">{m.l}</div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-md text-[14px] leading-relaxed text-[var(--color-muted)]">
            I'm {site?.name ?? "Aman"} — a product designer helping founders
            and teams ship digital experiences that people remember. Six years
            of pixel-craft, motion, and shipping.
          </p>
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
              {/* bottom fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(5,8,7,0.75) 100%)",
                }}
              />
              {/* Quote overlay chip */}
              <div className="absolute inset-x-4 bottom-4 flex items-start gap-3 rounded-2xl border border-[var(--color-hairline-strong)] bg-[color-mix(in_oklab,var(--color-surface)_70%,transparent)] p-4 backdrop-blur-md">
                <Quote size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <p className="text-[13px] leading-snug text-[var(--color-text)]">
                  "Design is the bridge between a problem and a product people
                  can love."
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
