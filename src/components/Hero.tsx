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
              className="relative mx-auto aspect-[4/5] w-full max-w-[440px]"
            >
              {/* Portrait card */}
              <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-[var(--color-hairline-strong)] bg-[var(--color-card)]">
                {avatar ? (
                  <img src={avatar} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--color-elevated)] to-[var(--color-surface)]">
                    <span className="text-[80px] font-bold text-[var(--color-accent)]">
                      {name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                )}
                {/* subtle top gradient */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(5,8,7,0.85) 100%)",
                  }}
                />
              </div>

              {/* Floating tool badges */}
              {[
                { label: "F", top: "8%", left: "-10%", delay: 0 },
                { label: "A", top: "38%", right: "-12%", delay: 1 },
                { label: "◆", top: "-6%", right: "10%", delay: 2 },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  animate={reduce ? {} : { y: [0, -8, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
                  className="absolute grid h-14 w-14 place-items-center rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)]/90 text-[18px] font-bold text-[var(--color-text)] backdrop-blur-sm"
                  style={{
                    top: b.top as string,
                    left: (b as any).left,
                    right: (b as any).right,
                  }}
                >
                  {b.label}
                </motion.div>
              ))}

              {/* Circular text badge */}
              <div className="absolute -bottom-6 -right-6 h-28 w-28">
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
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent)] text-[16px] font-bold text-[var(--color-accent-contrast)]">
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
