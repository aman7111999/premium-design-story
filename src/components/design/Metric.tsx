import { CountUp } from "@/components/CountUp";
import { clsx } from "clsx";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "text-[var(--font-size-2xl)]",
  md: "text-[var(--font-size-3xl)] md:text-[var(--font-size-4xl)]",
  lg: "text-[var(--font-size-4xl)] md:text-[var(--font-size-5xl)]",
};

export function Metric({
  value,
  label,
  hint,
  align = "left",
  size = "md",
  className,
  accent = false,
}: {
  value: string;
  label: string;
  hint?: string;
  align?: "left" | "center";
  size?: Size;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      <p className="eyebrow">{label}</p>
      <p
        className={clsx(
          "font-display mt-[var(--space-2)] leading-none tracking-[var(--tracking-tight)]",
          sizes[size],
          accent && "text-[var(--color-accent)]",
        )}
      >
        <CountUp value={value} />
      </p>
      {hint && (
        <p className="mt-[var(--space-2)] text-[13px] text-[var(--color-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
}
