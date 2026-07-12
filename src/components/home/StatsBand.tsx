import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { useSite } from "@/lib/cms";

export function StatsBand() {
  const { data: site } = useSite();
  const avatar = site?.profile_image_url;

  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="eyebrow">Impact</p>
          <h2 className="display-2 mt-4 text-[var(--color-text)]">
            Designing websites that{" "}
            <em className="italic text-[var(--color-accent)]">inspire &amp; convert</em>.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--color-muted)]">
            Numbers from the last few years of product & brand work — shipped
            with founders, seed startups, and small teams.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "6+", label: "Years shipping" },
              { value: "40+", label: "Projects delivered" },
              { value: "110%", label: "Avg. conversion lift" },
            ].map((m) => (
              <div key={m.label} className="card-dark p-5">
                <div className="font-heavy text-[32px] font-black leading-none text-[var(--color-accent)]">
                  <CountUp value={m.value} />
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="md:col-span-5">
          <div className="card-dark relative overflow-hidden p-2">
            <div
              className="aspect-[4/5] w-full rounded-[calc(var(--radius-lg)-4px)] bg-[var(--color-elevated)]"
              style={
                avatar
                  ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : undefined
              }
            />
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-[var(--color-hairline-strong)] bg-[var(--color-overlay)] p-4 backdrop-blur-md">
              <p className="font-display italic text-[16px] leading-snug text-[var(--color-text)]">
                "Design is not decoration — it's the strategy made visible."
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                — {site?.name ?? "Aman Mishra"}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
