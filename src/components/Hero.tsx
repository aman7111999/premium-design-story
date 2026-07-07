import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
  useScroll,
} from "framer-motion";
import { ArrowUpRight, ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/design/Button";
import { useSite } from "@/lib/cms";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const HEADLINE_LINES = [
  { plain: "Designing digital", accent: null as string | null },
  { plain: "financial experiences", accent: null },
  { plain: "that transform", accent: null },
  { plain: "complexity into ", accent: "confidence." },
];

const CHIPS = [
  "4.5+ Years",
  "Fintech",
  "AI",
  "Design Systems",
  "0→1 Products",
  "Product Strategy",
  "Accessibility",
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  /* --- Cursor spotlight ---------------------------------------------------- */
  const mx = useMotionValue(60);
  const my = useMotionValue(30);
  const smx = useSpring(mx, { stiffness: 40, damping: 26, mass: 1 });
  const smy = useSpring(my, { stiffness: 40, damping: 26, mass: 1 });

  const spotlight = useTransform<number, string>(
    [smx, smy] as never,
    ([x, y]: number[]) =>
      `radial-gradient(720px circle at ${x}% ${y}%, var(--color-accent-glow) 0%, transparent 55%)`,
  );

  /* --- Slow ambient mesh drift --------------------------------------------- */
  const drift = useMotionValue(0);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      drift.set(((t - start) / 1000) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drift, reduce]);

  const mesh = useTransform(drift, (d) => {
    const a = 18 + Math.sin(d * 0.02) * 10;
    const b = 82 + Math.cos(d * 0.017) * 8;
    const c = 88 + Math.sin(d * 0.023) * 7;
    return (
      `radial-gradient(1200px circle at ${a}% -8%, var(--color-accent-wash) 0%, transparent 45%),` +
      `radial-gradient(900px circle at ${b}% 108%, var(--color-accent-wash) 0%, transparent 45%),` +
      `radial-gradient(700px circle at ${c}% 32%, var(--color-accent-wash) 0%, transparent 55%)`
    );
  });

  /* --- Parallax on scroll -------------------------------------------------- */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  /* --- Pointer handler ----------------------------------------------------- */
  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  /* --- Render -------------------------------------------------------------- */
  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden pt-24 md:pt-28"
    >
      {/* ============ Ambient background ============ */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div className="absolute inset-0" style={{ background: mesh }} />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />

        {/* Very subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hairline) 1px, transparent 1px)," +
              "linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse 95% 75% at 50% 45%, black 30%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 75% at 50% 45%, black 30%, transparent 90%)",
          }}
        />

        {/* Animated grain */}
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "160px 160px",
            animation: reduce ? undefined : "grain-shift 8s steps(6) infinite",
          }}
        />
        <style>{`
          @keyframes grain-shift {
            0%   { transform: translate(0,0); }
            20%  { transform: translate(-4%,3%); }
            40%  { transform: translate(3%,-2%); }
            60%  { transform: translate(-2%,4%); }
            80%  { transform: translate(4%,2%); }
            100% { transform: translate(0,0); }
          }
        `}</style>

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-48"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-bg))",
          }}
        />
      </div>

      {/* ============ Content grid ============ */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container-page relative flex flex-1 flex-col"
      >
        <div className="grid flex-1 grid-cols-12 items-center gap-x-8 gap-y-14 pb-24 pt-12 md:gap-y-20 md:pb-28 md:pt-20">
          {/* ---------- Left: editorial column ---------- */}
          <div className="col-span-12 lg:col-span-7">
            {/* Meta row */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mono flex items-center gap-3 text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]"
            >
              <span aria-hidden className="relative inline-flex h-2 w-2">
                <span
                  className="absolute inset-0 rounded-full border border-[var(--color-accent)] opacity-70"
                  style={{
                    animation: "ring-pulse 1.9s cubic-bezier(0.22,1,0.36,1) infinite",
                  }}
                />
                <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span>Available for senior roles · 2026</span>
              <span className="hidden h-px w-6 bg-[var(--color-hairline-strong)] md:inline-block" />
              <span className="hidden md:inline">{site?.location ?? "Mumbai, India"}</span>
            </motion.div>

            {/* Headline */}
            <h1
              className="display-hero mt-8 max-w-[16ch]"
              style={{ fontSize: "clamp(2.5rem, 7.4vw, 5.75rem)" }}
            >
              {HEADLINE_LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.05em]">
                  <motion.span
                    initial={reduce ? false : { y: "108%", opacity: 0, filter: "blur(14px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.11, ease: EASE }}
                    className="block"
                  >
                    {line.plain}
                    {line.accent && (
                      <span
                        className="italic"
                        style={{
                          background:
                            "linear-gradient(100deg, var(--color-accent) 0%, var(--color-accent-hover) 60%, var(--color-accent) 100%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {line.accent}
                      </span>
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Supporting copy */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
              className="mt-8 max-w-[56ch] text-[17px] leading-relaxed text-[var(--color-muted)] md:text-[19px]"
            >
              <span className="text-[var(--color-text)]">Senior Product Designer</span> with{" "}
              <span className="text-[var(--color-text)]">4.5+ years</span> of experience creating{" "}
              <span className="text-[var(--color-text)]">fintech products</span>,{" "}
              <span className="text-[var(--color-text)]">AI-powered experiences</span> and{" "}
              <span className="text-[var(--color-text)]">scalable design systems</span> used by
              thousands of investors.
            </motion.p>

            {/* Chips */}
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.045, delayChildren: 1.0 } },
              }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {CHIPS.map((c) => (
                <motion.li
                  key={c}
                  variants={{
                    hidden: reduce ? {} : { opacity: 0, y: 8, filter: "blur(4px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.5, ease: EASE },
                    },
                  }}
                  className="mono inline-flex items-center rounded-full border border-hairline bg-[var(--color-elevated)]/60 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] backdrop-blur-sm transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-text)]"
                >
                  {c}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA cluster */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 1.2 } },
              }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              {[
                <Button key="c1" to="/work" variant="accent" size="lg">
                  View Case Studies <ArrowUpRight size={16} />
                </Button>,
                site?.resume_url ? (
                  <Button
                    key="c2"
                    href={site.resume_url}
                    variant="secondary"
                    size="lg"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download size={15} /> Download Resume
                  </Button>
                ) : null,
                <Button key="c3" to="/contact" variant="ghost" size="lg">
                  <Mail size={15} /> Let's Connect
                </Button>,
              ]
                .filter(Boolean)
                .map((btn, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: reduce ? {} : { opacity: 0, y: 10, filter: "blur(6px)" },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.6, ease: EASE },
                      },
                    }}
                  >
                    {btn}
                  </motion.div>
                ))}
            </motion.div>

            {/* Company badges */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
              className="mt-14 grid max-w-xl grid-cols-2 gap-3 sm:gap-4"
            >
              <CompanyBadge label="Currently" name="Motilal Oswal" sub="Financial Services" dotClass="bg-emerald-400" />
              <CompanyBadge label="Previously" name="Trinkerr" sub="AI · Social Investing" dotClass="bg-[var(--color-subtle)]" />
            </motion.div>
          </div>

          {/* ---------- Right: visual stage ---------- */}
          <motion.div
            style={{ y: stageY }}
            initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            className="col-span-12 lg:col-span-5"
          >
            <HeroStage />
          </motion.div>
        </div>

        {/* ============ Scroll indicator ============ */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center"
        >
          <div className="mono flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[var(--color-subtle)]">
            <span className="h-px w-8 bg-[var(--color-hairline-strong)]" />
            Scroll
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { y: [0, 4, 0] }}
              transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-6 w-6 place-items-center rounded-full border border-hairline text-[var(--color-muted)]"
            >
              <ArrowDown size={11} />
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Company badge                                                             */
/* -------------------------------------------------------------------------- */

function CompanyBadge({
  label,
  name,
  sub,
  dotClass,
}: {
  label: string;
  name: string;
  sub: string;
  dotClass: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)]/70 p-4 backdrop-blur-md transition-all duration-500 hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-card)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at 20% 0%, var(--color-accent-wash), transparent 60%)",
        }}
      />
      <div className="relative flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-subtle)]">
          {label}
        </span>
      </div>
      <p className="relative mt-2 font-display text-[17px] leading-tight tracking-tight text-[var(--color-text)]">
        {name}
      </p>
      <p className="relative mt-0.5 text-[12.5px] text-[var(--color-muted)]">{sub}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero stage — layered product visual (dashboard + design-system tokens)     */
