import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Section = { id: string; label: string; chapter: string };

/**
 * Sticky vertical TOC with active-section highlighting via IntersectionObserver.
 * Hidden on mobile — content flows linearly there.
 */
export function CaseToc({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the top-most section currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Case study contents"
      className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-[var(--space-3)]">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-center gap-[var(--space-3)]"
              >
                <motion.span
                  aria-hidden
                  animate={{
                    width: isActive ? 28 : 14,
                    backgroundColor: isActive
                      ? "var(--color-accent)"
                      : "var(--color-hairline-strong)",
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="block h-px"
                />
                <span
                  className={
                    "font-mono text-[10px] uppercase tracking-[var(--tracking-widest)] transition-colors duration-[var(--dur-base)] " +
                    (isActive
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-subtle)] group-hover:text-[var(--color-muted)]")
                  }
                >
                  {s.chapter} — {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
