import DOMPurify from "dompurify";
import { useMemo } from "react";

/**
 * Renders CMS HTML safely with editorial typography.
 * Uses design tokens — no hardcoded colors.
 */
export function ProseHtml({ html, className }: { html: string; className?: string }) {
  const safe = useMemo(() => DOMPurify.sanitize(html), [html]);
  return (
    <div
      className={
        "prose-editorial max-w-none text-[17px] leading-[var(--leading-normal)] text-[var(--color-muted)] " +
        (className ?? "")
      }
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
