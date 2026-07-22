import { supabase } from "@/integrations/supabase/client";
import type { ProjectRow } from "@/lib/cms";

const TOKEN_KEY = "portfolio_project_access_token";
const EXP_KEY = "portfolio_project_access_expires";

export function getStoredAccessToken(): string | null {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const exp = Number(sessionStorage.getItem(EXP_KEY) ?? 0);
    if (!token || !exp) return null;
    if (Date.now() >= exp) {
      clearAccessToken();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function storeAccessToken(token: string, expiresAt: number) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(EXP_KEY, String(expiresAt));
  } catch {
    /* ignore */
  }
}

export function clearAccessToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXP_KEY);
  } catch {
    /* ignore */
  }
}

export type AccessStatus = {
  enabled: boolean;
  configured: boolean;
  session_duration_hours: number;
  password_version: number;
  updated_at: string | null;
};

export async function fetchAccessStatus(): Promise<AccessStatus | null> {
  const { data, error } = await supabase.rpc("get_project_access_status");
  if (error) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return (row as AccessStatus) ?? null;
}

export async function verifyPassword(password: string): Promise<
  | { ok: true; token: string; expiresAt: number; disabled?: boolean }
  | { ok: false; error: "invalid_password" | "rate_limited" | "not_configured" | "network" }
> {
  try {
    const { data, error } = await supabase.functions.invoke("verify-project-password", {
      body: { password },
    });
    if (error) {
      const status = (error as { context?: { status?: number } }).context?.status;
      if (status === 429) return { ok: false, error: "rate_limited" };
      if (status === 401) return { ok: false, error: "invalid_password" };
      if (status === 503) return { ok: false, error: "not_configured" };
      return { ok: false, error: "network" };
    }
    if (!data?.token) return { ok: false, error: "network" };
    return { ok: true, token: data.token, expiresAt: data.expires_at, disabled: data.disabled };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function fetchProtectedProject(
  slug: string,
): Promise<
  | { ok: true; project: ProjectRow }
  | { ok: false; error: "unauthorized" | "not_found" | "network" }
> {
  const token = getStoredAccessToken();
  try {
    const { data, error } = await supabase.functions.invoke("get-protected-project", {
      body: { slug },
      headers: token ? { "x-project-access-token": token } : {},
    });
    if (error) {
      const status = (error as { context?: { status?: number } }).context?.status;
      if (status === 401) return { ok: false, error: "unauthorized" };
      if (status === 404) return { ok: false, error: "not_found" };
      return { ok: false, error: "network" };
    }
    if (!data?.project) return { ok: false, error: "not_found" };
    return { ok: true, project: data.project as ProjectRow };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function setProjectPassword(input: {
  password?: string;
  enabled?: boolean;
  session_duration_hours?: number;
}): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.functions.invoke("set-project-password", { body: input });
  if (error) return { ok: false, error: (error as Error).message };
  return { ok: true };
}
