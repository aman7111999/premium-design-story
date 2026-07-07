import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-medium " +
  "tracking-tight whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,box-shadow,transform,opacity] " +
  "duration-[var(--dur-base)] ease-[var(--ease-out-quart)] " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "active:scale-[0.98]";

const sizes: Record<Size, string> = {
  sm: "h-8  px-[var(--space-4)] text-[13px]",
  md: "h-10 px-[var(--space-5)] text-sm",
  lg: "h-12 px-[var(--space-6)] text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-text)] text-[var(--color-bg)] shadow-[var(--elevation-1)] hover:opacity-90",
  secondary:
    "border border-[var(--color-hairline-strong)] text-[var(--color-text)] " +
    "bg-[var(--color-elevated)]/0 hover:bg-[var(--color-elevated)]",
  ghost:
    "text-[var(--color-text)] hover:bg-[var(--color-elevated)]",
  accent:
    "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] " +
    "hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-pressed)] " +
    "shadow-[var(--elevation-accent)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:opacity-90",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined };
type AsLink   = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string; href?: undefined };
type AsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };
type Props = AsButton | AsLink | AsAnchor;

export const Button = forwardRef<HTMLElement, Props>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref,
) {
  const cls = clsx(base, sizes[size], variants[variant], className);
  if ("to" in rest && rest.to !== undefined) {
    const { to, ...anchorRest } = rest as AsLink;
    return (
      <Link ref={ref as never} to={to} className={cls} {...(anchorRest as object)}>
        {children}
      </Link>
    );
  }
  if ("href" in rest && rest.href !== undefined) {
    return (
      <a ref={ref as never} className={cls} {...(rest as AsAnchor)}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref as never} type="button" className={cls} {...(rest as AsButton)}>
      {children}
    </button>
  );
});
