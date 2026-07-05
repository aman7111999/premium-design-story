import { createClient } from "@supabase/supabase-js";

// Runtime Supabase client. In the MCP edge function these are available via Deno.env.
// In the local Vite bundle, they come from import.meta.env.
const SUPABASE_URL =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno.env.get("SUPABASE_URL")) ||
  (import.meta as any).env?.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno.env.get("SUPABASE_ANON_KEY")) ||
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY;

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

export type ProjectSummary = {
  slug: string;
  title: string;
  company: string | null;
  role: string | null;
  duration: string | null;
  timeline: string | null;
  category: string | null;
  summary: string | null;
  featured: boolean;
  metrics: { label: string; value: string }[];
  url: string;
};

export type ProjectFull = ProjectSummary & { body: string };

export async function fetchProjects(opts: { featuredOnly?: boolean } = {}): Promise<ProjectSummary[]> {
  let q = sb.from("projects").select("slug,title,company,role,duration,timeline,category,short_description,featured,metrics").eq("published", true).order("sort_order");
  if (opts.featuredOnly) q = q.eq("featured", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((p: any) => ({
    slug: p.slug,
    title: p.title,
    company: p.company,
    role: p.role,
    duration: p.duration,
    timeline: p.timeline,
    category: p.category,
    summary: p.short_description,
    featured: p.featured,
    metrics: p.metrics ?? [],
    url: `/projects/${p.slug}`,
  }));
}

export async function fetchProject(slug: string): Promise<ProjectFull | null> {
  const { data, error } = await sb.from("projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const p: any = data;
  const body = [
    p.overview, p.problem_statement, p.research, p.design_process, p.solution, p.outcome, p.learnings,
  ].filter(Boolean).join("\n\n---\n\n");
  return {
    slug: p.slug, title: p.title, company: p.company, role: p.role, duration: p.duration,
    timeline: p.timeline, category: p.category, summary: p.short_description, featured: p.featured,
    metrics: p.metrics ?? [], url: `/projects/${p.slug}`, body,
  };
}

export async function fetchSiteInfo() {
  const { data } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? {};
}

export async function fetchExperience() {
  const { data } = await sb.from("experience").select("*").eq("published", true).order("sort_order");
  return data ?? [];
}

export async function fetchSkills() {
  const { data } = await sb.from("skills").select("*").order("sort_order");
  const groups: Record<string, string[]> = {};
  for (const row of data ?? []) (groups[row.group_name] ??= []).push(row.name);
  return Object.entries(groups).map(([group, items]) => ({ group, items }));
}
