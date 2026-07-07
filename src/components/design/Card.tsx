import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type Elevation = 0 | 1 | 2 | 3 | 4;
type Padding = "none" | "sm" | "md" | "lg";

const padMap: Record<Padding, string> = {
  none: "",
  sm: "p-[var(--space-4)]",
  md: "p-[var(--space-6)] md:p-[var(--space-8)]",
  lg: "p-[var(--space-8)] md:p-[var(--space-10)]",
};

const elevationMap: Record<Elevation, string> = {
  0: "",
  1: "shadow-[var(--elevation-1)]",
  2: "shadow-[var(--elevation-2)]",
  3: "shadow-[var(--elevation-3)]",
  4: "shadow-[var(--elevation-4)]",
};

export function Card({
  className,
  interactive,
  elevation = 0,
  padding = "none",
  radius = "lg",
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  elevation?: Elevation;
  padding?: Padding;
  radius?: "md" | "lg" | "xl" | "2xl";
}) {
  return (
    <div
      className={clsx(
        "border border-hairline bg-[var(--color-card)]",
        `rounded-[var(--radius-${radius})]`,
        padMap[padding],
        elevationMap[elevation],
        "transition-[transform,box-shadow,border-color] duration-[var(--dur-slow)] ease-[var(--ease-out-quart)]",
        interactive &&
          "hover:-translate-y-0.5 hover:border-[var(--color-hairline-strong)] hover:shadow-[var(--elevation-3)]",
        className,
      )}
      {...rest}
    />
  );
}
