import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type Tone = "muted" | "accent" | "success" | "warning" | "danger";
type Size = "sm" | "md";

const toneMap: Record<Tone, string> = {
  muted:
    "border border-hairline bg-[var(--color-elevated)] text-[var(--color-muted)]",
  accent:
    "border border-[var(--color-accent)]/30 bg-[var(--color-accent-wash)] text-[var(--color-accent)]",
  success:
    "border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]",
  warning:
    "border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  danger:
    "border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
};

const sizeMap: Record<Size, string> = {
  sm: "px-[var(--space-2)] py-[2px] text-[10px]",
  md: "px-[var(--space-3)] py-[var(--space-1)] text-[11px]",
};

export function Tag({
  className,
  size = "md",
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { size?: Size }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-pill)] font-mono uppercase tracking-widest",
        sizeMap[size],
        toneMap.muted,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export function Badge({
  tone = "muted",
  size = "md",
  children,
  className,
}: {
  tone?: Tone;
  size?: Size;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-pill)] font-mono tracking-widest uppercase",
        sizeMap[size],
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
