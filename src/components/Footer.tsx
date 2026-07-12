import { useSite } from "@/lib/cms";
import { ArrowUpRight, ArrowUp } from "lucide-react";

export function Footer() {
  const { data: site } = useSite();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-16 border-t border-[var(--color-hairline)]">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="font-display italic text-[28px] leading-none text-[var(--color-text)]">
              {site?.name ?? "Aman Mishra"}
            </div>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[var(--color-muted)]">
              Product designer crafting next-horizon experiences. Available for
              select projects in {new Date().getFullYear() + 1}.
            </p>
            {site?.email && (
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-flex items-center gap-2 font-heavy text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)] transition-transform hover:translate-x-1"
              >
                {site.email} <ArrowUpRight size={13} />
              </a>
            )}
          </div>

          {/* Sitemap */}
          <div className="md:col-span-3">
            <p className="eyebrow">Sitemap</p>
            <ul className="mt-4 space-y-2 text-[14px] text-[var(--color-muted)]">
              {["/", "/about", "/work", "/blog", "/contact"].map((href) => (
                <li key={href}>
                  <a href={href} className="hover:text-[var(--color-accent)] transition-colors">
                    {href === "/" ? "Home" : href.slice(1).replace(/^./, (c) => c.toUpperCase())}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-4">
            <p className="eyebrow">Elsewhere</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(site?.socials ?? []).slice(0, 6).map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline-strong)] px-4 py-2 font-heavy text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {s.label}
                  <ArrowUpRight size={11} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-hairline)]">
        <div className="container-page flex flex-col-reverse items-center justify-between gap-3 py-6 text-[11px] uppercase tracking-[0.16em] text-[var(--color-subtle)] md:flex-row">
          <p>© {new Date().getFullYear()} {site?.name ?? "Aman Mishra"} — Crafted with care.</p>
          <button
            type="button"
            onClick={scrollTop}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1 transition-colors hover:text-[var(--color-accent)]"
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
