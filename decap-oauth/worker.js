/**
 * Decap CMS ↔ GitHub OAuth proxy for Cloudflare Workers.
 *
 * Deploy this Worker once, then paste its URL into
 * `public/admin/config.yml → backend.base_url`.
 *
 * Two endpoints:
 *   GET /auth       → redirects the user to GitHub for authorization
 *   GET /callback   → exchanges the code for a token, posts it back
 *                     to Decap via window.opener.postMessage
 *
 * Required environment (set via `wrangler secret put`):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 *
 * Optional vars:
 *   SCOPE            (default: "repo,user")
 *   ALLOWED_ORIGIN   (default: "*", e.g. "https://your-site.pages.dev")
 */

const html = (body) =>
  new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const scope = env.SCOPE || "repo,user";
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";

    // ── 1. Kick off OAuth flow ────────────────────────────────
    if (url.pathname === "/auth") {
      const redirectUri = `${url.origin}/callback`;
      const state = crypto.randomUUID();
      const authorize = new URL("https://github.com/login/oauth/authorize");
      authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorize.searchParams.set("redirect_uri", redirectUri);
      authorize.searchParams.set("scope", scope);
      authorize.searchParams.set("state", state);
      return Response.redirect(authorize.toString(), 302);
    }

    // ── 2. Handle GitHub callback ─────────────────────────────
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code", { status: 400 });

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();
      const status = data.access_token ? "success" : "error";
      const payload = data.access_token
        ? { token: data.access_token, provider: "github" }
        : { error: data.error || "no_token", details: data };

      // Decap listens for a message shaped as: "authorization:github:<status>:<json>"
      const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
      const origin = JSON.stringify(allowedOrigin);
      const body = `<!doctype html>
<html><head><meta charset="utf-8"><title>Auth</title></head>
<body style="font-family:system-ui;background:#0b0b0c;color:#fafaf7;display:grid;place-items:center;height:100vh;margin:0">
<p>Signing you in…</p>
<script>
(function () {
  function send(e) {
    if (!e.data || typeof e.data !== "string" || e.data !== "authorizing:github") return;
    window.removeEventListener("message", send);
    (e.source || window.opener).postMessage(${JSON.stringify(message)}, ${origin});
  }
  window.addEventListener("message", send);
  (window.opener || window.parent).postMessage("authorizing:github", ${origin});
})();
</script>
</body></html>`;
      return html(body);
    }

    // ── 3. Health check ───────────────────────────────────────
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response("Decap OAuth proxy · OK", { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  },
};
