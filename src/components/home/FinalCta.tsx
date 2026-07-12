import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useSite } from "@/lib/cms";

export function FinalCta() {
  const { data: site } = useSite();

  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <div className="card-dark relative overflow-hidden p-10 md:p-20 text-center">
          {/* Emerald glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, var(--color-accent-glow), transparent 70%)",
              filter: "blur(30px)",
              opacity: 0.7,
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

          <div className="relative">
            <p className="eyebrow">Let's Collaborate</p>
            <h2
              className="mt-4 font-heavy uppercase leading-[0.94] tracking-[-0.025em] text-[var(--color-text)]"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.25rem)", fontWeight: 900 }}
            >
              Let's Build{" "}
              <span
                className="italic text-[var(--color-accent)]"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  textTransform: "none",
                }}
              >
                Something Amazing
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--color-muted)]">
              Got a product, brand, or idea in motion? Let's turn it into
              something worth remembering.
            </p>

            {site?.email && (
              <a
                href={`mailto:${site.email}`}
                className="animate-emerald-pulse mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3.5 font-heavy text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-contrast)] transition-transform hover:scale-[1.04]"
              >
                Start a Project <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
