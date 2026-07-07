import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { EmptyState, LoadingRows } from "@/components/admin/EmptyState";
import { clsx } from "clsx";

type Row = {
  id: string;
  route: string;
  title: string | null;
  description: string | null;
  keywords: string[];
  og_image_url: string | null;
};

const TITLE_OK = 60;
const DESC_OK = 160;

export default function SeoAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-seo"],
    queryFn: async () =>
      ((await supabase.from("seo_settings").select("*").order("route")).data as Row[] | null) ?? [],
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const [newRoute, setNewRoute] = useState("");
  const [search, setSearch] = useState("");
  const inv = () => qc.invalidateQueries({ queryKey: ["admin-seo"] });

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase
        .from("seo_settings")
        .update(drafts[row.id] ?? {})
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: (_d, row) => {
      toast.success("Saved");
      setDrafts((d) => {
        const { [row.id]: _, ...rest } = d;
        return rest;
      });
      inv();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: async () => {
      const route = newRoute.trim();
      if (!route) return;
      const { error } = await supabase
        .from("seo_settings")
        .insert({ route: route.startsWith("/") ? route : "/" + route });
      if (error) throw error;
      setNewRoute("");
    },
    onSuccess: inv,
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seo_settings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      inv();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const patch = (id: string, k: keyof Row, v: any) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (r) =>
        !q ||
        r.route.toLowerCase().includes(q) ||
        (r.title ?? "").toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <AdminPage
      wide
      eyebrow="Metadata"
      title="SEO settings"
      description="Per-route titles, descriptions, and Open Graph metadata."
    >
      <AdminToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search routes…"
        actions={
          <>
            <Input
              value={newRoute}
              onChange={(e) => setNewRoute(e.target.value)}
              placeholder="/new-route"
              className="h-9 w-40"
            />
            <Button size="sm" onClick={() => add.mutate()} disabled={!newRoute.trim()}>
              <Plus size={14} /> Add
            </Button>
          </>
        }
      />

      {isLoading ? (
        <LoadingRows count={3} height={220} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={search ? "No matches" : "No SEO entries yet"}
          description={search ? "Try a different query." : "Add per-route metadata above."}
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((row) => {
            const m = { ...row, ...drafts[row.id] };
            const hasDraft = !!drafts[row.id];
            const titleLen = (m.title ?? "").length;
            const descLen = (m.description ?? "").length;
            return (
              <div
                key={row.id}
                className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 lg:grid-cols-[1fr_320px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm text-neutral-900">{row.route}</p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-neutral-500 hover:text-red-600"
                        onClick={() => del.mutate(row.id)}
                        aria-label="Remove"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Title</Label>
                      <CharCounter len={titleLen} ok={TITLE_OK} />
                    </div>
                    <Input
                      value={m.title ?? ""}
                      onChange={(e) => patch(row.id, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Description</Label>
                      <CharCounter len={descLen} ok={DESC_OK} />
                    </div>
                    <Textarea
                      rows={3}
                      value={m.description ?? ""}
                      onChange={(e) => patch(row.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => save.mutate(row)}
                      disabled={!hasDraft || save.isPending}
                    >
                      {hasDraft ? (
                        <>
                          <Save size={13} /> Save changes
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={13} /> Up to date
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Live Google preview */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-neutral-500">
                    Search preview
                  </p>
                  <p className="truncate text-xs text-neutral-600">
                    yoursite.com{row.route === "/" ? "" : row.route}
                  </p>
                  <p className="mt-0.5 line-clamp-1 font-serif text-lg text-blue-800">
                    {m.title || "Untitled page"}
                  </p>
                  <p className="mt-1 line-clamp-3 text-xs text-neutral-700">
                    {m.description || "No description set."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}

function CharCounter({ len, ok }: { len: number; ok: number }) {
  const over = len > ok;
  const near = !over && len > ok - 10;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-[10px] tabular-nums",
        over ? "text-red-600" : near ? "text-amber-600" : "text-neutral-400",
      )}
    >
      {over && <AlertCircle size={10} />}
      {len}/{ok}
    </span>
  );
}
