import { Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useTestimonials, useContent } from "@/lib/cms";

type Data = {
  eyebrow: string;
  heading_accent: string;
  heading_line1: string;
  heading_line2: string;
};

const FALLBACK: Data = {
  eyebrow: "Kind Words",
  heading_accent: "Loved",
  heading_line1: "by designers & teams",
  heading_line2: "around the world.",
};

export function TestimonialsGrid() {
  const { data: rows } = useTestimonials();
  const { data: c } = useContent<Data>("home_testimonials", FALLBACK);
  const d = c ?? FALLBACK;
  const items = (rows ?? []) as any[];

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{d.eyebrow}</p>
        <h2
          className="mt-3 font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--color-text)]"
          style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)" }}
        >
          <span className="text-[var(--color-accent)]">{d.heading_accent}</span> {d.heading_line1}
          <br /> {d.heading_line2}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => {
          const displayName = t.author ?? "";
          const initials = displayName.split(" ").map((n: string) => n[0]).join("");
          const secondary = [t.role, t.company].filter(Boolean).join(", ");
          return (
            <div key={t.id} className="liquid-glass p-6 sm:p-8">
              <div className="flex gap-0.5 text-[var(--color-accent)]">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-5 text-[16px] leading-[1.65] text-[var(--color-text)]">"{t.quote}"</p>
              <div className="mt-7 flex items-center gap-3.5 border-t border-[var(--color-hairline)] pt-5">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={displayName} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-accent)] text-[13px] font-bold text-[var(--color-accent-contrast)]">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="text-[14px] font-semibold text-[var(--color-text)]">{displayName}</div>
                  <div className="text-[12px] text-[var(--color-muted)]">{secondary}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