/* -------------------------------------------------------------------------- */

function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  const l1x = useTransform(smx, (v) => v * -14);
  const l1y = useTransform(smy, (v) => v * -14);
  const l2x = useTransform(smx, (v) => v * 20);
  const l2y = useTransform(smy, (v) => v * 20);
  const l3x = useTransform(smx, (v) => v * -26);
  const l3y = useTransform(smy, (v) => v * -26);
  const l4x = useTransform(smx, (v) => v * 12);
  const l4y = useTransform(smy, (v) => v * 12);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden
      className="relative mx-auto aspect-[4/5] w-full max-w-[520px] select-none"
    >
      {/* Ambient plate glow */}
      <div
        className="absolute -inset-6 -z-10 rounded-[36px] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 30%, var(--color-accent-glow), transparent 65%)",
        }}
      />

      {/* -------- Main dashboard card -------- */}
      <motion.div
        style={{ x: l1x, y: l1y }}
        className="absolute inset-[6%] rounded-[22px] border border-[var(--color-hairline-strong)] bg-[var(--color-card)]/85 p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </div>
          <span className="mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-subtle)]">
            Portfolio · Live
          </span>
        </div>

        {/* Balance */}
        <div className="mt-5">
          <p className="mono text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-subtle)]">
            Net worth
          </p>
          <p className="mt-1.5 font-display text-[30px] leading-none tracking-[-0.03em] text-[var(--color-text)]">
            ₹ 24,86,340
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
              +12.4%
            </span>
            <span className="text-[var(--color-muted)]">this quarter</span>
          </div>
        </div>

        {/* Chart */}
        <svg viewBox="0 0 220 70" className="mt-4 h-16 w-full">
          <defs>
            <linearGradient id="hero-chart" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0 50 L20 46 L40 48 L60 38 L80 42 L100 30 L120 34 L140 22 L160 26 L180 16 L200 20 L220 8"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
          />
          <motion.path
            d="M0 50 L20 46 L40 48 L60 38 L80 42 L100 30 L120 34 L140 22 L160 26 L180 16 L200 20 L220 8 L220 70 L0 70 Z"
            fill="url(#hero-chart)"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          />
        </svg>

        {/* Row of holdings */}
        <div className="mt-4 space-y-2">
          {[
            { t: "Index ETF", s: "NIFTY 50", v: "+2.3%" },
            { t: "AI Basket", s: "Curated", v: "+8.1%" },
            { t: "Bonds", s: "Sovereign", v: "+0.4%" },
          ].map((r, i) => (
            <motion.div
              key={r.t}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.08, ease: EASE }}
              className="flex items-center justify-between rounded-lg border border-hairline bg-[var(--color-elevated)]/60 px-2.5 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md border border-hairline bg-[var(--color-surface)] mono text-[9px] text-[var(--color-muted)]">
                  {r.t[0]}
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] text-[var(--color-text)]">{r.t}</p>
                  <p className="mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
                    {r.s}
                  </p>
                </div>
              </div>
              <span className="mono text-[10.5px] text-emerald-400">{r.v}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* -------- Floating: AI insight card -------- */}
      <motion.div
        style={{ x: l2x, y: l2y }}
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-2 top-[6%] w-[52%] rounded-[16px] border border-[var(--color-hairline-strong)] bg-[var(--color-card)]/85 p-3.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-xl md:-right-6"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
            <Sparkles size={11} />
          </span>
          <span className="mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-subtle)]">
            AI Insight
          </span>
        </div>
        <p className="mt-2 text-[11.5px] leading-snug text-[var(--color-text)]">
          Rebalance suggested — <span className="text-[var(--color-accent)]">+₹18,240</span>{" "}
          projected on 12-mo horizon.
        </p>
        <div className="mt-3 flex gap-1.5">
          <span className="mono flex-1 rounded-md bg-[var(--color-text)] px-2 py-1 text-center text-[9.5px] uppercase tracking-widest text-[var(--color-bg)]">
            Apply
          </span>
          <span className="mono rounded-md border border-hairline px-2 py-1 text-[9.5px] uppercase tracking-widest text-[var(--color-muted)]">
            Later
          </span>
        </div>
      </motion.div>

      {/* -------- Floating: design-system tokens -------- */}
      <motion.div
        style={{ x: l3x, y: l3y }}
        animate={reduce ? undefined : { y: [0, 5, 0] }}
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute -left-2 bottom-[12%] w-[46%] rounded-[16px] border border-[var(--color-hairline-strong)] bg-[var(--color-card)]/85 p-3.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-xl md:-left-6"
      >
        <p className="mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-subtle)]">
          Tokens / Palette
        </p>
        <div className="mt-2.5 grid grid-cols-5 gap-1.5">
          {["#0A0A0B", "#1E1E22", "#3B82F6", "#60A5FA", "#F5F5F7"].map((c) => (
            <div
              key={c}
              className="aspect-square rounded-md"
              style={{ background: c, boxShadow: "inset 0 0 0 1px var(--color-hairline)" }}
            />
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            { k: "space-4", v: "16" },
            { k: "radius-lg", v: "16" },
          ].map((t) => (
            <div key={t.k} className="flex items-center justify-between mono text-[9.5px]">
              <span className="text-[var(--color-muted)]">{t.k}</span>
              <span className="text-[var(--color-text)]">{t.v}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* -------- Floating: prototype pill -------- */}
      <motion.div
        style={{ x: l4x, y: l4y }}
        className="absolute right-[8%] bottom-[4%] flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-card)]/85 px-3 py-1.5 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
          <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </span>
        <span className="mono text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Prototype v3.2
        </span>
      </motion.div>
    </div>
  );
}
