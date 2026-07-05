import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBlogs } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function BlogList() {
  const { data, isLoading } = useBlogs(false);
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState<string | null>(null);
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["blogs"] }); setConfirm(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Blog</p>
          <h1 className="font-display text-4xl mt-1">Posts</h1>
        </div>
        <Link to="/admin/blog/new"><Button><Plus size={16} /> New post</Button></Link>
      </header>
      <div className="space-y-3">
        {isLoading && [1, 2].map((i) => <Skeleton key={i} className="h-20" />)}
        {data?.map((b: any) => (
          <Card key={b.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display text-lg truncate">{b.title}</p>
                {b.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
              </div>
              <p className="text-sm text-[var(--color-muted)] truncate">{b.excerpt}</p>
            </div>
            <Button variant="ghost" size="icon" asChild><Link to={`/admin/blog/${b.id}`}><Pencil size={16} /></Link></Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirm(b.id)}><Trash2 size={16} /></Button>
          </Card>
        ))}
        {!isLoading && data?.length === 0 && <p className="text-sm text-[var(--color-muted)]">No posts yet.</p>}
      </div>
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete post?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirm && del.mutate(confirm)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
