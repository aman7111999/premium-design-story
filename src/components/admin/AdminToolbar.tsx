import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

/**
 * Search + optional filters + right-side actions row.
 * Used above tables/lists across admin.
 */
export function AdminToolbar({
  search,
  onSearch,
  placeholder = "Search…",
  filters,
  actions,
  className,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  placeholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm",
        className,
      )}
    >
      {onSearch && (
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            value={search ?? ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className="h-9 pl-8 pr-8 border-transparent bg-neutral-50 focus-visible:border-neutral-300 focus-visible:ring-0"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}
      {filters && <div className="flex items-center gap-1">{filters}</div>}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function ToolbarChip({
  active,
  onClick,
  children,
  count,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={clsx(
        "h-8 rounded-full px-3 text-xs font-medium",
        active ? "" : "text-neutral-600 hover:text-neutral-900",
      )}
    >
      {children}
      {typeof count === "number" && (
        <span
          className={clsx(
            "ml-1.5 rounded-full px-1.5 text-[10px]",
            active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500",
          )}
        >
          {count}
        </span>
      )}
    </Button>
  );
}
