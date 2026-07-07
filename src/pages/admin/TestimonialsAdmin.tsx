import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, MessageSquareQuote, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/AdminPage";
import { EmptyState, LoadingRows } from "@/components/admin/EmptyState";
import { SortableList } from "@/components/admin/SortableList";

type Row = {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  quote: string;
  sort_order: number;
};

export default function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () =>
      ((await supabase.from("testimonials").select("*").order("sort_order")).data as Row[] | null) ??
      [],
  });
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const inv = () => {
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };
  const patch = (id: string, k: keyof Row, v: any) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase
        .from("testimonials")
        .update(drafts[row.id] ?? {})
        .eq("id", row.id);
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
        .from("testimonials")
        .insert({ author: "New author", quote: "…", sort_order: (data?.length ?? 0) + 1 });
      if (error) throw error;
    },
    onSuccess: inv,
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
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
          .from("testimonials")
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

  return (
    <AdminPage
      wide
      eyebrow="Kind words"
      title="Testimonials"
      description="Client quotes surfaced across the site."
      actions={
        <Button size="sm" onClick={() => add.mutate()}>
          <Plus size={14} /> Add
        </Button>
      }
    >
      {isLoading ? (
        <LoadingRows count={2} height={160} />
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No testimonials yet"
          description="Add your first quote."
          actionLabel="Add testimonial"
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
                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    <F label="Author">
                      <Input
                        value={m.author}
                        onChange={(e) => patch(row.id, "author", e.target.value)}
                      />
                    </F>
                    <F label="Role">
                      <Input
                        value={m.role ?? ""}
                        onChange={(e) => patch(row.id, "role", e.target.value)}
                      />
                    </F>
                    <F label="Company">
                      <Input
                        value={m.company ?? ""}
                        onChange={(e) => patch(row.id, "company", e.target.value)}
                      />
                    </F>
                  </div>
                  <F label="Quote">
                    <Textarea
                      rows={3}
                      value={m.quote}
                      onChange={(e) => patch(row.id, "quote", e.target.value)}
                    />
                  </F>
                  <div className="flex justify-end gap-2">
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
