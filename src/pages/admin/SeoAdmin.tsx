import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Row = { id: string; route: string; title: string | null; description: string | null; keywords: string[]; og_image_url: string | null };

export default function SeoAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-seo"],
    queryFn: async () => (await supabase.from("seo_settings").select("*").order("route")).data as Row[] | null,
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const [newRoute, setNewRoute] = useState("");
  const inv = () => qc.invalidateQueries({ queryKey: ["admin-seo"] });

  const save = useMutation({
    mutationFn: async (row: Row) => { const { error } = await supabase.from("seo_settings").update(drafts[row.id] ?? {}).eq("id", row.id); if (error) throw error; },
    onSuccess: () => { toast.success("Saved"); inv(); }, onError: (e: Error) => toast.error(e.message),
  });
  const add = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("seo_settings").insert({ route: newRoute }); if (error) throw error; setNewRoute(""); },
    onSuccess: inv, onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("seo_settings").delete().eq("id", id); if (error) throw error; },
    onSuccess: inv, onError: (e: Error) => toast.error(e.message),
  });
  const patch = (id: string, k: keyof Row, v: any) => setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));

  return (
    <div>
      <header className="mb-6"><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Metadata</p><h1 className="font-display text-4xl mt-1">SEO settings</h1></header>
      <Card className="p-4 mb-6 flex gap-2 items-end">
        <div className="flex-1"><Label>New route</Label><Input value={newRoute} onChange={(e) => setNewRoute(e.target.value)} placeholder="/blog" /></div>
        <Button onClick={() => add.mutate()} disabled={!newRoute}><Plus size={16} /> Add</Button>
      </Card>
      <div className="space-y-3">
        {isLoading && <Skeleton className="h-24" />}
        {(data ?? []).map((row) => {
          const m = { ...row, ...drafts[row.id] };
          return (
            <Card key={row.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm">{row.route}</p>
                <Button variant="ghost" size="sm" onClick={() => del.mutate(row.id)}><Trash2 size={14} /></Button>
              </div>
              <div><Label>Title</Label><Input value={m.title ?? ""} onChange={(e) => patch(row.id, "title", e.target.value)} maxLength={60} /></div>
              <div><Label>Description</Label><Textarea rows={2} value={m.description ?? ""} onChange={(e) => patch(row.id, "description", e.target.value)} maxLength={160} /></div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => save.mutate(row)} disabled={!drafts[row.id]}><Save size={14} /> Save</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
