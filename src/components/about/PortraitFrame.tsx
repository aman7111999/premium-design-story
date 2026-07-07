import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function PortraitFrame({ src, alt }: { src?: string | null; alt?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <div
      ref={ref}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-lg)] border border-hairline"
      style={{ boxShadow: "var(--elevation-3)" }}
    >
      {src ? (
        <motion.div
          style={{ y, background: `center/cover url(${src})` }}
          className="absolute inset-[-8%]"
          aria-label={alt}
          role="img"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 20% 10%, #E7EDE7 0%, #B6C5BE 55%, #3F5A55 100%)",
          }}
        />
      )}
      {/* Grain */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Frame label */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-hairline bg-[var(--color-overlay)] px-[var(--space-4)] py-[var(--space-3)] backdrop-blur">
        <p className="eyebrow">Portrait / 01</p>
        <p className="eyebrow text-[var(--color-subtle)]">35mm · f/1.8</p>
      </div>
    </div>
  );
}
