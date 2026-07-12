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
          <div className="card-dark relative overflow-hidden p-3">
            <div
              className="aspect-[4/3] w-full rounded-[calc(var(--radius-lg)-6px)] bg-[var(--color-elevated)]"
              style={
                avatar
                  ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : undefined
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
