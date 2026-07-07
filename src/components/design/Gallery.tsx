import { motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  span?: "narrow" | "wide" | "full";
};

const spanMap: Record<NonNullable<GalleryItem["span"]>, string> = {
  narrow: "md:col-span-1",
  wide:   "md:col-span-2",
  full:   "md:col-span-3",
};

/**
 * Editorial media gallery. Items span 1–3 columns of a 3-col grid.
 * Uses design tokens for radius, spacing, elevation.
 */
export function Gallery({
  items,
  className,
}: {
  items: GalleryItem[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={clsx(
        "grid gap-[var(--space-6)] md:grid-cols-3",
        className,
      )}
    >
      {items.map((it, i) => (
        <motion.figure
          key={it.id}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className={clsx(
            "group overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)]",
            "shadow-[var(--elevation-1)] transition-shadow duration-[var(--dur-slow)] ease-[var(--ease-out-quart)]",
            "hover:shadow-[var(--elevation-3)]",
            spanMap[it.span ?? "narrow"],
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-elevated)]">
            <img
              src={it.src}
              alt={it.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
            />
          </div>
          {it.caption && (
            <figcaption className="px-[var(--space-5)] py-[var(--space-4)] text-[13px] text-[var(--color-muted)]">
              {it.caption}
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
}
