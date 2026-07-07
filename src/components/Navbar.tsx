import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useSite } from "@/lib/cms";
import { ThemeToggle } from "@/components/design/ThemeToggle";
import { Button } from "@/components/design/Button";

type Link = { to: string; label: string; external?: boolean };

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  const { scrollY } = useScroll();
  const shellPad = useTransform(scrollY, [0, 120], [10, 4]);

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

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
      style={{ paddingTop: shellPad }}
    >
      <div className="container-page">
        <nav
          aria-label="Primary"
          className={
            "mx-auto flex items-center justify-between gap-2 rounded-[var(--radius-pill)] border transition-[max-width,padding,box-shadow,background-color,border-color] duration-500 ease-[var(--ease-out-quart)] " +
            (scrolled
              ? "glass max-w-[860px] border-[var(--color-hairline-strong)] px-2 py-1.5 pl-4 shadow-[0_10px_50px_-24px_rgba(0,0,0,0.55)]"
              : "max-w-[1140px] border-transparent bg-transparent px-3 py-2.5 pl-5")
          }
        >
          {/* Wordmark */}
          <NavLink
            to="/"
            aria-label={`${site?.name ?? "Aman Mishra"} — Home`}
            className="group flex items-center gap-2.5"
          >
            <span
              aria-hidden
              className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-[9px] border border-[var(--color-hairline-strong)] font-display text-[11px] font-medium tracking-[-0.06em] text-[var(--color-text)]"
              style={{
                background:
                  "linear-gradient(140deg, var(--color-elevated) 0%, var(--color-surface) 100%)",
              }}
            >
              <span
                className="pointer-events-none absolute -inset-px opacity-70"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 0%, var(--color-accent-glow) 0%, transparent 60%)",
                }}
              />
              <span className="relative">AM</span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-[14.5px] tracking-[-0.01em] text-[var(--color-text)]">
                {site?.name ?? "Aman Mishra"}
              </span>
              <span className="mono hidden text-[10px] uppercase tracking-[0.18em] text-[var(--color-subtle)] lg:inline">
                / Product Designer
              </span>
            </span>
          </NavLink>

          {/* Center links */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {links.map((l) =>
              l.external ? (
                <li key={l.to}>
                  <a
                    href={l.to}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={11}
                      className="opacity-60 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"
                    />
                  </a>
                </li>
              ) : (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      "relative rounded-full px-3 py-1.5 text-[13px] transition-colors " +
                      (isActive
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)]")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-[var(--color-elevated)]"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        {l.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ),
            )}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:inline-flex" />
            <Button to="/contact" variant="accent" size="sm" className="hidden md:inline-flex">
              Let's Talk
            </Button>
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
            <div className="mt-2 rounded-[var(--radius-xl)] glass p-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)]">
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
                        className="flex items-center justify-between rounded-lg px-3 py-3 font-display text-lg text-[var(--color-muted)]"
                      >
                        {l.label}
                        <ArrowUpRight size={14} className="opacity-60" />
                      </a>
                    ) : (
                      <NavLink
                        to={l.to}
                        end={l.to === "/"}
                        className={({ isActive }) =>
                          "block rounded-lg px-3 py-3 font-display text-lg " +
                          (isActive
                            ? "bg-[var(--color-elevated)] text-[var(--color-text)]"
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
                <Button to="/contact" variant="accent" size="sm">Let's Talk</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
