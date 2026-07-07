/**
 * Reusable motion primitives. All respect prefers-reduced-motion.
 * Import from "@/components/motion".
 */
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type MotionProps,
  type Variants,
} from "framer-motion";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { clsx } from "clsx";
import { variants, viewport, spring, t, duration, ease } from "@/lib/motion";

/* ============================================================
   ScrollReveal — generic in-view wrapper. Choose a preset.
   ============================================================ */
type Preset = "fadeUp" | "fadeIn" | "blurReveal" | "scaleReveal";

type RevealProps = {
  as?: ElementType;
  preset?: Preset;
  delay?: number;
  once?: boolean;
  className?: string;
  children: ReactNode;
};

export function ScrollReveal({
  as: Tag = "div",
  preset = "fadeUp",
  delay = 0,
  once = true,
  className,
  children,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion(Tag as any);
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <MotionTag
      className={className}
      variants={variants[preset] as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewport, once }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export const FadeUp = (p: Omit<RevealProps, "preset">) => <ScrollReveal {...p} preset="fadeUp" />;
export const BlurReveal = (p: Omit<RevealProps, "preset">) => <ScrollReveal {...p} preset="blurReveal" />;
export const ScaleReveal = (p: Omit<RevealProps, "preset">) => <ScrollReveal {...p} preset="scaleReveal" />;

/* ============================================================
   HeroReveal — parent that staggers direct children.
   Use with <HeroReveal.Item> inside.
   ============================================================ */
function HeroRevealRoot({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={variants.stagger}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

function HeroRevealItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion(Tag as any);
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <MotionTag className={className} variants={variants.staggerChild}>
      {children}
    </MotionTag>
  );
}

export const HeroReveal = Object.assign(HeroRevealRoot, { Item: HeroRevealItem });

/* ============================================================
   SectionTransition — larger in-view reveal for sections.
   ============================================================ */
export function SectionTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <section className={className}>{children}</section>;
  return (
    <motion.section
      className={className}
      variants={variants.section}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.section>
  );
}

/* ============================================================
   CardHover — subtle lift + accent glow + optional 3D tilt.
   ============================================================ */
type CardHoverProps = ComponentPropsWithoutRef<"div"> & {
  tilt?: boolean;
  glow?: boolean;
  lift?: number;
};

export const CardHover = forwardRef<HTMLDivElement, CardHoverProps>(function CardHover(
  { tilt = false, glow = true, lift = 4, className, children, ...rest },
  ref,
) {
  const reduce = useReducedMotion();
  const localRef = useRef<HTMLDivElement | null>(null);
  const setRefs = (el: HTMLDivElement | null) => {
    localRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as any).current = el;
  };
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, spring.magnetic);
  const sry = useSpring(ry, spring.magnetic);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !tilt || !localRef.current) return;
    const r = localRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 6);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={setRefs}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={reduce ? undefined : { y: -lift }}
      transition={t.base}
      style={tilt ? { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" } : undefined}
      className={clsx(
        "relative transition-shadow duration-400",
        glow && "hover:[box-shadow:var(--elevation-3),var(--elevation-accent)]",
        className,
      )}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
});

/* ============================================================
   ImageHover — zoom + soft brightness on hover of parent.
   Wrap an <img> or background element.
   ============================================================ */
export function ImageHover({
  src,
  alt,
  className,
  scale = 1.06,
  children,
}: {
  src?: string;
  alt?: string;
  className?: string;
  scale?: number;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={clsx("group relative overflow-hidden", className)}>
      {src ? (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          initial={false}
          whileHover={reduce ? undefined : { scale }}
          transition={{ duration: duration.slower, ease: ease.out }}
          className="h-full w-full object-cover"
        />
      ) : (
        children
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[var(--color-accent-wash)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>
  );
}

/* ============================================================
   ButtonHover — press feedback + sheen sweep.
   ============================================================ */
type ButtonHoverProps = ComponentPropsWithoutRef<"button"> & { sheen?: boolean };

export const ButtonHover = forwardRef<HTMLButtonElement, ButtonHoverProps>(
  function ButtonHover({ sheen = true, className, children, ...rest }, ref) {
    const reduce = useReducedMotion();
    return (
      <motion.button
        ref={ref}
        whileHover={reduce ? undefined : { y: -1 }}
        whileTap={reduce ? undefined : { scale: 0.98, y: 0 }}
        transition={t.fast}
        className={clsx(
          "group relative overflow-hidden inline-flex items-center gap-[var(--space-2)]",
          className,
        )}
        {...(rest as any)}
      >
        <span className="relative z-[1]">{children}</span>
        {sheen && !reduce && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100"
          />
        )}
      </motion.button>
    );
  },
);

/* ============================================================
   CursorGlow — spotlight that follows the cursor within a container.
   ============================================================ */
export function CursorGlow({
  className,
  size = 320,
  color = "var(--color-accent-glow)",
  children,
}: {
  className?: string;
  size?: number;
  color?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000, on: false });
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos((p) => ({ ...p, on: false }))}
      className={clsx("relative overflow-hidden", className)}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: pos.on ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 60%)`,
        }}
      />
    </div>
  );
}

/* ============================================================
   ProgressBar — reading / scroll progress. Also supports a
   controlled `value` (0–1) for step/loading indicators.
   ============================================================ */
export function ProgressBar({
  value,
  className,
  height = 2,
  color = "var(--color-accent)",
  track = "transparent",
}: {
  value?: number;
  className?: string;
  height?: number;
  color?: string;
  track?: string;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const controlled = typeof value === "number";

  return (
    <div
      className={clsx("relative w-full", className)}
      style={{ height, background: track }}
      role={controlled ? "progressbar" : undefined}
      aria-valuenow={controlled ? Math.round((value as number) * 100) : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        style={controlled ? { scaleX: value, transformOrigin: "0% 50%", background: color } : { scaleX, transformOrigin: "0% 50%", background: color }}
        className="h-full w-full"
      />
    </div>
  );
}

/* ============================================================
   LoadingSkeleton — shimmering block. Tokenized.
   ============================================================ */
export function LoadingSkeleton({
  className,
  rounded = "var(--radius-md)",
}: {
  className?: string;
  rounded?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={clsx("relative overflow-hidden bg-[var(--color-elevated)]", className)}
      style={{ borderRadius: rounded }}
      aria-hidden
    >
      {!reduce && (
        <motion.span
          className="absolute inset-0"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-text) 8%, transparent), transparent)",
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
   CounterAnimation — animated numeric counter for metrics.
   ============================================================ */
export function CounterAnimation({
  value,
  duration: dur = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(value * eased);
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
          }
        });
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, dur, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ============================================================
   Parallax — small helper for subtle scroll-based translate.
   ============================================================ */
export function Parallax({
  amount = 40,
  className,
  children,
}: {
  amount?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* Re-export the existing PageTransition + MagneticButton for a single import surface. */
export { PageTransition } from "@/components/PageTransition";
export { MagneticButton } from "@/components/MagneticButton";
export { Reveal } from "@/components/Reveal";
