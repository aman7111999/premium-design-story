import { clsx } from "clsx";

export type TestimonialCardProps = {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  className?: string;
};

/**
 * Compact testimonial card with author lockup — distinct from the editorial
 * QuoteBlock. Suited for grids of social proof.
 */
export function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatar,
  className,
}: TestimonialCardProps) {
  const meta = [role, company].filter(Boolean).join(" · ");
  const initials = author
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <figure
      className={clsx(
        "flex h-full flex-col justify-between gap-[var(--space-8)]",
        "rounded-[var(--radius-lg)] border border-hairline bg-[var(--color-card)]",
        "p-[var(--space-6)] md:p-[var(--space-8)]",
        "shadow-[var(--elevation-1)] transition-[transform,box-shadow,border-color]",
        "duration-[var(--dur-slow)] ease-[var(--ease-out-quart)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--elevation-3)] hover:border-[var(--color-hairline-strong)]",
        className,
      )}
    >
      <blockquote className="text-[15px] leading-[var(--leading-normal)] text-[var(--color-text)]">
        <span className="text-[var(--color-accent)]">“</span>
        {quote}
        <span className="text-[var(--color-accent)]">”</span>
      </blockquote>

      <figcaption className="flex items-center gap-[var(--space-3)]">
        <span
          aria-hidden
          className={clsx(
            "grid h-10 w-10 place-items-center overflow-hidden rounded-full",
            "border border-hairline bg-[var(--color-elevated)] text-[12px] font-mono text-[var(--color-muted)]",
          )}
        >
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            initials
          )}
        </span>
        <span className="flex flex-col">
          <span className="text-[13px] font-medium text-[var(--color-text)]">{author}</span>
          {meta && (
            <span className="text-[12px] text-[var(--color-muted)]">{meta}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
