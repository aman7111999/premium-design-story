import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Row = { id: string; role: string; company: string; start_date: string | null; end_date: string | null; description: string | null; sort_order: number };

export default function ExperienceAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-experience"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experience").select("*").order("sort_order");
      if (error) throw error;
      return data as Row[];
    },
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const patch = drafts[row.id] ?? {};
      const { error } = await supabase.from("experience").update(patch).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-experience"] }); qc.invalidateQueries({ queryKey: ["experience"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: async () => {
      const nextOrder = (data?.length ?? 0) + 1;
      const { error } = await supabase.from("experience").insert({ role: "New role", company: "Company", sort_order: nextOrder });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-experience"] }); qc.invalidateQueries({ queryKey: ["experience"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-experience"] }); qc.invalidateQueries({ queryKey: ["experience"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const patch = (id: string, k: keyof Row, v: any) => setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));
  const merged = (row: Row) => ({ ...row, ...drafts[row.id] });

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Timeline</p><h1 className="font-display text-4xl mt-1">Experience</h1></div>
        <Button onClick={() => add.mutate()}><Plus size={16} /> Add role</Button>
      </header>
      <div className="space-y-3">
        {isLoading && <Skeleton className="h-24" />}
        {data?.map((row) => {
          const m = merged(row);
          return (
            <Card key={row.id} className="p-4 grid md:grid-cols-2 gap-3">
              <div><Label>Role</Label><Input value={m.role} onChange={(e) => patch(row.id, "role", e.target.value)} /></div>
              <div><Label>Company</Label><Input value={m.company} onChange={(e) => patch(row.id, "company", e.target.value)} /></div>
              <div><Label>Start</Label><Input value={m.start_date ?? ""} onChange={(e) => patch(row.id, "start_date", e.target.value)} placeholder="2020" /></div>
              <div><Label>End</Label><Input value={m.end_date ?? ""} onChange={(e) => patch(row.id, "end_date", e.target.value)} placeholder="Present" /></div>
              <div className="md:col-span-2"><Label>Summary</Label><Textarea rows={2} value={m.description ?? ""} onChange={(e) => patch(row.id, "description", e.target.value)} /></div>
              <div className="md:col-span-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2"><Label>Order</Label><Input className="w-20" type="number" value={m.sort_order} onChange={(e) => patch(row.id, "sort_order", Number(e.target.value))} /></div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => del.mutate(row.id)}><Trash2 size={14} /></Button>
                  <Button size="sm" onClick={() => save.mutate(row)} disabled={!drafts[row.id]}>{save.isPending ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save</>}</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
