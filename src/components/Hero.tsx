import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Figma, Framer, Diamond, Shield, PenTool } from "lucide-react";
import { useSite } from "@/lib/cms";
import portraitImg from "@/assets/portrait.jpg";


/**
 * Boldex-style hero: portrait dominant right, clean sans headline left.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const { data: site } = useSite();

  const name = site?.name ?? "Aman Mishra";
  const avatar = site?.profile_image_url;

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30" />
      {/* Emerald glow behind portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] top-1/3 -z-10 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(closest-side, var(--color-accent-glow), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="container-page relative">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-6">
          {/* Left: copy */}
          <div className="md:col-span-6 lg:col-span-7">
            {/* Available pill */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3 py-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span className="text-[12px] font-medium text-[var(--color-muted)]">
                Available for Projects
              </span>
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-text)]"
              style={{ fontSize: "clamp(2.6rem, 6.4vw, 5.5rem)" }}
            >
              Meet the <span className="text-[var(--color-accent)]">Expert</span>
              <br />
              Product Designer
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--color-muted)]"
            >
              I focus on delivering seamless navigation, responsive layouts,
              and pixel-perfect designs — from 0→1 product to launch.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a href="/work" className="btn-primary">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent-contrast)] text-[var(--color-accent)]">
                  <ArrowRight size={15} />
                </span>
                View Projects
              </a>
            </motion.div>

            {/* Logo strip */}
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[var(--color-subtle)]"
            >
              {["Figma", "Framer", "Webflow", "Linear", "Notion"].map((b) => (
                <span key={b} className="text-[13px] font-semibold tracking-tight opacity-70">
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: portrait with orbit badges */}
          <div className="md:col-span-6 lg:col-span-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-[4/5] w-full max-w-[460px]"
            >
              {/* Radial spotlight behind portrait */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 -z-10 rounded-[50%]"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 70%)",
                  filter: "blur(30px)",
                }}
              />

              {/* Portrait card — glass frame */}
              <div className="liquid-glass relative h-full w-full overflow-hidden !rounded-[32px]">
                <img
                  src={avatar || portraitImg}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover"
                  width={1024}
                  height={1280}
                />
                {/* subtle bottom fade to blend with page */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1]"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(5,8,7,0.75) 100%)",
                  }}
                />
              </div>

              {/* Floating tool badges — real icons */}
              {[
                { Icon: Figma,   pos: { top: "6%",   left: "-14%" }, delay: 0,   size: 22, tint: "var(--color-accent)" },
                { Icon: Diamond, pos: { top: "18%",  right: "-14%" }, delay: 0.6, size: 20, tint: "var(--color-text)" },
                { Icon: Shield,  pos: { top: "48%",  right: "-18%" }, delay: 1.2, size: 22, tint: "var(--color-text)" },
                { Icon: Framer,  pos: { top: "56%",  left: "-16%" }, delay: 1.8, size: 22, tint: "var(--color-accent)" },
                { Icon: PenTool, pos: { bottom: "12%", left: "-8%" }, delay: 2.4, size: 20, tint: "var(--color-text)" },
              ].map((b, i) => {
                const { Icon } = b;
                return (
                  <motion.div
                    key={i}
                    animate={reduce ? {} : { y: [0, -10, 0] }}
                    transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
                    className="absolute z-10 grid h-14 w-14 place-items-center rounded-full"
                    style={{
                      ...b.pos as React.CSSProperties,
                      background: "color-mix(in oklab, var(--color-surface) 55%, transparent)",
                      backdropFilter: "blur(16px) saturate(1.6)",
                      WebkitBackdropFilter: "blur(16px) saturate(1.6)",
                      border: "1px solid var(--color-hairline-strong)",
                      boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 12px 30px -12px rgba(0,0,0,0.6)",
                      color: b.tint,
                    }}
                  >
                    <Icon size={b.size} strokeWidth={1.75} />
                  </motion.div>
                );
              })}

              {/* Circular text badge */}
              <div className="absolute -bottom-6 -right-6 z-10 h-28 w-28">
                <div className="animate-spin-slow relative h-full w-full">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-[var(--color-text)]">
                    <defs>
                      <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                    </defs>
                    <text fontSize="9" fontWeight="600" letterSpacing="2" fill="currentColor">
                      <textPath href="#circ">
                        OFFICIAL FRAMER PARTNER • CREATOR •
                      </textPath>
                    </text>
                  </svg>
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent)] text-[16px] font-bold text-[var(--color-accent-contrast)] shadow-[0_0_30px_-4px_var(--color-accent-glow)]">
                    ✦
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
