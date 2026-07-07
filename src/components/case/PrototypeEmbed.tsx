import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EMBEDDABLE = /(figma\.com\/proto|figma\.com\/embed|framer\.com|codesandbox\.io\/embed|codepen\.io|youtube\.com\/embed|player\.vimeo\.com)/i;

export function isPrototypeLink(url: string): boolean {
  return EMBEDDABLE.test(url);
}

/**
 * Embeds an interactive prototype in a framed viewport.
 * Figma URLs get auto-wrapped in the /embed endpoint.
 * Includes an in-page fullscreen toggle for immersive viewing.
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
  const ref = useRef<HTMLElement>(null);
  const [fs, setFs] = useState(false);

  const src = url.includes("figma.com") && !url.includes("figma.com/embed")
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
    : url;

  const toggleFs = async () => {
    if (!ref.current) return;
    if (!document.fullscreenElement) {
      await ref.current.requestFullscreen?.();
      setFs(true);
    } else {
      await document.exitFullscreen?.();
      setFs(false);
    }
  };

  useEffect(() => {
    const onChange = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <figure
      ref={ref}
      className="group/proto relative overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-card)] shadow-[var(--elevation-2)] transition-shadow duration-[var(--dur-slow)] hover:shadow-[var(--elevation-3)]"
    >
      <div className="flex items-center justify-between border-b border-hairline bg-[var(--color-surface)] px-[var(--space-5)] py-[var(--space-3)]">
        <div className="flex items-center gap-[var(--space-3)]">
          <span aria-hidden className="flex gap-[var(--space-1)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-hairline-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-muted)]">
            {label ?? "Live prototype"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleFs}
            aria-label={fs ? "Exit fullscreen" : "Enter fullscreen"}
            className="grid h-7 w-7 place-items-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-elevated)] hover:text-[var(--color-text)]"
          >
            {fs ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[var(--space-2)] rounded-full px-2 py-1 font-mono text-[11px] uppercase tracking-[var(--tracking-widest)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            Open <ExternalLink size={11} />
          </a>
        </div>
      </div>
      <div
        style={{ aspectRatio: fs ? undefined : aspect, height: fs ? "calc(100vh - 46px)" : undefined }}
        className="w-full bg-[var(--color-elevated)]"
      >
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
