import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, Loader2, Briefcase, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/AdminPage";
import { EmptyState, LoadingRows } from "@/components/admin/EmptyState";
import { SortableList } from "@/components/admin/SortableList";

type Row = {
  id: string;
  role: string;
  company: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  highlights: string[];
  sort_order: number;
};

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
  const inv = () => {
    qc.invalidateQueries({ queryKey: ["admin-experience"] });
    qc.invalidateQueries({ queryKey: ["experience"] });
  };

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase.from("experience").update(drafts[row.id] ?? {}).eq("id", row.id);
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
      const nextOrder = (data?.length ?? 0) + 1;
      const { error } = await supabase
        .from("experience")
        .insert({ role: "New role", company: "Company", sort_order: nextOrder });
      if (error) throw error;
    },
    onSuccess: inv,
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experience").delete().eq("id", id);
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
          .from("experience")
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
  const merged = (row: Row) => ({ ...row, ...drafts[row.id] });

  return (
    <AdminPage
      wide
      eyebrow="Timeline"
      title="Experience"
      description="Roles that shape the story. Drag to reorder."
      actions={
        <Button size="sm" onClick={() => add.mutate()}>
          <Plus size={14} /> Add role
        </Button>
      }
    >
      {isLoading ? (
        <LoadingRows count={2} height={140} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No roles yet"
          description="Add your first experience entry."
          actionLabel="Add role"
          onAction={() => add.mutate()}
        />
      ) : (
        <SortableList
          items={data.map((r) => ({ id: r.id, data: r }))}
          onReorder={(ids) => reorder.mutate(ids)}
          renderItem={({ data: row }, handle) => {
            const m = merged(row);
            const hasDraft = !!drafts[row.id];
            return (
              <div className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <div className="pt-1">{handle}</div>
                <div className="grid flex-1 gap-3 md:grid-cols-2">
                  <Field label="Role">
                    <Input value={m.role} onChange={(e) => patch(row.id, "role", e.target.value)} />
                  </Field>
                  <Field label="Company">
                    <Input
                      value={m.company}
                      onChange={(e) => patch(row.id, "company", e.target.value)}
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={m.location ?? ""}
                      onChange={(e) => patch(row.id, "location", e.target.value)}
                      placeholder="Remote · Lisbon"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start">
                      <Input
                        value={m.start_date ?? ""}
                        onChange={(e) => patch(row.id, "start_date", e.target.value)}
                        placeholder="2020-01"
                      />
                    </Field>
                    <Field label="End">
                      <Input
                        value={m.end_date ?? ""}
                        onChange={(e) => patch(row.id, "end_date", e.target.value)}
                        placeholder="Present"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Summary">
                      <Textarea
                        rows={2}
                        value={m.description ?? ""}
                        onChange={(e) => patch(row.id, "description", e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="flex items-center justify-end gap-2 md:col-span-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-500 hover:text-red-600"
                      onClick={() => del.mutate(row.id)}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
