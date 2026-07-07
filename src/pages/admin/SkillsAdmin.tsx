import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { EmptyState, LoadingRows } from "@/components/admin/EmptyState";

type Row = { id: string; group_name: string; name: string; sort_order: number };

export default function SkillsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () =>
      ((
        await supabase.from("skills").select("*").order("group_name").order("sort_order")
      ).data as Row[] | null) ?? [],
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const [newGroup, setNewGroup] = useState("");
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");

  const inv = () => {
    qc.invalidateQueries({ queryKey: ["admin-skills"] });
    qc.invalidateQueries({ queryKey: ["skills"] });
  };
  const add = useMutation({
    mutationFn: async () => {
      if (!newGroup || !newName) return;
      const { error } = await supabase
        .from("skills")
        .insert({ group_name: newGroup, name: newName, sort_order: 999 });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewName("");
      inv();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const save = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase.from("skills").update(drafts[row.id] ?? {}).eq("id", row.id);
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
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
    onError: (e: Error) => toast.error(e.message),
  });

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const g: Record<string, Row[]> = {};
    for (const r of data ?? []) {
      if (q && !r.name.toLowerCase().includes(q) && !r.group_name.toLowerCase().includes(q))
        continue;
      (g[r.group_name] ??= []).push(r);
    }
    return g;
  }, [data, search]);

  return (
    <AdminPage
      wide
      eyebrow="Craft"
      title="Skills"
      description="Grouped skills shown on the About page."
    >
      <div className="mb-4 grid gap-2 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <Label className="text-xs">Group</Label>
          <Input
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="Craft"
            list="skill-groups"
          />
          <datalist id="skill-groups">
            {Object.keys(grouped).map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
        <div>
          <Label className="text-xs">Skill</Label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Prototyping"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => add.mutate()} disabled={!newGroup || !newName}>
            <Plus size={14} /> Add skill
          </Button>
        </div>
      </div>

      <AdminToolbar search={search} onSearch={setSearch} placeholder="Search skills or groups…" />

      {isLoading ? (
        <LoadingRows count={2} height={100} />
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={search ? "No matches" : "No skills yet"}
          description={search ? "Try a different query." : "Add your first skill above."}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, rows]) => (
            <section key={group} className="rounded-xl border border-neutral-200 bg-white">
              <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                  {group}
                </h2>
                <span className="text-xs text-neutral-400">{rows.length}</span>
              </header>
              <ul className="divide-y divide-neutral-100">
                {rows.map((row) => {
                  const m = { ...row, ...drafts[row.id] };
                  const hasDraft = !!drafts[row.id];
                  return (
                    <li key={row.id} className="flex items-center gap-2 p-3">
                      <Input
                        value={m.name}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [row.id]: { ...d[row.id], name: e.target.value },
                          }))
                        }
                        className="flex-1"
                      />
                      <Input
                        className="w-40"
                        value={m.group_name}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [row.id]: { ...d[row.id], group_name: e.target.value },
                          }))
                        }
                        placeholder="Group"
                      />
                      <Input
                        className="w-20"
                        type="number"
                        value={m.sort_order}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [row.id]: { ...d[row.id], sort_order: Number(e.target.value) },
                          }))
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => save.mutate(row)}
                        disabled={!hasDraft || save.isPending}
                      >
                        {save.isPending ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : hasDraft ? (
                          <Save size={13} />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-500 hover:text-red-600"
                        onClick={() => del.mutate(row.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
