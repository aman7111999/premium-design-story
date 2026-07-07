import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/AdminPage";
import { EmptyState, LoadingRows } from "@/components/admin/EmptyState";
import { SortableList } from "@/components/admin/SortableList";

type Row = {
  id: string;
  institution: string;
  degree: string | null;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
};

export default function EducationAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-education"],
    queryFn: async () =>
      ((await supabase.from("education").select("*").order("sort_order")).data as Row[] | null) ??
      [],
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const inv = () => {
    qc.invalidateQueries({ queryKey: ["admin-education"] });
    qc.invalidateQueries({ queryKey: ["education"] });
  };

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase.from("education").update(drafts[row.id] ?? {}).eq("id", row.id);
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
      const { error } = await supabase
        .from("education")
        .insert({ institution: "New institution", sort_order: (data?.length ?? 0) + 1 });
      if (error) throw error;
    },
    onSuccess: inv,
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      inv();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const reorder = useMutation({
    mutationFn: async (ids: string[]) => {
      for (let i = 0; i < ids.length; i++) {
        const { error } = await supabase
          .from("education")
          .update({ sort_order: i + 1 })
          .eq("id", ids[i]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Order saved");
      inv();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const patch = (id: string, k: keyof Row, v: any) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));

  return (
    <AdminPage
      wide
      eyebrow="Learning"
      title="Education"
      description="Degrees and programs. Drag to reorder."
      actions={
        <Button size="sm" onClick={() => add.mutate()}>
          <Plus size={14} /> Add
        </Button>
      }
    >
      {isLoading ? (
        <LoadingRows count={2} height={140} />
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No entries yet"
          description="Add your first education entry."
          actionLabel="Add"
          onAction={() => add.mutate()}
        />
      ) : (
        <SortableList
          items={(data ?? []).map((r) => ({ id: r.id, data: r }))}
          onReorder={(ids) => reorder.mutate(ids)}
          renderItem={({ data: row }, handle) => {
            const m = { ...row, ...drafts[row.id] };
            const hasDraft = !!drafts[row.id];
            return (
              <div className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <div className="pt-1">{handle}</div>
                <div className="grid flex-1 gap-3 md:grid-cols-2">
                  <F label="Institution">
                    <Input
                      value={m.institution}
                      onChange={(e) => patch(row.id, "institution", e.target.value)}
                    />
                  </F>
                  <F label="Degree">
                    <Input
                      value={m.degree ?? ""}
                      onChange={(e) => patch(row.id, "degree", e.target.value)}
                    />
                  </F>
                  <F label="Field">
                    <Input
                      value={m.field ?? ""}
                      onChange={(e) => patch(row.id, "field", e.target.value)}
                    />
                  </F>
                  <div className="grid grid-cols-2 gap-2">
                    <F label="Start">
                      <Input
                        value={m.start_date ?? ""}
                        onChange={(e) => patch(row.id, "start_date", e.target.value)}
                      />
                    </F>
                    <F label="End">
                      <Input
                        value={m.end_date ?? ""}
                        onChange={(e) => patch(row.id, "end_date", e.target.value)}
                      />
                    </F>
                  </div>
                  <div className="md:col-span-2">
                    <F label="Description">
                      <Textarea
                        rows={2}
                        value={m.description ?? ""}
                        onChange={(e) => patch(row.id, "description", e.target.value)}
                      />
                    </F>
                  </div>
                  <div className="flex justify-end gap-2 md:col-span-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => del.mutate(row.id)}
                      className="text-neutral-500 hover:text-red-600"
                    >
                      <Trash2 size={13} /> Remove
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => save.mutate(row)}
                      disabled={!hasDraft || save.isPending}
                    >
                      {save.isPending ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : hasDraft ? (
                        <>
                          <Save size={13} /> Save
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={13} /> Saved
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}
    </AdminPage>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
