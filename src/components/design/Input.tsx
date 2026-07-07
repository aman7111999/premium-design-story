import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

const fieldBase =
  "w-full rounded-[var(--radius-md)] bg-[var(--color-card)] " +
  "border border-[var(--color-hairline)] text-[var(--color-text)] " +
  "placeholder:text-[var(--color-subtle)] " +
  "transition-[border-color,box-shadow,background-color] duration-[var(--dur-fast)] ease-[var(--ease-out-quart)] " +
  "focus:outline-none focus:border-[var(--color-accent)] " +
  "focus:shadow-[0_0_0_3px_var(--color-accent-ring)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

const sizes = {
  sm: "h-9  px-[var(--space-3)] text-[13px]",
  md: "h-11 px-[var(--space-4)] text-sm",
  lg: "h-12 px-[var(--space-5)] text-[15px]",
} as const;

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { inputSize?: keyof typeof sizes }>(
  function Input({ className, inputSize = "md", ...rest }, ref) {
    return <input ref={ref} className={clsx(fieldBase, sizes[inputSize], className)} {...rest} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 5, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          fieldBase,
          "py-[var(--space-3)] px-[var(--space-4)] text-sm leading-[var(--leading-normal)] resize-y",
          className,
        )}
        {...rest}
      />
    );
  },
);

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("flex flex-col gap-[var(--space-2)]", className)}>
      {label && (
        <span className="eyebrow flex items-center gap-[var(--space-2)]">
          {label}
          {required && <span className="text-[var(--color-accent)]">*</span>}
        </span>
      )}
      {children}
      {(hint || error) && (
        <span
          className={clsx(
            "text-[12px]",
            error ? "text-[var(--color-danger)]" : "text-[var(--color-muted)]",
          )}
        >
          {error ?? hint}
        </span>
      )}
    </label>
  );
}
