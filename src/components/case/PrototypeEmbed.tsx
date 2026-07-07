import { ExternalLink } from "lucide-react";

const EMBEDDABLE = /(figma\.com\/proto|figma\.com\/embed|framer\.com|codesandbox\.io\/embed|codepen\.io|youtube\.com\/embed|player\.vimeo\.com)/i;

export function isPrototypeLink(url: string): boolean {
  return EMBEDDABLE.test(url);
}

/**
 * Embeds an interactive prototype in a framed viewport.
 * Figma URLs get auto-wrapped in the /embed endpoint.
 */
export function PrototypeEmbed({
  url,
  label,
  aspect = "16/10",
}: {
  url: string;
  label?: string;
  aspect?: string;
}) {
  const src = url.includes("figma.com") && !url.includes("figma.com/embed")
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
    : url;

  return (
    <figure className="overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-card)] shadow-[var(--elevation-2)]">
      <div className="flex items-center justify-between border-b border-hairline bg-[var(--color-surface)] px-[var(--space-5)] py-[var(--space-3)]">
        <div className="flex items-center gap-[var(--space-3)]">
          <span aria-hidden className="flex gap-[var(--space-1)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-muted)]">
            {label ?? "Live prototype"}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-[var(--space-2)] font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          Open <ExternalLink size={11} />
        </a>
      </div>
      <div style={{ aspectRatio: aspect }} className="w-full bg-[var(--color-elevated)]">
        <iframe
          src={src}
          title={label ?? "Prototype"}
          className="h-full w-full"
          loading="lazy"
          allow="fullscreen; clipboard-write"
          allowFullScreen
        />
      </div>
    </figure>
  );
}
