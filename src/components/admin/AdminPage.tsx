import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { clsx } from "clsx";

export type Crumb = { label: string; to?: string };

/**
 * Consistent page shell for every admin screen.
 * Provides eyebrow, title, description, breadcrumb + right-aligned actions.
 */
export function AdminPage({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
  children,
  wide = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={clsx("mx-auto", wide ? "max-w-[1400px]" : "max-w-6xl")}>
      {crumbs && crumbs.length > 0 && (
        <nav className="mb-4 flex items-center gap-1 text-xs text-neutral-500">
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              {c.to ? (
                <Link to={c.to} className="hover:text-neutral-900">
                  {c.label}
                </Link>
              ) : (
                <span className="text-neutral-700">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <ChevronRight size={12} />}
            </span>
          ))}
        </nav>
      )}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-widest text-neutral-500">{eyebrow}</p>
          )}
          <h1 className="mt-1 font-display text-4xl leading-tight text-neutral-900">{title}</h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm text-neutral-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}
