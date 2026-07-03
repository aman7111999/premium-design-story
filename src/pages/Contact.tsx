import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Seo } from "@/lib/seo";
import { site } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight, Check, Copy } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <Seo title="Contact" description={`Get in touch with ${site.name}.`} path="/contact" />

      <section className="container-page pt-24 pb-16 md:pt-40">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Say hello</p>
          <h1 className="display-hero mt-6 text-6xl leading-[0.95] md:text-[10rem]">
            Let's<br/>make<br/>
            <span className="italic underline decoration-[var(--color-accent)] decoration-4 underline-offset-8">something</span>.
          </h1>
        </Reveal>
      </section>

      <section className="container-page grid gap-16 pb-32 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="text-lg leading-relaxed text-[var(--color-muted)] max-w-lg">
            I'm currently {site.availability.toLowerCase()}. If you're building a product that treats
            design as a first-class function, I'd love to hear about it. I read every message and
            reply within two business days.
          </p>

          <a
            href={`mailto:${site.email}`}
            className="mt-10 inline-flex items-center gap-3 font-display text-3xl md:text-5xl link-underline"
          >
            {site.email}
            <ArrowUpRight size={28} />
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-xs uppercase tracking-widest text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            aria-live="polite"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2"
                >
                  <Check size={14} /> Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2"
                >
                  <Copy size={14} /> Copy email
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Reveal>


        <Reveal className="md:col-span-4 md:col-start-9">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Elsewhere</p>
          <ul className="mt-4 space-y-3">
            {Object.entries(site.socials).map(([k, v]) => (
              <li key={k}>
                <a
                  href={v}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-lg link-underline capitalize"
                >
                  {k} <ArrowUpRight size={16} />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-lg border border-hairline p-6">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Availability</p>
            <p className="mt-3 text-[15px]">{site.availability}</p>
            <p className="mt-1 text-[15px] text-[var(--color-muted)]">{site.location}</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
