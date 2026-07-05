import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectsList() {
  const { data: projects, isLoading } = useProjects();
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project deleted");
      qc.invalidateQueries({ queryKey: ["projects"] });
      setConfirmId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Projects</p>
          <h1 className="font-display text-4xl mt-1">Case studies</h1>
        </div>
        <Link to="/admin/projects/new"><Button><Plus size={16} /> New project</Button></Link>
      </header>

      <div className="space-y-3">
        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
        {projects?.map((p) => (
          <Card key={p.id} className="p-4 flex items-center gap-4">
            <div className="h-16 w-24 rounded border border-hairline shrink-0"
              style={{ background: p.thumbnail_url ? `center/cover url(${p.thumbnail_url})` : "linear-gradient(135deg,#eee,#ccc)" }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-display text-lg truncate">{p.title}</p>
                {p.featured && <Badge variant="secondary">Featured</Badge>}
                {p.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
              </div>
              <p className="text-sm text-[var(--color-muted)] truncate">{[p.company, p.category].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="flex items-center gap-1">
              {p.published && (
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/projects/${p.slug}`} target="_blank"><ExternalLink size={16} /></Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/admin/projects/${p.id}`}><Pencil size={16} /></Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setConfirmId(p.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && projects?.length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">No projects yet. Create your first one.</p>
        )}
      </div>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmId && del.mutate(confirmId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
