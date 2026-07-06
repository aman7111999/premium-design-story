import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import { writeFileSync, copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Public Supabase connection values (anon key; safe for client bundle).
const DEFAULT_SUPABASE_URL = "https://wqaduhgfqgdcejrbzzuc.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxYWR1aGdmcWdkY2VqcmJ6enVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNTc3MzIsImV4cCI6MjA5ODgzMzczMn0.hyVwYDZ5si7ok5YAUi8urePfID34M3dRM2pwIjdPh0c";

// Post-build: emit sitemap.xml, copy index.html -> 404.html for GH Pages SPA fallback.
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
      const site = process.env.VITE_SITE_URL ?? "";
      const staticRoutes = ["/", "/work", "/about", "/contact"];
      const urls = staticRoutes
        .map((path) => `  <url><loc>${site}${path}</loc><changefreq>monthly</changefreq></url>`)
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    base: process.env.VITE_BASE ?? "/",
    plugins: [react(), tailwindcss(), tsconfigPaths(), mcpPlugin(), ghPagesStatic()],
    server: { host: "::", port: 8080, strictPort: true },
    preview: { host: "::", port: 8080, strictPort: true },
    define: {
      // Fallbacks so Vercel (or any build env without a .env file) still works.
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY
      ),
    },
  };
});
