import { clsx } from "clsx";

// Subtle blueprint-style dot grid. Purely decorative.
export function DotGrid({
  className,
  size = 22,
  opacity = 0.35,
}: {
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={clsx("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)",
        backgroundSize: `${size}px ${size}px`,
        opacity,
        maskImage:
          "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 55%, transparent 100%)",
      }}
    />
  );
}

// Fine SVG noise texture for editorial paper feel. Fixed layer.
export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-multiply"
      style={{
        opacity: 0.04,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}
