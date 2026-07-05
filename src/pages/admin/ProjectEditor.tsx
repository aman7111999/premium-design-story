import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectRow } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, ExternalLink, X, Plus } from "lucide-react";
import { RichEditor } from "@/components/admin/RichEditor";
import { ImageGallery, SingleImageUpload, type GalleryImage } from "@/components/admin/ImageUploader";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Draft = Partial<ProjectRow> & { title: string; slug: string };

const emptyDraft: Draft = {
  title: "", slug: "", short_description: "", overview: "", problem_statement: "",
  research: "", design_process: "", solution: "", outcome: "", learnings: "",
  role: "", duration: "", company: "", tools: [], tags: [], category: "", timeline: "",
  thumbnail_url: null, gallery: [], links: [], metrics: [], featured: false, published: false, sort_order: 0,
};

export default function ProjectEditor() {
  const { id } = useParams();
  const isNew = !id;
  const nav = useNavigate();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const { isLoading } = useQuery({
    queryKey: ["project-edit", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      if (data) setDraft(data as unknown as Draft);
      return data;
    },
  });

  useEffect(() => {
    if (isNew && !slugTouched && draft.title) {
      setDraft((d) => ({ ...d, slug: slugify(d.title) }));
    }
  }, [draft.title, slugTouched, isNew]);

  const save = useMutation({
    mutationFn: async (publish?: boolean) => {
      const payload = {
        ...draft,
        published: publish ?? draft.published ?? false,
        gallery: draft.gallery ?? [],
        links: draft.links ?? [],
        metrics: draft.metrics ?? [],
        tools: draft.tools ?? [],
        tags: draft.tags ?? [],
      };
      // Remove read-only fields
      delete (payload as any).created_at;
      delete (payload as any).updated_at;
      if (isNew) {
        delete (payload as any).id;
        const { data, error } = await supabase.from("projects").insert(payload as any).select("id").single();
        if (error) throw error;
        return data.id as string;
      } else {
        const { error } = await supabase.from("projects").update(payload as any).eq("id", id!);
        if (error) throw error;
        return id!;
      }
    },
    onSuccess: (newId, publish) => {
      toast.success(publish ? "Published" : "Saved");
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project"] });
      if (isNew) nav(`/admin/projects/${newId}`, { replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isNew && isLoading) return <div className="grid place-items-center py-20"><Loader2 className="animate-spin" /></div>;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/admin/projects"><ArrowLeft size={16} /></Link></Button>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Project</p>
            <h1 className="font-display text-3xl">{draft.title || "Untitled"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {draft.published && !isNew && (
            <Button variant="outline" asChild>
              <Link to={`/projects/${draft.slug}`} target="_blank"><ExternalLink size={14} /> Preview</Link>
            </Button>
          )}
          <Button variant="outline" onClick={() => save.mutate(false)} disabled={save.isPending}>
            <Save size={14} /> Save draft
          </Button>
          <Button onClick={() => save.mutate(true)} disabled={save.isPending}>
            {save.isPending ? <Loader2 size={14} className="animate-spin" /> : "Publish"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <Field label="Title"><Input value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Project title" /></Field>
            <Field label="Slug"><Input value={draft.slug} onChange={(e) => { set("slug", slugify(e.target.value)); setSlugTouched(true); }} /></Field>
            <Field label="Short description"><Textarea rows={2} value={draft.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} /></Field>
          </Card>

          <Card className="p-6">
            <Tabs defaultValue="overview">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="problem">Problem</TabsTrigger>
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="design">Design process</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="outcome">Outcome</TabsTrigger>
                <TabsTrigger value="learnings">Learnings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview"><RichEditor value={draft.overview ?? ""} onChange={(v) => set("overview", v)} placeholder="Overview…" /></TabsContent>
              <TabsContent value="problem"><RichEditor value={draft.problem_statement ?? ""} onChange={(v) => set("problem_statement", v)} placeholder="The problem…" /></TabsContent>
              <TabsContent value="research"><RichEditor value={draft.research ?? ""} onChange={(v) => set("research", v)} placeholder="Research…" /></TabsContent>
              <TabsContent value="design"><RichEditor value={draft.design_process ?? ""} onChange={(v) => set("design_process", v)} placeholder="Design process…" /></TabsContent>
              <TabsContent value="solution"><RichEditor value={draft.solution ?? ""} onChange={(v) => set("solution", v)} placeholder="Solution…" /></TabsContent>
              <TabsContent value="outcome"><RichEditor value={draft.outcome ?? ""} onChange={(v) => set("outcome", v)} placeholder="Outcome & impact…" /></TabsContent>
              <TabsContent value="learnings"><RichEditor value={draft.learnings ?? ""} onChange={(v) => set("learnings", v)} placeholder="Reflections…" /></TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-3">Gallery</h3>
            <ImageGallery
              value={(draft.gallery as GalleryImage[]) ?? []}
              onChange={(v) => set("gallery", v as any)}
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-3">Metrics</h3>
            <ChipListEditor
              items={(draft.metrics ?? []).map((m) => `${m.label}=${m.value}`)}
              onChange={(items) => set("metrics", items.map((x) => {
                const [label, value] = x.split("=");
                return { label: label ?? "", value: value ?? "" };
              }) as any)}
              placeholder="Label=Value"
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-3">Links</h3>
            <ChipListEditor
              items={(draft.links ?? []).map((l) => `${l.label}=${l.url}`)}
              onChange={(items) => set("links", items.map((x) => {
                const [label, url] = x.split("=");
                return { label: label ?? "", url: url ?? "" };
              }) as any)}
              placeholder="Label=https://..."
            />
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Published</Label>
              <Switch checked={!!draft.published} onCheckedChange={(v) => set("published", v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch checked={!!draft.featured} onCheckedChange={(v) => set("featured", v)} />
            </div>
            <Field label="Sort order"><Input type="number" value={draft.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} /></Field>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-3">Thumbnail</h3>
            <SingleImageUpload value={draft.thumbnail_url ?? null} onChange={(v) => set("thumbnail_url", v)} bucket="thumbnails" prefix="projects" />
          </Card>

          <Card className="p-6 space-y-4">
            <Field label="Role"><Input value={draft.role ?? ""} onChange={(e) => set("role", e.target.value)} /></Field>
            <Field label="Company"><Input value={draft.company ?? ""} onChange={(e) => set("company", e.target.value)} /></Field>
            <Field label="Category"><Input value={draft.category ?? ""} onChange={(e) => set("category", e.target.value)} /></Field>
            <Field label="Duration"><Input value={draft.duration ?? ""} onChange={(e) => set("duration", e.target.value)} placeholder="6 months · 2024" /></Field>
            <Field label="Timeline"><Input value={draft.timeline ?? ""} onChange={(e) => set("timeline", e.target.value)} /></Field>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-3">Tools</h3>
            <ChipListEditor items={draft.tools ?? []} onChange={(v) => set("tools", v)} placeholder="Figma" />
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-3">Tags</h3>
            <ChipListEditor items={draft.tags ?? []} onChange={(v) => set("tags", v)} placeholder="research" />
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function ChipListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (!v) return;
    onChange([...items, v]);
    setVal("");
  };
  return (
    <div>
      <div className="flex gap-2">
        <Input value={val} placeholder={placeholder} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button type="button" variant="outline" size="icon" onClick={add}><Plus size={14} /></Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary" className="gap-1">
            {item}
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="hover:opacity-70"><X size={12} /></button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
