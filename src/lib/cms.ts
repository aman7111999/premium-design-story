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
    "radial-gradient(120% 100% at 10% 0%, #F1EDE4 0%, #D9D3C4 45%, #B8AF9C 100%)",
    "radial-gradient(120% 100% at 80% 20%, #F5E9E2 0%, #E5C7B8 40%, #8C6A5C 100%)",
    "radial-gradient(120% 100% at 20% 80%, #E7EDE7 0%, #B6C5BE 40%, #3F5A55 100%)",
    "radial-gradient(120% 100% at 60% 30%, #EDEAF3 0%, #C6BEDA 40%, #4E4570 100%)",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return gradients[h % gradients.length];
};
