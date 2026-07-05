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

type Row = { id: string; institution: string; degree: string | null; field: string | null; start_date: string | null; end_date: string | null; description: string | null; sort_order: number };

export default function EducationAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-education"],
    queryFn: async () => (await supabase.from("education").select("*").order("sort_order")).data as Row[] | null,
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const inv = () => { qc.invalidateQueries({ queryKey: ["admin-education"] }); qc.invalidateQueries({ queryKey: ["education"] }); };

  const save = useMutation({
    mutationFn: async (row: Row) => { const { error } = await supabase.from("education").update(drafts[row.id] ?? {}).eq("id", row.id); if (error) throw error; },
    onSuccess: () => { toast.success("Saved"); inv(); }, onError: (e: Error) => toast.error(e.message),
  });
  const add = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("education").insert({ institution: "New institution", sort_order: (data?.length ?? 0) + 1 }); if (error) throw error; },
    onSuccess: inv, onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("education").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); inv(); }, onError: (e: Error) => toast.error(e.message),
  });
  const patch = (id: string, k: keyof Row, v: any) => setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));
  const merged = (row: Row) => ({ ...row, ...drafts[row.id] });

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Learning</p><h1 className="font-display text-4xl mt-1">Education</h1></div>
        <Button onClick={() => add.mutate()}><Plus size={16} /> Add</Button>
      </header>
      <div className="space-y-3">
        {isLoading && <Skeleton className="h-24" />}
        {(data ?? []).map((row) => {
          const m = merged(row);
          return (
            <Card key={row.id} className="p-4 grid md:grid-cols-2 gap-3">
              <div><Label>Institution</Label><Input value={m.institution} onChange={(e) => patch(row.id, "institution", e.target.value)} /></div>
              <div><Label>Degree</Label><Input value={m.degree ?? ""} onChange={(e) => patch(row.id, "degree", e.target.value)} /></div>
              <div><Label>Field</Label><Input value={m.field ?? ""} onChange={(e) => patch(row.id, "field", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Start</Label><Input value={m.start_date ?? ""} onChange={(e) => patch(row.id, "start_date", e.target.value)} /></div>
                <div><Label>End</Label><Input value={m.end_date ?? ""} onChange={(e) => patch(row.id, "end_date", e.target.value)} /></div>
              </div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea rows={2} value={m.description ?? ""} onChange={(e) => patch(row.id, "description", e.target.value)} /></div>
              <div className="md:col-span-2 flex justify-between">
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
