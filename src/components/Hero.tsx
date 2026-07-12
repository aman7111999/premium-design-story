import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useSite } from "@/lib/cms";
import { Link } from "react-router-dom";

/**
 * "Meet the Expert" hero — dark, emerald, portrait on right, orbit ring.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  const name = site?.name ?? "Aman Mishra";
  const avatar = site?.profile_image_url;
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Grid + emerald glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-accent-glow), transparent 70%)",
          filter: "blur(20px)",
          opacity: 0.5,
        }}
      />

      <div className="container-page relative">
        {/* Top intro pill (like reference top bar) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass mx-auto flex w-fit items-center gap-3 rounded-full py-1.5 pl-1.5 pr-2"
        >
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[var(--color-accent)] text-[12px] font-black text-[var(--color-accent-contrast)]">
            {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : initials}
          </span>
          <span className="font-heavy text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-text)]">
            Hi, I'm {name.split(" ")[0]}
          </span>
          <span className="mx-1 h-4 w-px bg-[var(--color-hairline-strong)]" />
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            Available
          </span>
          {site?.email && (
            <a
              href={`mailto:${site.email}`}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-1.5 font-heavy text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-contrast)] transition-transform hover:scale-105"
            >
              Let's Talk <ArrowUpRight size={11} />
            </a>
          )}
        </motion.div>

        {/* Two-column: headline + portrait */}
        <div className="mt-14 grid items-center gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
          {/* Left: text */}
          <div className="md:col-span-7">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="eyebrow flex items-center gap-2"
            >
              <Sparkles size={12} className="text-[var(--color-accent)]" />
              Meet the Expert
            </motion.p>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-heavy uppercase leading-[0.94] tracking-[-0.025em] text-[var(--color-text)]"
              style={{ fontSize: "clamp(2.4rem, 6.4vw, 5rem)", fontWeight: 900 }}
            >
              Product
              <br />
              Designer{" "}
              <span
                className="italic text-[var(--color-accent)]"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                obsessed
              </span>{" "}
              with the{" "}
              <span
                className="italic text-[var(--color-accent)]"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  textTransform: "none",
                }}
              >
                why
              </span>
              .
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--color-muted)]"
            >
              I craft next-horizon digital experiences — from 0→1 product design
              to Framer sites — obsessed with pixel-craft, motion, and the story
              behind every screen.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              {site?.email && (
                <a
                  href={`mailto:${site.email}`}
                  className="animate-emerald-pulse inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-heavy text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-contrast)] transition-transform hover:scale-[1.04]"
                >
                  Let's Talk <ArrowUpRight size={14} />
                </a>
              )}
              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] px-6 py-3 font-heavy text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                See the Work
              </Link>
            </motion.div>
          </div>

          {/* Right: portrait with orbit */}
          <div className="md:col-span-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-square w-[280px] md:w-[380px]"
            >
              {/* Dotted orbit */}
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 400 400" className="h-full w-full">
                  <circle
                    cx="200" cy="200" r="190"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1"
                    strokeDasharray="2 8"
                    opacity="0.5"
                  />
                </svg>
                {/* Orbit dot */}
                <span
                  className="absolute h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] glow-emerald"
                  style={{ top: "0%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
              </div>

              {/* Inner glow ring */}
              <div
                className="absolute inset-6 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, var(--color-accent-glow), transparent 70%)",
                  filter: "blur(24px)",
                }}
              />

              {/* Portrait */}
              <div className="animate-float absolute inset-8 overflow-hidden rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-card)]">
                {avatar ? (
                  <img src={avatar} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[var(--color-accent)] text-6xl font-black text-[var(--color-accent-contrast)]">
                    {initials}
                  </div>
                )}
              </div>

              {/* Floating tool badges */}
              <motion.div
                animate={reduce ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="liquid-glass absolute -left-4 top-16 rounded-full px-3 py-1.5 text-[10px] font-heavy font-bold uppercase tracking-[0.12em] text-[var(--color-text)]"
              >
                Figma
              </motion.div>
              <motion.div
                animate={reduce ? {} : { y: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="liquid-glass absolute -right-4 bottom-20 rounded-full px-3 py-1.5 text-[10px] font-heavy font-bold uppercase tracking-[0.12em] text-[var(--color-text)]"
              >
                Framer
              </motion.div>
              <motion.div
                animate={reduce ? {} : { y: [0, -4, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="liquid-glass absolute -right-2 top-8 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-heavy font-bold uppercase tracking-[0.12em] text-[var(--color-text)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                0→1
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
