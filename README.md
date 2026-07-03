# Aman Mishra — Portfolio

A minimal, motion-forward portfolio built as a React Router SPA. Static, deployable to GitHub Pages.

## Stack

- React 19 + Vite + TypeScript
- React Router 7 (SPA)
- Tailwind CSS v4
- Framer Motion + Lenis smooth scroll
- react-helmet-async for per-route SEO
- Content lives in `content/` as JSON — no code changes required to add a project

## Local development

```bash
bun install     # or: npm install
bun run dev     # or: npm run dev
```

Dev server runs on port 8080.

## Build

```bash
bun run build     # or: npm run build
bun run preview
```

The build output goes to `dist/` and includes:

- `index.html` — the SPA entry
- `404.html` — a copy of `index.html` so GitHub Pages serves the SPA on deep links
- `sitemap.xml` — generated from `content/projects/_index.json` + static routes
- `robots.txt`

## Adding a case study

1. Duplicate any file in `content/projects/*.json` and rename it `<slug>.json`.
2. Fill in the fields (title, company, role, metrics, sections, etc.).
3. Add an entry to `content/projects/_index.json` with the slug, `featured`, and `order`.

That's it. No React components need editing.

Editable site-wide content:
- `content/site.json` — name, role, socials, email, availability
- `content/experience.json`, `content/skills.json`, `content/testimonials.json`

## Deploying to GitHub Pages

### Option A — Project page (`https://<user>.github.io/<repo>/`)

The site needs to know its base path. Set `VITE_BASE` at build time:

```bash
VITE_BASE=/<repo>/ bun run build
```

Then push `dist/` to the `gh-pages` branch, or use the included GitHub Action:

1. Push this repo to GitHub.
2. In **Settings → Pages**, set source to **GitHub Actions**.
3. Edit `.github/workflows/deploy.yml` and set the `VITE_BASE` env to `/<your-repo-name>/`.
4. Push to `main`. The workflow builds and publishes automatically.

### Option B — User/Org page or custom domain (`https://you.dev/`)

Leave `VITE_BASE` unset. Build and publish `dist/` as before. For a custom
domain, add a `public/CNAME` file with your domain.

### SEO — set your site URL

Before your first deploy, set `VITE_SITE_URL` so the generated sitemap uses
absolute URLs:

```bash
VITE_SITE_URL=https://amanmishra.design VITE_BASE=/ bun run build
```

## Deferred (not in this build)

`/process`, `/playground`, `/resume` routes, command palette (⌘K), image
lightbox, theme toggle, cursor follower, and search. All are additive on top
of this scaffold.

## License

MIT — see [LICENSE](./LICENSE).
