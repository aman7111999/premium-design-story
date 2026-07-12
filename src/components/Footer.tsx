import { useSite } from "@/lib/cms";
import { ArrowUpRight, ArrowUp } from "lucide-react";

export function Footer() {
  const { data: site } = useSite();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-16 border-t border-[var(--color-hairline)]">
      <div className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-display italic leading-[1.02] text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Like what you see?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--color-muted)]">
            Feel free to reach out to me at{" "}
            {site?.email ? (
              <a
                href={`mailto:${site.email}`}
                className="text-[var(--color-accent)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4"
              >
                {site.email}
              </a>
            ) : (
              "hello"
            )}{" "}
            to discuss an opportunity, work, or life in general :)
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {(site?.socials ?? []).slice(0, 4).map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline-strong)] px-4 py-2 font-heavy text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {s.label}
                <ArrowUpRight size={11} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-hairline)]">
        <div className="container-page flex flex-col-reverse items-center justify-between gap-3 py-6 text-[11px] uppercase tracking-[0.16em] text-[var(--color-subtle)] md:flex-row">
          <p>
            © {new Date().getFullYear()} {site?.name ?? "Aman Mishra"} — Designed with love &amp; a lot of coffee.
          </p>
          <button
            type="button"
            onClick={scrollTop}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1 transition-colors hover:text-[var(--color-text)]"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
