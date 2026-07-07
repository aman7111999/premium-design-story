import { Link } from "react-router-dom";
import { useSite } from "@/lib/cms";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const { data: site } = useSite();
  return (
    <footer className="hairline-t mt-24 border-t border-hairline">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="eyebrow">Elsewhere</p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--color-muted)]">
            Follow the work, or reach out directly. I reply within a day.
          </p>
          {site?.email && (
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-flex items-center gap-2 text-lg text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {site.email} <ArrowUpRight size={16} />
            </a>
          )}
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm">
            {(site?.socials ?? []).map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/work", label: "Work" },
              { to: "/about", label: "About" },
              
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="container-page flex flex-col justify-between gap-2 py-6 text-xs text-[var(--color-muted)] md:flex-row">
          <p>
            © {new Date().getFullYear()} {site?.name ?? "Aman Mishra"}. Made with intention.
          </p>
          {site?.location && <p>{site.location}</p>}
        </div>
      </div>
    </footer>
  );
}
