import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  FolderKanban,
  EyeOff,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminToolbar, ToolbarChip } from "@/components/admin/AdminToolbar";
import { EmptyState, LoadingRows, BulkActionBar } from "@/components/admin/EmptyState";
import { SortableList } from "@/components/admin/SortableList";
import { clsx } from "clsx";

type Filter = "all" | "published" | "draft" | "featured";

export default function ProjectsList() {
  const { data: projects, isLoading } = useProjects();
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const list = projects ?? [];
    return {
      all: list.length,
      published: list.filter((p) => p.published).length,
      draft: list.filter((p) => !p.published).length,
      featured: list.filter((p) => p.featured).length,
    };
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      if (filter === "published" && !p.published) return false;
      if (filter === "draft" && p.published) return false;
      if (filter === "featured" && !p.featured) return false;
      if (!q) return true;
      return [p.title, p.company, p.category, p.slug]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [projects, search, filter]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["projects"] });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project deleted");
      invalidate();
      setConfirmId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkPublish = useMutation({
    mutationFn: async (published: boolean) => {
      const ids = Array.from(selected);
      const { error } = await supabase.from("projects").update({ published }).in("id", ids);
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
      const ids = Array.from(selected);
      const { error } = await supabase.from("projects").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      setSelected(new Set());
      setConfirmBulkDelete(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, idx) => ({ id, sort_order: idx + 1 }));
      // Upsert each row's sort_order individually — cheap for small lists.
      for (const u of updates) {
        const { error } = await supabase
          .from("projects")
          .update({ sort_order: u.sort_order })
          .eq("id", u.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Order saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  const sortable = filter === "all" && !search;

  return (
    <AdminPage
      eyebrow="Case studies"
      title="Projects"
      description="Manage your featured work. Drag rows to reorder."
      actions={
        <Button asChild>
          <Link to="/admin/projects/new">
            <Plus size={16} /> New project
          </Link>
        </Button>
      }
      wide
    >
      <AdminToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search projects, company, category…"
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
            <ToolbarChip
              active={filter === "featured"}
              onClick={() => setFilter("featured")}
              count={counts.featured}
            >
              Featured
            </ToolbarChip>
          </>
        }
      />

      {filtered.length > 0 && (
        <div className="mb-2 flex items-center gap-3 px-3 text-xs text-neutral-500">
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
          <span>Select all in view</span>
          {sortable && <span className="ml-auto">Drag to reorder</span>}
        </div>
      )}

      {isLoading ? (
        <LoadingRows count={4} height={96} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={search || filter !== "all" ? "No matches" : "No projects yet"}
          description={
            search || filter !== "all"
              ? "Try a different search or filter."
              : "Create your first case study to get started."
          }
          actionLabel={search || filter !== "all" ? undefined : "Create project"}
          actionTo="/admin/projects/new"
        />
      ) : sortable ? (
        <SortableList
          items={filtered.map((p) => ({ id: p.id, data: p }))}
          onReorder={(ids) => reorder.mutate(ids)}
          renderItem={({ data: p }, handle) => (
            <ProjectRow
              project={p}
              selected={selected.has(p.id)}
              onToggle={() => toggleSelect(p.id)}
              onDelete={() => setConfirmId(p.id)}
              handle={handle}
            />
          )}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <ProjectRow
                project={p}
                selected={selected.has(p.id)}
                onToggle={() => toggleSelect(p.id)}
                onDelete={() => setConfirmId(p.id)}
              />
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
          onClick={() => setConfirmBulkDelete(true)}
          className="rounded-full text-red-300 hover:bg-red-500/20 hover:text-red-200"
        >
          <Trash2 size={13} /> Delete
        </Button>
      </BulkActionBar>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the case study permanently. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => confirmId && del.mutate(confirmId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} projects?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes all selected case studies permanently.
            </AlertDialogDescription>
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

function ProjectRow({
  project: p,
  selected,
  onToggle,
  onDelete,
  handle,
}: {
  project: any;
  selected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  handle?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-lg border bg-white p-3 transition-all",
        selected ? "border-neutral-900 shadow-sm" : "border-neutral-200 hover:border-neutral-300",
      )}
    >
      {handle}
      <Checkbox checked={selected} onCheckedChange={onToggle} aria-label={`Select ${p.title}`} />
      <div
        className="h-14 w-20 shrink-0 rounded border border-neutral-200"
        style={{
          background: p.thumbnail_url
            ? `center/cover url(${p.thumbnail_url})`
            : "linear-gradient(135deg,#f5f5f4,#d6d3d1)",
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-display text-base text-neutral-900">{p.title}</p>
          {p.featured && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              Featured
            </Badge>
          )}
          {p.published ? (
            <Badge className="h-5 px-1.5 text-[10px]">Published</Badge>
          ) : (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
              Draft
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-neutral-500">
          {[p.company, p.category, p.duration].filter(Boolean).join(" · ") || p.slug}
        </p>
      </div>
      <div className="flex items-center">
        {p.published && (
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to={`/projects/${p.slug}`} target="_blank" aria-label="View">
              <ExternalLink size={14} />
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link to={`/admin/projects/${p.id}`} aria-label="Edit">
            <Pencil size={14} />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-neutral-500 hover:text-red-600"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
