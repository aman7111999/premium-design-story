import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Row = { id: string; author: string; role: string | null; company: string | null; quote: string; sort_order: number };

export default function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("sort_order")).data as Row[] | null,
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const inv = () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); qc.invalidateQueries({ queryKey: ["testimonials"] }); };
  const patch = (id: string, k: keyof Row, v: any) => setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));

  const save = useMutation({
    mutationFn: async (row: Row) => { const { error } = await supabase.from("testimonials").update(drafts[row.id] ?? {}).eq("id", row.id); if (error) throw error; },
    onSuccess: () => { toast.success("Saved"); inv(); }, onError: (e: Error) => toast.error(e.message),
  });
  const add = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("testimonials").insert({ author: "New author", quote: "…", sort_order: (data?.length ?? 0) + 1 }); if (error) throw error; },
    onSuccess: inv, onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); inv(); }, onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Kind words</p><h1 className="font-display text-4xl mt-1">Testimonials</h1></div>
        <Button onClick={() => add.mutate()}><Plus size={16} /> Add</Button>
      </header>
      <div className="space-y-3">
        {isLoading && <Skeleton className="h-24" />}
        {(data ?? []).map((row) => {
          const m = { ...row, ...drafts[row.id] };
          return (
            <Card key={row.id} className="p-4 space-y-3">
              <div className="grid md:grid-cols-3 gap-2">
                <div><Label>Author</Label><Input value={m.author} onChange={(e) => patch(row.id, "author", e.target.value)} /></div>
                <div><Label>Role</Label><Input value={m.role ?? ""} onChange={(e) => patch(row.id, "role", e.target.value)} /></div>
                <div><Label>Company</Label><Input value={m.company ?? ""} onChange={(e) => patch(row.id, "company", e.target.value)} /></div>
              </div>
              <div><Label>Quote</Label><Textarea rows={3} value={m.quote} onChange={(e) => patch(row.id, "quote", e.target.value)} /></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><Label>Order</Label><Input className="w-20" type="number" value={m.sort_order} onChange={(e) => patch(row.id, "sort_order", Number(e.target.value))} /></div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => del.mutate(row.id)}><Trash2 size={14} /></Button>
                  <Button size="sm" onClick={() => save.mutate(row)} disabled={!drafts[row.id]}><Save size={14} /> Save</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
