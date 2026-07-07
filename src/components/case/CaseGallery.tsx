import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

type GalleryImage = { url: string; caption?: string };

/**
 * Editorial gallery with lightbox (expandable images).
 * Asymmetric spans: first item wide, rest narrow — mosaic feel.
 */
export function CaseGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  return (
    <>
      <div className="grid gap-[var(--space-4)] md:grid-cols-6 md:gap-[var(--space-6)]">
        {images.map((img, i) => {
          const span =
            i === 0 ? "md:col-span-6" :
            i % 3 === 1 ? "md:col-span-4" :
            i % 3 === 2 ? "md:col-span-2" :
            "md:col-span-3";
          return (
            <motion.button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={
                "group relative block overflow-hidden rounded-[var(--radius-lg)] border border-hairline " +
                "bg-[var(--color-elevated)] shadow-[var(--elevation-1)] " +
                "transition-shadow duration-[var(--dur-slow)] ease-[var(--ease-out-quart)] " +
                "hover:shadow-[var(--elevation-3)] " + span
              }
              aria-label={img.caption ? `Expand: ${img.caption}` : "Expand image"}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={img.url}
                  alt={img.caption ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-[var(--dur-base)] group-hover:opacity-100">
                  <ZoomIn size={14} />
                </span>
              </div>
              {img.caption && (
                <figcaption className="px-[var(--space-5)] py-[var(--space-3)] text-left text-[13px] text-[var(--color-muted)]">
                  {img.caption}
                </figcaption>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* -------- Lightbox -------- */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] flex flex-col bg-black/85 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <X size={18} />
            </button>
            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="m-auto flex max-h-[92vh] max-w-[92vw] flex-col items-center gap-4 p-6"
            >
              <img
                src={images[active].url}
                alt={images[active].caption ?? ""}
                className="max-h-[80vh] max-w-full rounded-[var(--radius-md)] object-contain shadow-[var(--elevation-4)]"
              />
              {images[active].caption && (
                <figcaption className="max-w-2xl text-center text-sm text-white/80">
                  {images[active].caption}
                </figcaption>
              )}
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                {active + 1} / {images.length} · Esc to close · ← →
              </p>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
