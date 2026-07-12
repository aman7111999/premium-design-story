import { Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const TESTIMONIALS = [
  { name: "Priya Shah", role: "Founder, Northloop", quote: "Aman turned a rough vision into a product that feels inevitable. Rare taste, faster than a small team." },
  { name: "Marcus Lee", role: "PM, Fintrace", quote: "Ship-ready designs, honest feedback, motion that makes the product feel alive. Would rehire tomorrow." },
  { name: "Elena Ruiz", role: "CEO, Havenly.io", quote: "Went from static wires to a living Framer site in two weeks. The polish is on another level." },
  { name: "Devon Park", role: "Design Lead, Orbital", quote: "A rare balance of systems thinking and craft. He fixes the why, not just the pixels." },
  { name: "Sara Wen", role: "Founder, Vellum", quote: "Our sign-ups doubled in the first month after his redesign. Enough said." },
];

export function TestimonialsRow() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Kind Words</p>
          <h2 className="display-2 mt-4 text-[var(--color-text)]">
            Loved by <em className="italic text-[var(--color-accent)]">designers &amp; teams</em> around the world.
          </h2>
        </Reveal>
      </div>

      <div className="mt-14 relative">
        {/* Gradient masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <div key={i} className="card-dark w-[340px] shrink-0 p-6">
              <div className="flex gap-0.5 text-[var(--color-accent)]">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-text)]">
                "{t.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-[var(--color-hairline)] pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent)] text-[12px] font-black text-[var(--color-accent-contrast)]">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-heavy text-[13px] font-bold text-[var(--color-text)]">{t.name}</div>
                  <div className="text-[11px] text-[var(--color-muted)]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
