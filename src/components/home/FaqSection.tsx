import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useContent } from "@/lib/cms";

type Data = {
  eyebrow: string;
  heading_line1: string;
  heading_accent: string;
  heading_line2: string;
  subline: string;
  items: { q: string; a: string }[];
};

const FALLBACK: Data = {
  eyebrow: "FAQ",
  heading_line1: "Commonly",
  heading_accent: "Asked",
  heading_line2: "Questions",
  subline: "Answers to what people ask before we start. Have another? Ping me.",
  items: [],
};

export function FaqSection() {
  const { data: c } = useContent<Data>("home_faq", FALLBACK);
  const d = c ?? FALLBACK;
  const [open, setOpen] = useState<number | null>(0);
  const faq = d.items ?? [];

  return (
    <section className="container-page py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="eyebrow">{d.eyebrow}</p>
          <h2
            className="mt-3 font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)" }}
          >
            {d.heading_line1} <span className="text-[var(--color-accent)]">{d.heading_accent}</span>
            <br /> {d.heading_line2}
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-[1.65] text-[var(--color-muted)]">{d.subline}</p>
        </Reveal>

        <div className="md:col-span-7">
          <ul className="space-y-3">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className="liquid-glass overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[68px] w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[17px] font-semibold text-[var(--color-text)]">{item.q}</span>
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-hairline-strong)] text-[var(--color-accent)] transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                    >
                      <Plus size={15} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-[15px] leading-[1.65] text-[var(--color-muted)]">{item.a}</p>
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
