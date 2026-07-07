import type { ReactNode } from "react";
import { clsx } from "clsx";

export function QuoteBlock({
  children,
  author,
  meta,
  size = "md",
  className,
}: {
  children: ReactNode;
  author?: string;
  meta?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  } as const;
  return (
    <figure
      className={clsx(
        "card-surface rounded-[var(--radius-lg)] p-[var(--space-8)] md:p-[var(--space-10)]",
        "transition-[border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-out-quart)]",
        className,
      )}
    >
      <blockquote
        className={clsx(
          "font-display leading-snug tracking-[var(--tracking-tight)]",
          sizes[size],
        )}
      >
        <span className="text-[var(--color-accent)]">“</span>
        {children}
        <span className="text-[var(--color-accent)]">”</span>
      </blockquote>
      {(author || meta) && (
        <figcaption className="mt-[var(--space-8)] flex items-center gap-[var(--space-3)]">
          <span className="h-px w-8 bg-[var(--color-hairline-strong)]" />
          <span className="text-sm">
            {author && <span className="text-[var(--color-text)]">{author}</span>}
            {meta && <span className="ml-[var(--space-2)] text-[var(--color-muted)]">{meta}</span>}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
