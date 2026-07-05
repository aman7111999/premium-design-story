import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signedUrl, uploadFile } from "@/lib/cms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BUCKETS = ["project-images", "thumbnails", "profile"] as const;

export default function MediaAdmin() {
  return (
    <div>
      <header className="mb-6"><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Assets</p><h1 className="font-display text-4xl mt-1">Media library</h1></header>
      <Tabs defaultValue={BUCKETS[0]}>
        <TabsList>{BUCKETS.map((b) => <TabsTrigger key={b} value={b}>{b}</TabsTrigger>)}</TabsList>
        {BUCKETS.map((b) => (
          <TabsContent key={b} value={b}><BucketBrowser bucket={b} /></TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function BucketBrowser({ bucket }: { bucket: string }) {
  const [items, setItems] = useState<{ name: string; url: string }[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      const files = (data ?? []).filter((f) => f.name && !f.name.endsWith("/"));
      const resolved = await Promise.all(files.map(async (f) => ({ name: f.name, url: (await signedUrl(bucket, f.name)) ?? "" })));
      setItems(resolved);
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [bucket]);

  const onUpload = async (file: File) => {
    try {
      await uploadFile(bucket, file);
      toast.success("Uploaded");
      load();
    } catch (e) { toast.error((e as Error).message); }
  };
  const remove = async (name: string) => {
    const { error } = await supabase.storage.from(bucket).remove([name]);
    if (error) toast.error(error.message);
    else { toast.success("Removed"); load(); }
  };

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-3 py-2 text-sm hover:bg-neutral-50">
          <Upload size={14} /> Upload
          <input type="file" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
        </label>
        {busy && <Loader2 size={14} className="animate-spin text-[var(--color-muted)]" />}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it) => (
          <Card key={it.name} className="overflow-hidden">
            <div className="aspect-video bg-neutral-100" style={{ background: `center/cover url(${it.url})` }} />
            <div className="p-2 flex items-center justify-between gap-1">
              <p className="text-xs truncate flex-1" title={it.name}>{it.name}</p>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { navigator.clipboard.writeText(it.url); toast.success("URL copied"); }}><Copy size={12} /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(it.name)}><Trash2 size={12} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
