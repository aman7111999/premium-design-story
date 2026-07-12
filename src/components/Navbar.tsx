import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
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
    { to: "/", label: "Home" },
    { to: "/work", label: "Work" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    ...(site?.resume_url
      ? [{ to: site.resume_url, label: "Resume", external: true } as Link]
      : []),
    { to: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ease-[var(--ease-out-quart)] " +
        (scrolled
          ? "border-b border-hairline bg-[var(--color-bg)]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="container-page">
        <nav
          aria-label="Primary"
          className="flex items-baseline justify-between gap-6 py-5 md:py-6"
        >
          {/* Wordmark */}
          <NavLink
            to="/"
            aria-label={`${site?.name ?? "Aman Mishra"} — Home`}
            className="group flex items-baseline gap-3"
          >
            <span className="font-display text-xl tracking-[-0.01em] text-[var(--color-text)]">
              {site?.name ?? "Aman Mishra"}
            </span>
            <span className="mono hidden text-[10px] uppercase tracking-[0.22em] text-[var(--color-subtle)] lg:inline">
              / Product Designer
            </span>
          </NavLink>

          {/* Center links */}
          <ul className="hidden items-baseline gap-8 md:flex">
            {links.map((l) =>
              l.external ? (
                <li key={l.to}>
                  <a
                    href={l.to}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-text)]"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={11}
                      className="opacity-70 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"
                    />
                  </a>
                </li>
              ) : (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      "relative inline-block pb-1 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors " +
                      (isActive
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-subtle)] hover:text-[var(--color-text)]")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {l.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute inset-x-0 -bottom-0.5 h-px bg-[var(--color-accent)]"
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
          <div className="flex items-center gap-4">
            <ThemeToggle className="hidden md:inline-flex" />
            <NavLink
              to="/contact"
              className="hidden items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text)] transition-all hover:border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-inverse)] md:inline-flex"
            >
              Let's Talk
            </NavLink>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-[var(--color-text)] md:hidden"
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
            <div className="mt-2 rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)] p-3 shadow-[var(--elevation-2)]">
              <ul className="flex flex-col">
                {links.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.04 }}
                  >
                    {l.external ? (
                      <a
                        href={l.to}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-md px-3 py-3 font-display text-lg text-[var(--color-muted)]"
                      >
                        {l.label}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </a>
                    ) : (
                      <NavLink
                        to={l.to}
                        end={l.to === "/"}
                        className={({ isActive }) =>
                          "block rounded-md px-3 py-3 font-display text-lg " +
                          (isActive
                            ? "bg-[var(--color-surface)] text-[var(--color-text)]"
                            : "text-[var(--color-muted)]")
                        }
                      >
                        {l.label}
                      </NavLink>
                    )}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between border-t border-hairline p-2 pt-3">
                <ThemeToggle />
                <NavLink
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em]"
                >
                  Let's Talk
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
