import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useSite } from "@/lib/cms";
import { ThemeToggle } from "@/components/design/ThemeToggle";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/work", label: "Projects" },
  { to: "/blog", label: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: site } = useSite();

  useEffect(() => setOpen(false), [location.pathname]);

  const name = site?.name ?? "Aman Mishra";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 md:top-6"
    >
      <div className="container-page">
        <nav
          aria-label="Primary"
          className="nav-pill mx-auto flex h-[72px] w-fit items-center gap-2 py-2 pl-2 pr-2"
        >
          {/* Avatar + name */}
          <NavLink to="/" className="flex items-center gap-3 rounded-full pl-1 pr-4 py-1">
            <span className="grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[var(--color-accent)] text-[12px] font-bold text-[var(--color-accent-contrast)]">
              {site?.profile_image_url ? (
                <img src={site.profile_image_url} alt="" className="h-full w-full object-cover" />
              ) : initials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[16px] font-medium text-[var(--color-text)]">{name}</span>
              <span className="block text-[11px] text-[var(--color-muted)]">Product Designer</span>
            </span>
          </NavLink>

          <span className="mx-2 hidden h-9 w-px bg-[var(--color-hairline-strong)] md:block" />

          {/* Center links */}
          <ul className="hidden items-center gap-[28px] px-2 md:flex lg:gap-[36px]">
            {LINKS.map((l) => (
              <li key={l.label}>
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

          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
            <NavLink to="/contact" className="btn-primary !py-1.5 !pr-6 !text-[14px]" style={{ minHeight: 44 }}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent-contrast)] text-[var(--color-accent)]">
                <ArrowRight size={15} />
              </span>
              <span className="hidden sm:inline">Start A Project</span>
              <span className="sm:hidden">Start</span>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
            className="container-page md:hidden"
          >
            <div className="nav-pill mx-auto mt-2 w-fit rounded-2xl p-2">
              <ul className="flex flex-col">
                {LINKS.map((l) => (
                  <li key={l.label}>
                    <NavLink
                      to={l.to}
                      className="block rounded-lg px-4 py-2.5 text-[14px] font-medium text-[var(--color-text)]"
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
