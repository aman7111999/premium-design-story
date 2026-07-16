import { Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const TESTIMONIALS = [
  { name: "Priya Shah", role: "Founder, Northloop", quote: "Aman turned a rough vision into a product that feels inevitable. Rare taste, faster than a small team." },
  { name: "Marcus Lee", role: "PM, Fintrace", quote: "Ship-ready designs, honest feedback, motion that makes the product feel alive." },
  { name: "Elena Ruiz", role: "CEO, Havenly.io", quote: "Went from static wires to a living Framer site in two weeks. The polish is on another level." },
  { name: "Devon Park", role: "Design Lead, Orbital", quote: "A rare balance of systems thinking and craft. He fixes the why, not just the pixels." },
  { name: "Sara Wen", role: "Founder, Vellum", quote: "Our sign-ups doubled in the first month after his redesign. Enough said." },
  { name: "Kenji Ito", role: "CTO, Foldpad", quote: "Delivered on time, in scope, and beyond expectation. Working with Aman is a cheat code." },
];

export function TestimonialsGrid() {
  return (
    <section className="container-page py-24 md:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Kind Words</p>
        <h2
          className="mt-3 font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--color-text)]"
          style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)" }}
        >
          <span className="text-[var(--color-accent)]">Loved</span> by designers &amp;
          <br /> teams around the world.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="liquid-glass p-8">
            <div className="flex gap-0.5 text-[var(--color-accent)]">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-5 text-[16px] leading-[1.65] text-[var(--color-text)]">"{t.quote}"</p>
            <div className="mt-7 flex items-center gap-3.5 border-t border-[var(--color-hairline)] pt-5">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-accent)] text-[13px] font-bold text-[var(--color-accent-contrast)]">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--color-text)]">{t.name}</div>
                <div className="text-[12px] text-[var(--color-muted)]">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
