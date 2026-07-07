import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBlogs } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Newspaper, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminToolbar, ToolbarChip } from "@/components/admin/AdminToolbar";
import { EmptyState, LoadingRows, BulkActionBar } from "@/components/admin/EmptyState";
import { clsx } from "clsx";

type Filter = "all" | "published" | "draft";

export default function BlogList() {
  const { data, isLoading } = useBlogs(false);
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState<string | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const list = data ?? [];
    return {
      all: list.length,
      published: list.filter((b: any) => b.published).length,
      draft: list.filter((b: any) => !b.published).length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((b: any) => {
      if (filter === "published" && !b.published) return false;
      if (filter === "draft" && b.published) return false;
      if (!q) return true;
      return [b.title, b.excerpt, b.slug].filter(Boolean).some((v: string) => v.toLowerCase().includes(q));
    });
  }, [data, search, filter]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["blogs"] });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
      setConfirm(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkPublish = useMutation({
    mutationFn: async (published: boolean) => {
      const ids = Array.from(selected);
      const patch: any = { published };
      if (published) patch.published_at = new Date().toISOString();
      const { error } = await supabase.from("blogs").update(patch).in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      toast.success(v ? "Published" : "Unpublished");
      setSelected(new Set());
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkDelete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("blogs").delete().in("id", Array.from(selected));
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      setSelected(new Set());
      setBulkConfirm(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleSelect = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allSelected = filtered.length > 0 && filtered.every((b: any) => selected.has(b.id));

  return (
    <AdminPage
      eyebrow="Writing"
      title="Blog posts"
      description="Publish essays, notes, and case studies."
      actions={
        <Button asChild>
          <Link to="/admin/blog/new">
            <Plus size={16} /> New post
          </Link>
        </Button>
      }
      wide
    >
      <AdminToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search posts by title or excerpt…"
        filters={
          <>
            <ToolbarChip active={filter === "all"} onClick={() => setFilter("all")} count={counts.all}>
              All
            </ToolbarChip>
            <ToolbarChip
              active={filter === "published"}
              onClick={() => setFilter("published")}
              count={counts.published}
            >
              Published
            </ToolbarChip>
            <ToolbarChip
              active={filter === "draft"}
              onClick={() => setFilter("draft")}
              count={counts.draft}
            >
              Drafts
            </ToolbarChip>
          </>
        }
      />

      {filtered.length > 0 && (
        <div className="mb-2 flex items-center gap-3 px-3 text-xs text-neutral-500">
          <Checkbox
            checked={allSelected}
            onCheckedChange={() =>
              setSelected(allSelected ? new Set() : new Set(filtered.map((b: any) => b.id)))
            }
            aria-label="Select all"
          />
          <span>Select all in view</span>
        </div>
      )}

      {isLoading ? (
        <LoadingRows count={3} height={80} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={search || filter !== "all" ? "No matches" : "No posts yet"}
          description={
            search || filter !== "all" ? "Try a different search." : "Publish your first blog post."
          }
          actionLabel={search || filter !== "all" ? undefined : "Write a post"}
          actionTo="/admin/blog/new"
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((b: any) => (
            <li key={b.id}>
              <div
                className={clsx(
                  "flex items-center gap-3 rounded-lg border bg-white p-3 transition-all",
                  selected.has(b.id)
                    ? "border-neutral-900 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300",
                )}
              >
                <Checkbox
                  checked={selected.has(b.id)}
                  onCheckedChange={() => toggleSelect(b.id)}
                  aria-label={`Select ${b.title}`}
                />
                {b.cover_url && (
                  <div
                    className="h-12 w-16 shrink-0 rounded border border-neutral-200"
                    style={{ background: `center/cover url(${b.cover_url})` }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display text-base text-neutral-900">{b.title}</p>
                    {b.published ? (
                      <Badge className="h-5 px-1.5 text-[10px]">Published</Badge>
                    ) : (
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="line-clamp-1 text-xs text-neutral-500">{b.excerpt || b.slug}</p>
                </div>
                <div className="flex items-center">
                  {b.published && (
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <Link to={`/blog/${b.slug}`} target="_blank" aria-label="View">
                        <ExternalLink size={14} />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <Link to={`/admin/blog/${b.id}`} aria-label="Edit">
                      <Pencil size={14} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-500 hover:text-red-600"
                    onClick={() => setConfirm(b.id)}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => bulkPublish.mutate(true)}
          className="rounded-full text-white hover:bg-white/10 hover:text-white"
        >
          <Eye size={13} /> Publish
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => bulkPublish.mutate(false)}
          className="rounded-full text-white hover:bg-white/10 hover:text-white"
        >
          <EyeOff size={13} /> Unpublish
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBulkConfirm(true)}
          className="rounded-full text-red-300 hover:bg-red-500/20 hover:text-red-200"
        >
          <Trash2 size={13} /> Delete
        </Button>
      </BulkActionBar>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => confirm && del.mutate(confirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkConfirm} onOpenChange={setBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} posts?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => bulkDelete.mutate()}
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}
