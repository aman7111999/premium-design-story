import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useSite, useContent } from "@/lib/cms";
import { ThemeToggle } from "@/components/design/ThemeToggle";

type NavData = {
  links: { label: string; to: string }[];
  cta_label: string;
  cta_to: string;
  role_line: string;
};

const NAV_FALLBACK: NavData = {
  links: [
    { to: "/about", label: "About" },
    { to: "/work", label: "Projects" },
    { to: "/blog", label: "Blog" },
  ],
  cta_label: "Let's Talk",
  cta_to: "/contact",
  role_line: "Product Designer",
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: site } = useSite();
  const { data: nav } = useContent<NavData>("nav", NAV_FALLBACK);

  useEffect(() => setOpen(false), [location.pathname]);

  const name = site?.name ?? "Aman Mishra";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const links = nav?.links ?? NAV_FALLBACK.links;

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 md:top-6"
    >
      <div className="px-5 md:px-0">
        <div className="container-page md:!px-10">
        <nav
          aria-label="Primary"
          className="nav-pill mx-auto flex h-[72px] w-full items-center justify-between gap-2 py-2 pl-2 pr-2 md:w-fit md:justify-start"
        >
          <NavLink to="/" className="flex items-center gap-3 rounded-full pl-1 pr-4 py-1">
            <span className="grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[var(--color-accent)] text-[12px] font-bold text-[var(--color-accent-contrast)]">
              {site?.profile_image_url ? (
                <img src={site.profile_image_url} alt="" className="h-full w-full object-cover" />
              ) : initials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[16px] font-medium text-[var(--color-text)]">{name}</span>
              <span className="block text-[11px] text-[var(--color-muted)]">{nav?.role_line ?? NAV_FALLBACK.role_line}</span>
            </span>
          </NavLink>

          <ul className="hidden items-center gap-[28px] px-2 md:flex lg:gap-[36px]">
            {links.map((l) => (
              <li key={l.label + l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    "rounded-full py-1.5 text-[15px] font-medium transition-colors " +
                    (isActive
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]")
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavLink to={nav?.cta_to ?? NAV_FALLBACK.cta_to} className="btn-primary !py-1.5 !pr-5 !text-[14px]" style={{ minHeight: 44 }}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent-contrast)] text-[var(--color-accent)]">
                <ArrowRight size={15} />
              </span>
              <span>{nav?.cta_label ?? NAV_FALLBACK.cta_label}</span>
            </NavLink>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-hairline-strong)] text-[var(--color-text)] md:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
            className="container-page md:hidden"
          >
            <div
              className="mx-auto mt-3 w-full max-w-sm rounded-3xl border border-[var(--color-hairline-strong)] p-3"
              style={{ background: "var(--color-surface)" }}
            >
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.label + l.to}>
                    <NavLink
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        "block rounded-2xl px-5 py-3.5 text-[16px] font-medium transition-colors " +
                        (isActive
                          ? "bg-[color-mix(in_oklab,var(--color-accent)_14%,transparent)] text-[var(--color-text)]"
                          : "text-[var(--color-text)] hover:bg-[var(--color-hairline)]")
                      }
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                <li className="mt-1 border-t border-[var(--color-hairline)] pt-2">
                  <NavLink
                    to={nav?.cta_to ?? NAV_FALLBACK.cta_to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-5 py-3.5 text-[16px] font-medium text-[var(--color-accent)]"
                  >
                    {nav?.cta_label ?? NAV_FALLBACK.cta_label}
                  </NavLink>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
