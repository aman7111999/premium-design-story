import { useSite, useContent } from "@/lib/cms";
import { ArrowUp } from "lucide-react";

type FooterData = { copyright_suffix: string; back_to_top_label: string };
const FALLBACK: FooterData = { copyright_suffix: "All Right Reserved", back_to_top_label: "Top" };

export function Footer() {
  const { data: site } = useSite();
  const { data: f } = useContent<FooterData>("footer", FALLBACK);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-16 border-t border-[var(--color-hairline)]">
      <div className="container-page flex flex-col items-center justify-between gap-5 py-10 text-[14px] text-[var(--color-muted)] md:flex-row">
        <p>
          Copyright © {new Date().getFullYear()} {site?.name ?? "Aman Mishra"} — {f?.copyright_suffix ?? FALLBACK.copyright_suffix}
        </p>
        <div className="flex items-center gap-8">
          {(site?.socials ?? []).slice(0, 4).map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="text-[14px] hover:text-[var(--color-accent)]">
              {s.label}
            </a>
          ))}
          <button
            type="button"
            onClick={scrollTop}
            className="group inline-flex items-center gap-1.5 text-[14px] hover:text-[var(--color-accent)]"
            aria-label="Back to top"
          >
            {f?.back_to_top_label ?? FALLBACK.back_to_top_label} <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
