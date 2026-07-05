import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { RichEditor } from "@/components/admin/RichEditor";
import { SingleImageUpload } from "@/components/admin/ImageUploader";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Draft = {
  title: string; slug: string; excerpt: string; body: string;
  cover_url: string | null; published: boolean; tags: string[];
};

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = !id;
  const nav = useNavigate();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>({ title: "", slug: "", excerpt: "", body: "", cover_url: null, published: false, tags: [] });
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const { isLoading } = useQuery({
    queryKey: ["blog-edit", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("blogs").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      if (data) setDraft({ title: data.title, slug: data.slug, excerpt: data.excerpt ?? "", body: data.body ?? "", cover_url: data.cover_url, published: data.published, tags: data.tags });
      return data;
    },
  });

  useEffect(() => {
    if (isNew && !slugTouched && draft.title) setDraft((d) => ({ ...d, slug: slugify(d.title) }));
  }, [draft.title, slugTouched, isNew]);

  const save = useMutation({
    mutationFn: async (publish?: boolean) => {
      const payload: any = { ...draft, published: publish ?? draft.published };
      if (publish && !draft.published) payload.published_at = new Date().toISOString();
      if (isNew) {
        const { data, error } = await supabase.from("blogs").insert(payload).select("id").single();
        if (error) throw error;
        return data.id as string;
      }
      const { error } = await supabase.from("blogs").update(payload).eq("id", id!);
      if (error) throw error;
      return id!;
    },
    onSuccess: (newId, publish) => {
      toast.success(publish ? "Published" : "Saved");
      qc.invalidateQueries({ queryKey: ["blogs"] });
      if (isNew) nav(`/admin/blog/${newId}`, { replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isNew && isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/admin/blog"><ArrowLeft size={16} /></Link></Button>
          <h1 className="font-display text-3xl">{draft.title || "Untitled"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => save.mutate(false)} disabled={save.isPending}><Save size={14} /> Save draft</Button>
          <Button onClick={() => save.mutate(true)} disabled={save.isPending}>Publish</Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <div><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={draft.slug} onChange={(e) => { setDraft({ ...draft, slug: slugify(e.target.value) }); setSlugTouched(true); }} /></div>
            <div><Label>Excerpt</Label><Textarea rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></div>
          </Card>
          <Card className="p-6">
            <Label className="mb-3 block">Body</Label>
            <RichEditor value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} placeholder="Write your post…" />
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="p-6 flex items-center justify-between">
            <Label>Published</Label>
            <Switch checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} />
          </Card>
          <Card className="p-6">
            <h3 className="font-medium mb-3">Cover image</h3>
            <SingleImageUpload value={draft.cover_url} onChange={(v) => setDraft({ ...draft, cover_url: v })} bucket="thumbnails" prefix="blog" />
          </Card>
        </aside>
      </div>
    </div>
  );
}
