import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

type Row = { id: string; group_name: string; name: string; sort_order: number };

export default function SkillsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () => (await supabase.from("skills").select("*").order("group_name").order("sort_order")).data as Row[] | null,
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const [newGroup, setNewGroup] = useState("");
  const [newName, setNewName] = useState("");
  const inv = () => { qc.invalidateQueries({ queryKey: ["admin-skills"] }); qc.invalidateQueries({ queryKey: ["skills"] }); };
  const add = useMutation({
    mutationFn: async () => {
      if (!newGroup || !newName) return;
      const { error } = await supabase.from("skills").insert({ group_name: newGroup, name: newName, sort_order: 999 });
      if (error) throw error;
    },
    onSuccess: () => { setNewName(""); inv(); }, onError: (e: Error) => toast.error(e.message),
  });
  const save = useMutation({
    mutationFn: async (row: Row) => { const { error } = await supabase.from("skills").update(drafts[row.id] ?? {}).eq("id", row.id); if (error) throw error; },
    onSuccess: () => { toast.success("Saved"); inv(); }, onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("skills").delete().eq("id", id); if (error) throw error; },
    onSuccess: inv, onError: (e: Error) => toast.error(e.message),
  });

  const grouped: Record<string, Row[]> = {};
  for (const r of data ?? []) (grouped[r.group_name] ??= []).push(r);

  return (
    <div>
      <header className="mb-6"><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Craft</p><h1 className="font-display text-4xl mt-1">Skills</h1></header>

      <Card className="p-4 mb-6 flex gap-2 items-end">
        <div className="flex-1"><Label>Group</Label><Input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder="Craft" list="skill-groups" /></div>
        <datalist id="skill-groups">{Object.keys(grouped).map((g) => <option key={g} value={g} />)}</datalist>
        <div className="flex-1"><Label>Skill</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Prototyping" /></div>
        <Button onClick={() => add.mutate()}><Plus size={16} /> Add</Button>
      </Card>

      {isLoading && <Skeleton className="h-24" />}
      <div className="space-y-6">
        {Object.entries(grouped).map(([group, rows]) => (
          <div key={group}>
            <h2 className="font-display text-xl mb-3">{group}</h2>
            <div className="space-y-2">
              {rows.map((row) => {
                const m = { ...row, ...drafts[row.id] };
                return (
                  <Card key={row.id} className="p-3 flex gap-2 items-center">
                    <Input value={m.name} onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: { ...d[row.id], name: e.target.value } }))} />
                    <Input className="w-32" value={m.group_name} onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: { ...d[row.id], group_name: e.target.value } }))} />
                    <Input className="w-20" type="number" value={m.sort_order} onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: { ...d[row.id], sort_order: Number(e.target.value) } }))} />
                    <Button size="sm" onClick={() => save.mutate(row)} disabled={!drafts[row.id]}><Save size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => del.mutate(row.id)}><Trash2 size={14} /></Button>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
