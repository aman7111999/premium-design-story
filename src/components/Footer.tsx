import { Link } from "react-router-dom";
import { site } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="hairline-t mt-32">
      <div className="container-page grid gap-16 py-20 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-display text-4xl leading-tight md:text-6xl">
            Have a problem worth solving?
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-flex items-center gap-2 text-lg link-underline"
          >
            {site.email}
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Elsewhere
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(site.socials).map(([k, v]) => (
              <li key={k}>
                <a
                  href={v}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline capitalize"
                >
                  {k}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Navigate
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/work" className="link-underline">Work</Link></li>
            <li><Link to="/about" className="link-underline">About</Link></li>
            <li><Link to="/contact" className="link-underline">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="hairline-t">
        <div className="container-page flex flex-col justify-between gap-2 py-6 text-xs text-[var(--color-muted)] md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. Made with intention.</p>
          <p>{site.location} · {site.availability}</p>
        </div>
      </div>
    </footer>
  );
}
