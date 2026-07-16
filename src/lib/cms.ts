import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  overview: string | null;
  problem_statement: string | null;
  research: string | null;
  design_process: string | null;
  solution: string | null;
  outcome: string | null;
  learnings: string | null;
  role: string | null;
  duration: string | null;
  company: string | null;
  tools: string[];
  tags: string[];
  category: string | null;
  timeline: string | null;
  thumbnail_url: string | null;
  gallery: { url: string; caption?: string }[];
  links: { label: string; url: string }[];
  metrics: { label: string; value: string; hint?: string }[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  name: string | null;
  tagline: string | null;
  bio: string | null;
  email: string | null;
  location: string | null;
  profile_image_url: string | null;
  resume_url: string | null;
  socials: { label: string; url: string }[];
};

// ─────────────────────── Editable content blocks ───────────────────────
export type ContentKey =
  | "nav" | "footer" | "hero"
  | "home_featured" | "home_experience" | "home_stats"
  | "home_testimonials" | "home_faq" | "home_cta"
  | "about_hero" | "about_timeline" | "about_experience" | "about_education"
  | "about_tools" | "about_philosophy" | "about_working_style"
  | "about_books" | "about_values" | "about_fun_facts"
  | "contact_page";

export function useContent<T = any>(key: ContentKey, fallback?: T) {
  const q = useQuery({
    queryKey: ["content_block", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_blocks" as any)
        .select("data")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return ((data as any)?.data ?? null) as T | null;
    },
  });
  return { ...q, data: (q.data ?? fallback ?? null) as T };
}

export function useAllContent() {
  return useQuery({
    queryKey: ["content_blocks_all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("content_blocks" as any).select("*");
      if (error) throw error;
      const map: Record<string, any> = {};
      for (const row of (data ?? []) as any[]) map[row.key] = row.data;
      return map;
    },
  });
}

export function useSite() {
  return useQuery({
    queryKey: ["site"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return (data as any) ?? {
        name: "", tagline: "", bio: "", email: "", location: "",
        profile_image_url: null, resume_url: null, socials: [],
      };
    },
  });
}

export function useProjects(opts: { publishedOnly?: boolean; featuredOnly?: boolean } = {}) {
  return useQuery({
    queryKey: ["projects", opts],
    queryFn: async () => {
      let q = supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (opts.publishedOnly) q = q.eq("published", true);
      if (opts.featuredOnly) q = q.eq("featured", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as ProjectRow[];
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as unknown as ProjectRow | null;
    },
    enabled: !!slug,
  });
}

export function useExperience() {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experience").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEducation() {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase.from("education").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      // Group
      const groups: Record<string, string[]> = {};
      for (const row of data ?? []) {
        groups[row.group_name] ??= [];
        groups[row.group_name].push(row.name);
      }
      return Object.entries(groups).map(([group, items]) => ({ group, items }));
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBlogs(publishedOnly = true) {
  return useQuery({
    queryKey: ["blogs", publishedOnly],
    queryFn: async () => {
      let q = supabase.from("blogs").select("*").order("published_at", { ascending: false, nullsFirst: false });
      if (publishedOnly) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Storage: create a long-lived signed URL. Buckets are private per workspace policy.
export async function signedUrl(bucket: string, path: string, expiresIn = 60 * 60 * 24 * 365) {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}

export async function uploadFile(bucket: string, file: File, prefix = "") {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${prefix}${prefix ? "/" : ""}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const url = await signedUrl(bucket, path);
  return { path, url: url ?? "" };
}

// Fallback gradient for projects without a thumbnail
export const projectGradient = (seed: string) => {
  const gradients = [
    // Warm sand → clay
    "radial-gradient(120% 100% at 12% 8%, #F5EFE3 0%, #D8C4A5 45%, #8A6B47 100%)",
    // Terracotta → rust
    "linear-gradient(135deg, #F2D7C4 0%, #C97B5A 55%, #6B2E1F 100%)",
    // Sage → forest
    "radial-gradient(130% 100% at 78% 18%, #E3EBE0 0%, #9AB3A2 45%, #2F4A3F 100%)",
    // Indigo → deep navy
    "linear-gradient(155deg, #E4E1EE 0%, #7C7CAE 50%, #1F2247 100%)",
    // Ochre → oxblood
    "radial-gradient(120% 100% at 25% 85%, #F0DDB5 0%, #C89A4A 45%, #5B2A1E 100%)",
    // Slate → charcoal
    "linear-gradient(140deg, #E8E6E0 0%, #7A7B78 50%, #1A1A1A 100%)",
    // Mauve → plum
    "radial-gradient(120% 100% at 68% 25%, #F0E4EA 0%, #B58AA0 45%, #4A2540 100%)",
    // Ink teal
    "linear-gradient(145deg, #DCE7E6 0%, #4E7A78 55%, #123032 100%)",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return gradients[h % gradients.length];
};

