import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, Download, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/design/Button";
import { Badge, Tag } from "@/components/design/Tag";
import { useSite } from "@/lib/cms";

const HEADLINE = [
  { text: "Designing", muted: false },
  { text: "intelligent products", muted: false },
  { text: "that ", muted: true, tail: "millions" },
  { text: "trust with their money.", muted: false },
];

/** Premium editorial hero — 100vh, animated mesh, cursor spotlight, staggered reveal. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  // Cursor spotlight
  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const smx = useSpring(mx, { stiffness: 45, damping: 28, mass: 1 });
  const smy = useSpring(my, { stiffness: 45, damping: 28, mass: 1 });

  const spotlight = useTransform<number, string>(
    [smx, smy] as never,
    ([x, y]: number[]) =>
      `radial-gradient(680px circle at ${x}% ${y}%, var(--color-accent-glow) 0%, transparent 55%)`,
  );

  // Slow animated mesh drift
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
    const a = 20 + Math.sin(d * 0.02) * 12;
    const b = 78 + Math.cos(d * 0.017) * 10;
    const c = 84 + Math.sin(d * 0.023) * 8;
    const e = 12 + Math.cos(d * 0.019) * 10;
    return (
      `radial-gradient(1100px circle at ${a}% -10%, var(--color-accent-wash) 0%, transparent 45%),` +
      `radial-gradient(900px circle at ${b}% 110%, var(--color-accent-wash) 0%, transparent 45%),` +
      `radial-gradient(700px circle at ${c}% 30%, var(--color-accent-wash) 0%, transparent 55%),` +
      `radial-gradient(600px circle at ${e}% 70%, var(--color-accent-wash) 0%, transparent 55%)`
    );
  });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden"
    >
      {/* ---------------- Ambient background ---------------- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Animated gradient mesh */}
        <motion.div className="absolute inset-0" style={{ background: mesh }} />
        {/* Cursor spotlight */}
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hairline) 1px, transparent 1px)," +
              "linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 90% 75% at 50% 45%, black 30%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 75% at 50% 45%, black 30%, transparent 90%)",
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "140px 140px",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg))" }}
        />
      </div>

      {/* ---------------- Content ---------------- */}
      <div className="container-page relative flex flex-1 flex-col justify-center pb-28 pt-36 md:pt-40">
        {/* Eyebrow row */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-wrap items-center gap-2"
        >
          <Badge tone="accent">
            <span aria-hidden className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full border border-[var(--color-accent)] opacity-70"
                style={{ animation: "ring-pulse 1.8s cubic-bezier(0.22,1,0.36,1) infinite" }}
              />
              <span className="relative h-[5px] w-[5px] rounded-full bg-[var(--color-accent)]" />
              <span className="absolute inset-0 rounded-full border border-[var(--color-accent)] opacity-40" />
            </span>
            Available for senior roles · 2026
          </Badge>

          <Tag>Senior Product Designer</Tag>
          <Tag>{site?.location ?? "Mumbai, India"}</Tag>
        </motion.div>

        {/* Headline — blur + fade reveal, word by word */}
        <h1
          className="display-hero mt-10 max-w-[18ch]"
          style={{ fontSize: "clamp(2.75rem, 8.6vw, 6.75rem)" }}
        >
          {HEADLINE.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                initial={reduce ? false : { y: "108%", opacity: 0, filter: "blur(14px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.05, delay: 0.15 + i * 0.11, ease }}
                className="block"
              >
                {line.muted ? (
                  <>
                    <span className="text-[var(--color-muted)]">{line.text}</span>
                    {line.tail && (
                      <span className="italic text-[var(--color-accent)]">{line.tail}</span>
                    )}
                  </>
                ) : (
                  line.text
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Supporting paragraph */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.75, ease }}
          className="mt-10 max-w-[58ch] text-lg leading-relaxed text-[var(--color-muted)] md:text-xl"
        >
          <span className="text-[var(--color-text)]">4.5+ years</span> crafting{" "}
          <span className="text-[var(--color-text)]">AI-powered</span> and{" "}
          <span className="text-[var(--color-text)]">fintech</span> products —
          shaping <span className="text-[var(--color-text)]">design systems</span> and{" "}
          <span className="text-[var(--color-text)]">product strategy</span> at{" "}
          <span className="text-[var(--color-text)]">Motilal Oswal</span>, previously{" "}
          <span className="text-[var(--color-text)]">Trinkerr</span>.
        </motion.p>

        {/* CTA cluster — staggered */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.95 } },
          }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {[
            <Button key="c1" to="/work" variant="accent" size="lg">
              Explore case studies <ArrowUpRight size={16} />
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
                <Download size={15} /> Download résumé
              </Button>
            ) : null,
            <Button key="c3" to="/contact" variant="ghost" size="lg">
              <Mail size={15} /> Contact me
            </Button>,
          ]
            .filter(Boolean)
            .map((btn, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: reduce ? {} : { opacity: 0, y: 10, filter: "blur(6px)" },
                  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
                }}
              >
                {btn}
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/* ---------------- Bottom rail ---------------- */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="container-page relative pb-8"
      >
        <div className="flex items-end justify-between gap-6 border-t border-hairline pt-6">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            <span className="inline-block h-px w-8 bg-[var(--color-hairline-strong)]" />
            <Link to="/work" className="hover:text-[var(--color-text)] transition-colors">
              Scroll for selected work
            </Link>
          </div>
          <motion.div
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-[var(--color-muted)]"
            aria-hidden
          >
            <ArrowDown size={14} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
