import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FolderKanban,
  Newspaper,
  Briefcase,
  MessageSquareQuote,
  Plus,
  ArrowUpRight,
  MailOpen,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { LoadingRows } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";

async function count(
  table: "projects" | "blogs" | "experience" | "testimonials" | "contact_inquiries",
) {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

async function countPublished(table: "projects" | "blogs") {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("published", true);
  return count ?? 0;
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => ({
      projects: await count("projects"),
      projectsPub: await countPublished("projects"),
      blogs: await count("blogs"),
      blogsPub: await countPublished("blogs"),
      experience: await count("experience"),
      testimonials: await count("testimonials"),
      inquiries: await count("contact_inquiries"),
    }),
  });

  const { data: recentProjects } = useQuery({
    queryKey: ["admin-recent-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, slug, published, updated_at, thumbnail_url")
        .order("updated_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: recentInquiries } = useQuery({
    queryKey: ["admin-recent-inquiries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      return data ?? [];
    },
  });

  const stats = [
    {
      key: "projects",
      label: "Projects",
      icon: FolderKanban,
      to: "/admin/projects",
      total: data?.projects ?? 0,
      published: data?.projectsPub,
    },
    {
      key: "blogs",
      label: "Blog posts",
      icon: Newspaper,
      to: "/admin/blog",
      total: data?.blogs ?? 0,
      published: data?.blogsPub,
    },
    {
      key: "experience",
      label: "Experience",
      icon: Briefcase,
      to: "/admin/experience",
      total: data?.experience ?? 0,
    },
    {
      key: "testimonials",
      label: "Testimonials",
      icon: MessageSquareQuote,
      to: "/admin/testimonials",
      total: data?.testimonials ?? 0,
    },
  ];

  return (
    <AdminPage
      eyebrow="Dashboard"
      title="Welcome back"
      description="What's happening across your portfolio."
      wide
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/blog/new">
              <Plus size={14} /> New post
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/projects/new">
              <Plus size={14} /> New project
            </Link>
          </Button>
        </>
      }
    >
      {/* Stat grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.key}
            to={s.to}
            className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <s.icon size={16} className="text-neutral-400" />
              <ArrowUpRight
                size={14}
                className="text-neutral-300 transition-colors group-hover:text-neutral-900"
              />
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">{s.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl tabular-nums text-neutral-900">
                {isLoading ? "—" : s.total}
              </span>
              {typeof s.published === "number" && (
                <span className="text-xs text-neutral-500">
                  {s.published} published
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column: recent projects + inquiries */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-neutral-200 bg-white lg:col-span-2">
          <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="font-display text-lg text-neutral-900">Recent projects</h2>
            <Link
              to="/admin/projects"
              className="text-xs text-neutral-500 hover:text-neutral-900"
            >
              View all →
            </Link>
          </header>
          <div className="p-3">
            {isLoading ? (
              <LoadingRows count={3} height={56} />
            ) : (recentProjects ?? []).length === 0 ? (
              <p className="px-3 py-6 text-sm text-neutral-500">No projects yet.</p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {(recentProjects ?? []).map((p: any) => (
                  <li key={p.id}>
                    <Link
                      to={`/admin/projects/${p.id}`}
                      className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-neutral-50"
                    >
                      <div
                        className="h-10 w-14 shrink-0 rounded border border-neutral-200 bg-neutral-100"
                        style={{
                          background: p.thumbnail_url
                            ? `center/cover url(${p.thumbnail_url})`
                            : undefined,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900">{p.title}</p>
                        <p className="text-xs text-neutral-500">
                          {p.published ? "Published" : "Draft"} · updated{" "}
                          {new Date(p.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowUpRight size={14} className="text-neutral-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white">
          <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="font-display text-lg text-neutral-900">Inquiries</h2>
            <span className="text-xs text-neutral-500">{data?.inquiries ?? 0} total</span>
          </header>
          <div className="p-3">
            {(recentInquiries ?? []).length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-3 py-8 text-center text-neutral-500">
                <MailOpen size={20} />
                <p className="text-sm">No new inquiries.</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {(recentInquiries ?? []).map((q: any) => (
                  <li key={q.id} className="rounded-md px-3 py-2 hover:bg-neutral-50">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {q.name ?? q.email}
                    </p>
                    <p className="line-clamp-2 text-xs text-neutral-500">{q.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </AdminPage>
  );
}
