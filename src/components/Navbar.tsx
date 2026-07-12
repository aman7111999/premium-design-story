import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Mail, ArrowUpRight } from "lucide-react";
import { useSite } from "@/lib/cms";
import { ThemeToggle } from "@/components/design/ThemeToggle";


type Link = { to: string; label: string; external?: boolean };

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  const links: Link[] = [
    { to: "/about", label: "About" },
    { to: "/work", label: "Work" },
    { to: "/blog", label: "Blog" },
    ...(site?.resume_url
      ? [{ to: site.resume_url, label: "Resume", external: true } as Link]
      : []),
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const fullName = site?.name ?? "Aman Mishra";

  return (
    <motion.header
      initial={reduce ? false : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-page pt-4 md:pt-6">
        <nav
          aria-label="Primary"
          className={
            "liquid-glass flex items-center justify-between gap-6 rounded-full pl-5 pr-2 py-2 transition-shadow duration-500 " +
            (scrolled ? "shadow-[var(--elevation-3)]" : "")
          }
        >
          {/* Wordmark */}
          <NavLink
            to="/"
            aria-label={fullName}
            className="font-display italic text-[22px] md:text-[24px] leading-none tracking-[-0.01em] text-[var(--color-text)]"
          >
            {fullName}
          </NavLink>



          {/* Center links */}
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) =>
              l.external ? (
                <li key={l.to}>
                  <a
                    href={l.to}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 font-heavy text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-70 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"
                    />
                  </a>
                </li>
              ) : (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      "relative inline-block font-heavy text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors " +
                      (isActive
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)]")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {l.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-dot"
                            className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-accent)]"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ),
            )}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavLink

              to="/contact"
              className="hidden items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2 font-heavy text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-contrast)] shadow-[var(--elevation-accent)] transition-transform hover:scale-[1.04] md:inline-flex"
            >
              Email me
              <Mail size={13} />
            </NavLink>
            <NavLink
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1.5 font-heavy text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent-contrast)] md:hidden"
            >
              Email <Mail size={11} />
            </NavLink>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-hairline-strong)] text-[var(--color-text)] md:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="container-page md:hidden"
          >
            <div className="liquid-glass mt-2 rounded-[var(--radius-lg)] p-3">
              <ul className="flex flex-col">
                {links.map((l) => (
                  <li key={l.to}>
                    {l.external ? (
                      <a
                        href={l.to}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-md px-3 py-3 font-heavy text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]"
                      >
                        {l.label}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </a>
                    ) : (
                      <NavLink
                        to={l.to}
                        className={({ isActive }) =>
                          "block rounded-md px-3 py-3 font-heavy text-sm font-bold uppercase tracking-[0.12em] " +
                          (isActive
                            ? "bg-[var(--color-surface)] text-[var(--color-text)]"
                            : "text-[var(--color-muted)]")
                        }
                      >
                        {l.label}
                      </NavLink>
                    )}
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
