import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const FAQ = [
  { q: "What kind of projects do you take on?", a: "0→1 product design, marketing sites, Framer builds, and design systems for founders and small teams." },
  { q: "How long does a typical project take?", a: "A landing site: 2–3 weeks. A full product redesign: 6–10 weeks depending on scope." },
  { q: "Do you work with existing teams?", a: "Yes — I embed with product & engineering, running design sprints, reviews, and shipping polished handoff." },
  { q: "What's your pricing model?", a: "Fixed-fee per project or a weekly retainer. Ballpark shared after a short discovery call." },
  { q: "Can you build the site too?", a: "Absolutely — Framer, Webflow, or React/Tailwind. Design and dev under one roof." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="eyebrow">FAQ</p>
          <h2 className="display-2 mt-4 text-[var(--color-text)]">
            Commonly <em className="italic text-[var(--color-accent)]">asked</em> questions.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--color-muted)]">
            Answers to what people ask before we start. Have another? Ping me.
          </p>
        </Reveal>

        <div className="md:col-span-7">
          <ul className="space-y-3">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className="card-dark overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-heavy text-[15px] font-bold text-[var(--color-text)]">
                      {item.q}
                    </span>
                    <Plus
                      size={18}
                      className="shrink-0 text-[var(--color-accent)] transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-5 text-[14px] leading-relaxed text-[var(--color-muted)]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
