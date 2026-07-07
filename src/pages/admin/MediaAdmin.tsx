import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signedUrl, uploadFile } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2, Copy, Image as ImageIcon, Grid3x3, List, Download } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { EmptyState, BulkActionBar } from "@/components/admin/EmptyState";
import { DropZone } from "@/components/admin/ImageUploader";
import { clsx } from "clsx";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const BUCKETS = ["project-images", "thumbnails", "profile"] as const;

export default function MediaAdmin() {
  return (
    <AdminPage
      wide
      eyebrow="Assets"
      title="Media library"
      description="Browse uploads across buckets. Drop files to upload, click a card to preview."
    >
      <Tabs defaultValue={BUCKETS[0]}>
        <TabsList className="bg-neutral-100">
          {BUCKETS.map((b) => (
            <TabsTrigger key={b} value={b}>
              {b}
            </TabsTrigger>
          ))}
        </TabsList>
        {BUCKETS.map((b) => (
          <TabsContent key={b} value={b} className="mt-4">
            <BucketBrowser bucket={b} />
          </TabsContent>
        ))}
      </Tabs>
    </AdminPage>
  );
}

type MediaItem = { name: string; url: string; size?: number; createdAt?: string };

function BucketBrowser({ bucket }: { bucket: string }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      const files = (data ?? []).filter((f) => f.name && !f.name.endsWith("/"));
      const resolved = await Promise.all(
        files.map(async (f) => ({
          name: f.name,
          url: (await signedUrl(bucket, f.name)) ?? "",
          size: (f as any).metadata?.size,
          createdAt: (f as any).created_at,
        })),
      );
      setItems(resolved);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    setSelected(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucket]);

  const onUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const f of Array.from(files)) await uploadFile(bucket, f);
      toast.success(`Uploaded ${files.length}`);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (names: string[]) => {
    const { error } = await supabase.storage.from(bucket).remove(names);
    if (error) toast.error(error.message);
    else {
      toast.success(`Removed ${names.length}`);
      setSelected(new Set());
      load();
    }
  };

  const toggleSelect = (name: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => !q || i.name.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <>
      <DropZone onFiles={onUpload} busy={uploading} compact />
      <div className="my-4">
        <AdminToolbar
          search={search}
          onSearch={setSearch}
          placeholder="Filter by filename…"
          actions={
            <div className="flex items-center rounded-md border border-neutral-200 p-0.5">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={clsx(
                  "grid h-7 w-7 place-items-center rounded",
                  view === "grid" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100",
                )}
              >
                <Grid3x3 size={13} />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={clsx(
                  "grid h-7 w-7 place-items-center rounded",
                  view === "list" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100",
                )}
              >
                <List size={13} />
              </button>
            </div>
          }
        />
      </div>

      {loading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="animate-spin text-neutral-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={search ? "No matches" : "This bucket is empty"}
          description={search ? "Try a different query." : "Drop files above to upload."}
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((it) => (
            <div
              key={it.name}
              className={clsx(
                "group relative overflow-hidden rounded-lg border bg-white transition-all",
                selected.has(it.name)
                  ? "border-neutral-900 shadow-md"
                  : "border-neutral-200 hover:border-neutral-300",
              )}
            >
              <button
                className="block aspect-video w-full bg-neutral-100"
                onClick={() => setPreview(it)}
                style={{ background: `center/cover url(${it.url})` }}
                aria-label={`Preview ${it.name}`}
              />
              <div className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 [&:has([data-state=checked])]:opacity-100">
                <Checkbox
                  checked={selected.has(it.name)}
                  onCheckedChange={() => toggleSelect(it.name)}
                  aria-label={`Select ${it.name}`}
                  className="border-white bg-black/40 backdrop-blur data-[state=checked]:bg-neutral-900"
                />
              </div>
              <div className="flex items-center gap-1 border-t border-neutral-100 p-1.5">
                <p className="min-w-0 flex-1 truncate px-1 text-[11px]" title={it.name}>
                  {it.name}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    navigator.clipboard.writeText(it.url);
                    toast.success("URL copied");
                  }}
                  aria-label="Copy URL"
                >
                  <Copy size={11} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-neutral-500 hover:text-red-600"
                  onClick={() => remove([it.name])}
                  aria-label="Delete"
                >
                  <Trash2 size={11} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <ul className="divide-y divide-neutral-100">
            {filtered.map((it) => (
              <li
                key={it.name}
                className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50"
              >
                <Checkbox
                  checked={selected.has(it.name)}
                  onCheckedChange={() => toggleSelect(it.name)}
                />
                <button
                  onClick={() => setPreview(it)}
                  className="h-10 w-14 shrink-0 rounded border border-neutral-200 bg-neutral-100"
                  style={{ background: `center/cover url(${it.url})` }}
                  aria-label={`Preview ${it.name}`}
                />
                <p className="min-w-0 flex-1 truncate text-sm">{it.name}</p>
                <span className="text-xs text-neutral-500 tabular-nums">
                  {it.size ? `${(it.size / 1024).toFixed(0)} KB` : "—"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    navigator.clipboard.writeText(it.url);
                    toast.success("URL copied");
                  }}
                >
                  <Copy size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-500 hover:text-red-600"
                  onClick={() => remove([it.name])}
                >
                  <Trash2 size={12} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => remove(Array.from(selected))}
          className="rounded-full text-red-300 hover:bg-red-500/20 hover:text-red-200"
        >
          <Trash2 size={13} /> Delete
        </Button>
      </BulkActionBar>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          <DialogTitle className="sr-only">{preview?.name}</DialogTitle>
          {preview && (
            <>
              <img src={preview.url} alt={preview.name} className="max-h-[75vh] w-full object-contain bg-neutral-100" />
              <div className="flex items-center gap-2 border-t border-neutral-100 p-3">
                <p className="min-w-0 flex-1 truncate text-sm">{preview.name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(preview.url);
                    toast.success("URL copied");
                  }}
                >
                  <Copy size={12} /> Copy URL
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={preview.url} download={preview.name} target="_blank" rel="noreferrer">
                    <Download size={12} /> Download
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
