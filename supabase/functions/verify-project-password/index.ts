import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import bcrypt from "npm:bcryptjs@2.4.3";
import { signAccessToken, hashKey } from "../_shared/token.ts";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 10;
const LOCKOUT_MINUTES = 15;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("PROJECT_ACCESS_TOKEN_SECRET");
  if (!secret) return json({ error: "Server misconfigured" }, 500);

  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!password) return json({ error: "Password required" }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  const keyHash = await hashKey(`${ip}|${ua}`, secret);

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { data: recent, error: recentErr } = await admin
    .from("project_access_attempts")
    .select("success, created_at")
    .eq("key_hash", keyHash)
    .gte("created_at", windowStart)
    .order("created_at", { ascending: false })
    .limit(20);
  if (recentErr) return json({ error: "Service unavailable" }, 503);

  const failed = (recent ?? []).filter((r) => !r.success);
  if (failed.length >= MAX_ATTEMPTS) {
    const oldest = failed[failed.length - 1];
    const unlockAt = new Date(new Date(oldest.created_at).getTime() + LOCKOUT_MINUTES * 60_000);
    if (unlockAt > new Date()) return json({ error: "rate_limited" }, 429);
  }

  const { data: settings } = await admin
    .from("project_access_settings")
    .select("enabled, password_hash, password_version, session_duration_hours")
    .eq("id", 1)
    .maybeSingle();

  const now = Math.floor(Date.now() / 1000);

  if (!settings?.enabled) {
    const exp = now + 3600;
    const token = await signAccessToken(
      { scope: "portfolio_projects", iat: now, exp, pv: settings?.password_version ?? 1 },
      secret,
    );
    return json({ token, expires_at: exp * 1000, disabled: true });
  }

  if (!settings.password_hash) return json({ error: "not_configured" }, 503);

  const ok = await bcrypt.compare(password, settings.password_hash);
  await admin.from("project_access_attempts").insert({ key_hash: keyHash, success: ok });
  if (!ok) return json({ error: "invalid_password" }, 401);

  const exp = now + settings.session_duration_hours * 3600;
  const token = await signAccessToken(
    { scope: "portfolio_projects", iat: now, exp, pv: settings.password_version },
    secret,
  );
  return json({ token, expires_at: exp * 1000 });
});
