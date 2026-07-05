import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSite } from "@/lib/cms";

const links = [
  { to: "/", label: "Index" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <motion.header
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`transition-all duration-500 ${scrolled ? "backdrop-blur-md border-b border-hairline" : "bg-transparent border-b border-transparent"}`}
        style={{ backgroundColor: scrolled ? "rgba(250,250,247,0.85)" : "transparent" }}
      >
        <nav className="container-page flex h-16 items-center justify-between" aria-label="Primary">
          <NavLink to="/" className="group flex items-center gap-2 font-display text-lg">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span>{site?.name ?? "Portfolio"}</span>
          </NavLink>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to} end={l.to === "/"}
                  className={({ isActive }) => `text-sm tracking-wide transition-opacity ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                >
                  {({ isActive }) => (
                    <span className="relative">
                      {l.label}
                      {isActive && <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--color-ink)]" />}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-b border-hairline" style={{ backgroundColor: "var(--color-paper)" }}
          >
            <ul className="container-page flex flex-col gap-4 py-6">
              {links.map((l) => (
                <li key={l.to}><NavLink to={l.to} end={l.to === "/"} className="font-display text-3xl">{l.label}</NavLink></li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
