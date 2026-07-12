import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
type Mode = Theme | "system";
const STORAGE_KEY = "aman-theme";

type Ctx = {
  theme: Theme;
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode: Mode): Theme {
  return mode === "system" ? systemTheme() : mode;
}

function applyThemeToDom(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#1a1815" : "#faf8f5");
}

export function ThemeProvider({ children, defaultMode = "light" }: { children: ReactNode; defaultMode?: Mode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === "undefined") return defaultMode;
    return (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? defaultMode;
  });
  const [theme, setTheme] = useState<Theme>(() => resolveTheme(mode));

  useEffect(() => {
    const resolved = resolveTheme(mode);
    setTheme(resolved);
    applyThemeToDom(resolved);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const t = systemTheme();
      setTheme(t);
      applyThemeToDom(t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = (m: Mode) => {
    // Chromium view-transition for a smooth swap
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(() => setModeState(m));
    } else {
      setModeState(m);
    }
  };

  const toggle = () => setMode(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

/** Force a specific theme within a subtree (e.g. admin light-only). */
export function ThemeScope({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <div data-theme={theme} style={{ minHeight: "100%" }}>{children}</div>;
}
