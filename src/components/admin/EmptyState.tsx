import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { clsx } from "clsx";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-neutral-500">
          <Icon size={20} />
        </div>
      )}
      <h3 className="font-display text-xl text-neutral-900">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {actionLabel && (actionTo || onAction) && (
        <div className="mt-5">
          {actionTo ? (
            <Button asChild size="sm">
              <Link to={actionTo}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function LoadingRows({ count = 3, height = 88 }: { count?: number; height?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-neutral-200 bg-white"
          style={{ height }}
        />
      ))}
    </div>
  );
}

/** Sticky footer bar surfaced when rows are selected. */
export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-900 py-2 pl-4 pr-2 text-white shadow-2xl">
        <span className="text-sm">
          <strong className="tabular-nums">{count}</strong> selected
        </span>
        <span className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-1">{children}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="rounded-full text-white hover:bg-white/10 hover:text-white"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
