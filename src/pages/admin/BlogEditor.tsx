import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RichEditor } from "@/components/admin/RichEditor";
import { SingleImageUpload } from "@/components/admin/ImageUploader";
import { AdminPage } from "@/components/admin/AdminPage";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Draft = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  published: boolean;
  tags: string[];
};

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = !id;
  const nav = useNavigate();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    cover_url: null,
    published: false,
    tags: [],
  });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [dirty, setDirty] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["blog-edit", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("blogs").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      if (data) {
        setDraft({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt ?? "",
          body: data.body ?? "",
          cover_url: data.cover_url,
          published: data.published,
          tags: data.tags,
        });
        setDirty(false);
      }
      return data;
    },
  });

  useEffect(() => {
    if (isNew && !slugTouched && draft.title) setDraft((d) => ({ ...d, slug: slugify(d.title) }));
  }, [draft.title, slugTouched, isNew]);

  const update = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

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
      setDirty(false);
      if (isNew) nav(`/admin/blog/${newId}`, { replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const wordCount = draft.body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 220));

  if (!isNew && isLoading)
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );

  return (
    <AdminPage
      wide
      crumbs={[{ label: "Blog", to: "/admin/blog" }, { label: draft.title || "New post" }]}
      eyebrow={isNew ? "New post" : "Editing"}
      title={draft.title || "Untitled"}
      description={
        dirty ? "Unsaved changes" : isNew ? "Start writing — save when ready." : "All changes saved"
      }
      actions={
        <>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/blog">
              <ArrowLeft size={14} /> Back
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => save.mutate(false)}
            disabled={save.isPending}
          >
            {save.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : dirty ? (
              <Save size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}{" "}
            Save draft
          </Button>
          <Button size="sm" onClick={() => save.mutate(true)} disabled={save.isPending}>
            {draft.published ? "Update" : "Publish"}
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  value={draft.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="A title worth clicking"
                  className="h-11 text-lg"
                />
              </div>
              <div>
                <Label className="text-xs">Slug</Label>
                <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-3">
                  <span className="text-xs text-neutral-400">/blog/</span>
                  <Input
                    value={draft.slug}
                    onChange={(e) => {
                      update("slug", slugify(e.target.value));
                      setSlugTouched(true);
                    }}
                    className="h-9 border-0 bg-transparent px-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Excerpt</Label>
                  <span className="text-[10px] text-neutral-400 tabular-nums">
                    {draft.excerpt.length}/240
                  </span>
                </div>
                <Textarea
                  rows={2}
                  maxLength={240}
                  value={draft.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                  placeholder="Short summary shown in listings and social previews."
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-xs">Body</Label>
              <span className="text-[10px] text-neutral-400 tabular-nums">
                {wordCount} words · {readMinutes} min read
              </span>
            </div>
            <RichEditor
              value={draft.body}
              onChange={(v) => update("body", v)}
              placeholder="Write your post…"
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">Published</p>
                <p className="text-xs text-neutral-500">Visible on the public site</p>
              </div>
              <Switch
                checked={draft.published}
                onCheckedChange={(v) => update("published", v)}
              />
            </div>
            {draft.published && !isNew && (
              <Button variant="outline" size="sm" asChild className="mt-4 w-full">
                <Link to={`/blog/${draft.slug}`} target="_blank">
                  <ExternalLink size={13} /> View live
                </Link>
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="mb-3 text-sm font-medium text-neutral-900">Cover image</p>
            <SingleImageUpload
              value={draft.cover_url}
              onChange={(v) => update("cover_url", v)}
              bucket="thumbnails"
              prefix="blog"
            />
          </div>
        </aside>
      </div>
    </AdminPage>
  );
}
