import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Newspaper, Briefcase, MessageSquareQuote, ExternalLink } from "lucide-react";

async function count(table: "projects" | "blogs" | "experience" | "testimonials" | "contact_inquiries") {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => ({
      projects: await count("projects"),
      blogs: await count("blogs"),
      experience: await count("experience"),
      testimonials: await count("testimonials"),
      inquiries: await count("contact_inquiries"),
    }),
  });

  const stats = [
    { key: "projects", label: "Projects", icon: FolderKanban, to: "/admin/projects" },
    { key: "blogs", label: "Blog posts", icon: Newspaper, to: "/admin/blog" },
    { key: "experience", label: "Experience", icon: Briefcase, to: "/admin/experience" },
    { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote, to: "/admin/testimonials" },
  ] as const;

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Dashboard</p>
          <h1 className="font-display text-4xl mt-1">Overview</h1>
        </div>
        <Link to="/" target="_blank" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] inline-flex items-center gap-1">
          View site <ExternalLink size={14} />
        </Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.key} to={s.to}>
            <Card className="hover:border-[var(--color-ink)] transition-colors">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--color-muted)]">{s.label}</CardTitle>
                <s.icon size={16} className="text-[var(--color-muted)]" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="font-display text-3xl">{data?.[s.key]}</div>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-6 w-24" /> : (
              <p className="text-sm text-[var(--color-muted)]">
                {data?.inquiries ?? 0} total inquiries received.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
