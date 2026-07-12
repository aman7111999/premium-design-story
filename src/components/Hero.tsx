import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSite } from "@/lib/cms";

/* -------------------------------------------------------------------------- */
/*  Editorial magazine hero — Warm Sand, Instrument Serif                     */
/* -------------------------------------------------------------------------- */

const HEADLINE_LEAD = "Designing digital financial experiences";
const HEADLINE_ITALIC = "with quiet clarity";
const HEADLINE_TAIL = "& lasting confidence.";

const STATS = [
  { value: "4.5+", label: "Years shipping" },
  { value: "12", label: "Products launched" },
  { value: "03", label: "Design systems" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-28 md:pt-36"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <motion.div
        style={{ y, opacity }}
        className="container-page relative"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {/* -------- Left vertical rail — single quiet label -------- */}
          <aside
            aria-hidden
            className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-center lg:pt-6"
          >
            <span
              className="rotate-180 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-subtle)]"
              style={{ writingMode: "vertical-lr" }}
            >
              Portfolio · 2026
            </span>
          </aside>

          {/* -------- Main editorial column -------- */}
          <div className="col-span-12 lg:col-span-11">
            {/* Status line — one signal only */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="inline-flex items-center gap-3 rounded-full liquid-glass px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]"
            >
              <span className="relative inline-flex h-1.5 w-1.5">
                <span
                  className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-70"
                  style={{ animation: "ring-pulse 2s cubic-bezier(0.22,1,0.36,1) infinite" }}
                />
                <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span>Available for senior roles · 2026</span>
            </motion.div>

            {/* Editorial headline */}
            <h1
              className="mt-10 max-w-[16ch] leading-[0.92] tracking-[-0.015em] text-[var(--color-text)] md:mt-14"
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(2.75rem, 8.6vw, 7rem)",
                fontWeight: 400,
              }}
            >
              <RevealLine delay={0.15} reduce={reduce}>
                {HEADLINE_LEAD}
              </RevealLine>{" "}
              <RevealLine delay={0.32} reduce={reduce}>
                <span className="italic text-[var(--color-subtle)]">
                  {HEADLINE_ITALIC}
                </span>
              </RevealLine>{" "}
              <RevealLine delay={0.5} reduce={reduce}>
                {HEADLINE_TAIL}
              </RevealLine>
            </h1>

            {/* Paragraph — single readable line-length */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
              className="mt-12 max-w-[58ch] text-[17px] leading-[1.65] text-[var(--color-muted)] md:mt-16"
            >
              <span className="text-[var(--color-text)]">Senior Product Designer</span>{" "}
              with <span className="text-[var(--color-text)]">4.5+ years</span> simplifying
              complex financial environments through rigorous design systems and
              human-centred product thinking.
            </motion.p>

            {/* CTAs — quiet editorial */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <Link
                to="/work"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-text)] px-6 py-3 text-[13px] uppercase tracking-[0.18em] text-[var(--color-inverse)] shadow-[var(--elevation-2)] transition-all duration-300 hover:shadow-[var(--elevation-3)] hover:bg-[var(--color-accent)]"
              >
                View Case Studies
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              {site?.resume_url && (
                <a
                  href={site.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-text)]"
                >
                  <Download size={14} />
                  <span className="border-b border-[var(--color-hairline-strong)] pb-1 transition-colors group-hover:border-[var(--color-text)]">
                    Resume
                  </span>
                </a>
              )}

              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-text)]"
              >
                <Mail size={14} />
                <span className="border-b border-[var(--color-hairline-strong)] pb-1 transition-colors group-hover:border-[var(--color-text)]">
                  Let's connect
                </span>
              </Link>
            </motion.div>

            {/* Stats — liquid glass panel */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
              className="mt-20 liquid-glass rounded-[var(--radius-xl)] p-6 md:p-8 max-w-2xl"
            >
              <dl className="grid grid-cols-3 gap-6">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <dd
                      className="font-display italic leading-none text-[var(--color-text)]"
                      style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                    >
                      {s.value}
                    </dd>
                    <dt className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-subtle)]">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function RevealLine({
  children,
  delay = 0,
  reduce,
}: {
  children: React.ReactNode;
  delay?: number;
  reduce: boolean | null;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-baseline">
      <motion.span
        initial={reduce ? false : { y: "108%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 1, delay, ease: EASE }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

