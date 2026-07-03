import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { writeFileSync, copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Small plugin: after build, emit sitemap.xml and copy index.html -> 404.html
// for GitHub Pages SPA deep-link fallback.
function ghPagesStatic() {
  return {
    name: "gh-pages-static",
    apply: "build" as const,
    closeBundle() {
      const outDir = resolve(process.cwd(), "dist");
      const indexPath = resolve(outDir, "index.html");
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, resolve(outDir, "404.html"));
      }
      // Read project index to build sitemap
      // Kept intentionally simple: home + static routes + one entry per project slug.
      const site = process.env.VITE_SITE_URL ?? "";
      const staticRoutes = ["/", "/work", "/about", "/contact"];
      // Import lazily to avoid ESM/CJS friction
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const projects: { slug: string }[] = require("./content/projects/_index.json");
      const urls = [
        ...staticRoutes,
        ...projects.map((p) => `/projects/${p.slug}`),
      ]
        .map(
          (path) =>
            `  <url><loc>${site}${path}</loc><changefreq>monthly</changefreq></url>`,
        )
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
      writeFileSync(resolve(outDir, "sitemap.xml"), xml);
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss(), tsconfigPaths(), ghPagesStatic()],
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
});
