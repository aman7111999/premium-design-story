import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Seo } from "@/lib/seo";
import { useSite } from "@/lib/cms";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Invalid email").max(320),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export default function Contact() {
  const { data: site } = useSite();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const copyEmail = async () => {
    if (!site?.email) return;
    try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(form);
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      const { error } = await supabase.from("contact_inquiries").insert({ ...parsed.data, source: "website" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Message sent — I'll reply within 2 business days."); setForm({ name: "", email: "", message: "" }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Seo title="Contact" description={`Get in touch with ${site?.name ?? ""}.`} path="/contact" siteName={site?.name ?? "Portfolio"} />

      <section className="container-page pt-24 pb-16 md:pt-40">
        <Reveal>
          <p className="eyebrow">Say hello</p>
          <h1 className="display-hero mt-6 max-w-[14ch] text-5xl leading-[1.02] md:text-[7.5rem] md:leading-[0.98]">
            Let's make{" "}
            <span className="italic text-[var(--color-accent)]">something</span>.
          </h1>
        </Reveal>
      </section>


      <section className="container-page grid gap-16 pb-32 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          {site?.email && (
            <>
              <a href={`mailto:${site.email}`} className="mt-4 inline-flex items-center gap-3 font-display text-3xl md:text-5xl link-underline">
                {site.email} <ArrowUpRight size={28} />
              </a>
              <button type="button" onClick={copyEmail} className="mt-6 inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-xs uppercase tracking-widest text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span key="c" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2"><Check size={14} /> Copied</motion.span>
                  ) : (
                    <motion.span key="d" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2"><Copy size={14} /> Copy email</motion.span>
                  )}
                </AnimatePresence>
              </button>
            </>
          )}

          <form onSubmit={(e) => { e.preventDefault(); submit.mutate(); }} className="mt-12 max-w-lg space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="eyebrow">Name</Label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-12 rounded-lg border-hairline bg-[var(--color-surface)] px-4 text-[15px] text-[var(--color-text)] shadow-none transition-colors focus-visible:border-[var(--color-accent)] focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="eyebrow">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-12 rounded-lg border-hairline bg-[var(--color-surface)] px-4 text-[15px] text-[var(--color-text)] shadow-none transition-colors focus-visible:border-[var(--color-accent)] focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message" className="eyebrow">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="rounded-lg border-hairline bg-[var(--color-surface)] px-4 py-3 text-[15px] leading-relaxed text-[var(--color-text)] shadow-none transition-colors focus-visible:border-[var(--color-accent)] focus-visible:ring-0"
              />
            </div>
            <button
              type="submit"
              disabled={submit.isPending}
              aria-label="Send message"
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-text)] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-[var(--color-inverse)] shadow-[var(--elevation-2)] transition-all hover:bg-[var(--color-accent)] hover:shadow-[var(--elevation-3)] disabled:opacity-60"
            >
              {submit.isPending ? (
                <><Loader2 size={14} className="animate-spin" aria-hidden="true" /> Sending</>
              ) : (
                <>Send message <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>
              )}
            </button>
          </form>

        </Reveal>

        <Reveal className="md:col-span-4 md:col-start-9">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Elsewhere</p>
          <ul className="mt-4 space-y-3">
            {(site?.socials ?? []).map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-lg link-underline">
                  {s.label} <ArrowUpRight size={16} />
                </a>
              </li>
            ))}
          </ul>
          {site?.location && (
            <div className="mt-12 rounded-lg border border-hairline p-6">
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Based in</p>
              <p className="mt-3 text-[15px]">{site.location}</p>
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
