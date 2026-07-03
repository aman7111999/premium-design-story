# Decap CMS ↔ GitHub OAuth proxy (Cloudflare Worker)

This tiny Worker (about 80 lines of JS) is the only backend piece your portfolio
needs. It lets **Decap CMS** — which runs entirely in the browser at
`/admin` on your GitHub-Pages-hosted site — sign you in with GitHub and commit
your edits back to the repo.

**Setup time:** ~5 minutes. **Cost:** free (Cloudflare Workers free tier).

---

## One-time setup

### 1. Create a GitHub OAuth App

1. Go to <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name:** `Portfolio CMS` (anything you like)
   - **Homepage URL:** the URL where your published site will live
     (e.g. `https://your-username.github.io/portfolio` or your custom domain).
   - **Authorization callback URL:** leave as `https://placeholder.workers.dev/callback`
     for now — you'll update it in step 4 once you know the Worker URL.
3. Click **Register application**.
4. On the next screen click **Generate a new client secret**.
5. Keep this tab open — you need the **Client ID** and **Client Secret** in step 3.

### 2. Install Wrangler

```bash
npm i -g wrangler
wrangler login
```

That opens a browser tab and links Wrangler to your (free) Cloudflare account.
Create an account at <https://dash.cloudflare.com/sign-up> first if you don't have one.

### 3. Deploy the Worker

From inside this `decap-oauth/` folder:

```bash
# Store the two GitHub OAuth secrets — Wrangler prompts for each value
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET

# Ship it
wrangler deploy
```

Wrangler prints a URL like `https://decap-oauth.<your-account>.workers.dev`.
**Copy it.**

### 4. Point GitHub back at the Worker

Return to your GitHub OAuth App settings and change the **Authorization callback URL** to:

```
https://decap-oauth.<your-account>.workers.dev/callback
```

Save.

### 5. Point Decap at the Worker

Open `public/admin/config.yml` in your repo and replace the two placeholders:

```yaml
backend:
  name: github
  repo: your-username/your-repo          # ← your repo
  branch: main
  base_url: https://decap-oauth.<your-account>.workers.dev   # ← the Worker URL from step 3
  auth_endpoint: auth
```

Commit + push. GitHub Actions rebuilds the site.

### 6. Sign in

Visit `https://your-site/admin/`. Click **Login with GitHub**. Approve.
You now have a full CMS in your browser — every save commits directly to `main`.

---

## Tightening security

Once everything works, edit `wrangler.toml` and change:

```toml
[vars]
ALLOWED_ORIGIN = "https://your-published-site"
```

Then `wrangler deploy` again. That restricts the OAuth postMessage to your site's
origin only.

---

## Troubleshooting

| Symptom | Likely fix |
|---|---|
| Login popup closes with `error: no_token` | Client ID / secret typo. Re-run `wrangler secret put`. |
| GitHub says "redirect_uri mismatch" | The callback URL in the OAuth App must exactly match `<worker-url>/callback`. |
| Decap loads but 404 on save | `repo:` in `config.yml` is wrong, or your GitHub user doesn't have push access. |
| `/admin` shows a blank page | Confirm `public/admin/index.html` was published (check `dist/admin/`). |
