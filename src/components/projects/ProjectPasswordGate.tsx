import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { verifyPassword, storeAccessToken } from "@/lib/projectAccess";
import { useContent } from "@/lib/cms";

type Copy = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  password_label?: string;
  password_placeholder?: string;
  unlock_button_label?: string;
  unlocking_label?: string;
  invalid_password_message?: string;
  rate_limit_message?: string;
  not_configured_message?: string;
  network_error_message?: string;
  back_to_projects_label?: string;
};

const DEFAULTS: Required<Copy> = {
  eyebrow: "Protected",
  heading: "Protected case studies",
  description:
    "These case studies contain confidential product work. Enter the access password shared with you to continue.",
  password_label: "Access password",
  password_placeholder: "Enter password",
  unlock_button_label: "Unlock projects",
  unlocking_label: "Unlocking…",
  invalid_password_message: "The password is incorrect. Please check it and try again.",
  rate_limit_message: "Too many attempts. Please wait a few minutes before trying again.",
  not_configured_message:
    "Project access hasn’t been configured yet. Please check back shortly.",
  network_error_message: "Something went wrong. Please try again.",
  back_to_projects_label: "Back to Projects",
};

export function ProjectPasswordGate({ onUnlocked }: { onUnlocked: () => void }) {
  const reduce = useReducedMotion();
  const { data: cmsCopy } = useContent<Copy>("project_access_content" as never, DEFAULTS);
  const copy = { ...DEFAULTS, ...(cmsCopy ?? {}) };

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    const res = await verifyPassword(password);
    setBusy(false);
    if (res.ok) {
      storeAccessToken(res.token, res.expiresAt);
      onUnlocked();
      return;
    }
    const map: Record<string, string> = {
      invalid_password: copy.invalid_password_message,
      rate_limited: copy.rate_limit_message,
      not_configured: copy.not_configured_message,
      network: copy.network_error_message,
    };
    setError(map[res.error] ?? copy.network_error_message);
    setShake((n) => n + 1);
    setPassword("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <section className="container-page grid min-h-[80vh] place-items-center py-16">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        key={shake}
        {...(!reduce && shake > 0
          ? { animate: { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] } }
          : {})}
        className="w-full max-w-[440px] rounded-[var(--radius-xl)] border border-hairline bg-[var(--color-card)] p-8 shadow-[var(--elevation-2)] backdrop-blur-xl md:p-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-[var(--color-elevated)] text-[var(--color-accent)]">
            <Lock size={18} aria-hidden />
          </span>
          <div>
            <p className="eyebrow text-[var(--color-muted)]">{copy.eyebrow}</p>
            <h1 className="mt-1 font-display text-[22px] leading-tight tracking-tight text-[var(--color-text)] md:text-[26px]">
              {copy.heading}
            </h1>
          </div>
        </div>

        <p className="mb-6 text-[15px] leading-relaxed text-[var(--color-muted)]">
          {copy.description}
        </p>

        <form onSubmit={submit} noValidate>
          <label htmlFor="project-access-password" className="mb-2 block text-[13px] font-medium text-[var(--color-text)]">
            {copy.password_label}
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="project-access-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={copy.password_placeholder}
              aria-invalid={!!error}
              aria-describedby={error ? "project-access-error" : undefined}
              className="w-full rounded-[var(--radius-md)] border border-hairline bg-[var(--color-elevated)] px-4 py-3 pr-11 text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-subtle)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-ring,rgba(109,94,248,0.35))]"
              disabled={busy}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <p
            id="project-access-error"
            role="alert"
            aria-live="polite"
            className={`mt-3 min-h-[20px] text-[13px] ${error ? "text-[var(--color-danger,#e5484d)]" : "text-transparent"}`}
          >
            {error ?? "placeholder"}
          </p>

          <button
            type="submit"
            disabled={busy || !password}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] text-[15px] font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" /> {copy.unlocking_label}
              </>
            ) : (
              copy.unlock_button_label
            )}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <Link
            to="/work"
            className="inline-flex min-h-[44px] items-center gap-2 text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={14} /> {copy.back_to_projects_label}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
