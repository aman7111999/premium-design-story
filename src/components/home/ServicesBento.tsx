import { motion, useReducedMotion } from "framer-motion";
import { Layers, Zap, Palette, Wand2, MousePointer2, Boxes } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const SERVICES = [
  { icon: Layers, title: "UI / UX Design", copy: "End-to-end product design — research, flows, wireframes, high-fidelity UI.", size: "lg" as const },
  { icon: Zap, title: "Framer Development", copy: "Pixel-perfect Framer sites with rich interactions and CMS.", size: "lg" as const },
  { icon: Palette, title: "Design Systems", copy: "Tokens, components, docs.", size: "sm" as const },
  { icon: Wand2, title: "Motion", copy: "Micro-interactions & scroll.", size: "sm" as const },
  { icon: MousePointer2, title: "Prototyping", copy: "Clickable, testable.", size: "sm" as const },
  { icon: Boxes, title: "0 → 1 Product", copy: "From napkin to launch.", size: "sm" as const },
];

export function ServicesBento() {
  const reduce = useReducedMotion();
  const large = SERVICES.filter((s) => s.size === "lg");
  const small = SERVICES.filter((s) => s.size === "sm");

  return (
    <section className="container-page py-20 md:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">What I Do</p>
        <h2 className="display-2 mt-4 text-[var(--color-text)]">
          Crafting <em className="italic text-[var(--color-accent)]">Next-Horizon</em> Experiences
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--color-muted)]">
          A small, sharp toolkit that ships product-grade work end-to-end.
        </p>
      </Reveal>

      {/* 2 large cards */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {large.map((s, i) => (
          <motion.div
            key={s.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="card-dark group relative overflow-hidden p-8 md:p-10"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-[var(--color-hairline-strong)] bg-[var(--color-elevated)] text-[var(--color-accent)] transition-transform group-hover:-translate-y-1">
                <s.icon size={20} />
              </div>
              <div>
                <h3 className="font-heavy text-[20px] font-bold uppercase tracking-[-0.01em] text-[var(--color-text)]">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[var(--color-muted)]">
                  {s.copy}
                </p>
              </div>
            </div>
            {/* Emerald edge glow on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(closest-side, var(--color-accent-glow), transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* 4 small cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {small.map((s, i) => (
          <motion.div
            key={s.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="card-dark group relative p-6"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-hairline-strong)] bg-[var(--color-elevated)] text-[var(--color-accent)] transition-transform group-hover:-translate-y-1">
              <s.icon size={16} />
            </div>
            <h3 className="mt-4 font-heavy text-[15px] font-bold uppercase tracking-[-0.01em] text-[var(--color-text)]">
              {s.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-muted)]">
              {s.copy}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
