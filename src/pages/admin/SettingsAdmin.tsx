import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSite, type SiteSettings } from "@/lib/cms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SingleImageUpload } from "@/components/admin/ImageUploader";

export default function SettingsAdmin() {
  const { data: site, isLoading, refetch } = useSite();
  const qc = useQueryClient();
  const [d, setD] = useState<SiteSettings | null>(null);
  useEffect(() => { if (site) setD(site); }, [site]);

  const save = useMutation({
    mutationFn: async () => {
      if (!d) return;
      const { error } = await supabase.from("site_settings").update(d as any).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["site"] }); refetch(); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !d) return <Loader2 className="animate-spin" />;

  return (
    <div>
      <header className="mb-6 flex justify-between items-end">
        <div><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Global</p><h1 className="font-display text-4xl mt-1">Site settings</h1></div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save</>}</Button>
      </header>
      <div className="space-y-4">
        <Card className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Name</Label><Input value={d.name ?? ""} onChange={(e) => setD({ ...d, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={d.email ?? ""} onChange={(e) => setD({ ...d, email: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Tagline</Label><Input value={d.tagline ?? ""} onChange={(e) => setD({ ...d, tagline: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Bio</Label><Textarea rows={3} value={d.bio ?? ""} onChange={(e) => setD({ ...d, bio: e.target.value })} /></div>
            <div><Label>Location</Label><Input value={d.location ?? ""} onChange={(e) => setD({ ...d, location: e.target.value })} /></div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-3">Profile image</h3>
          <SingleImageUpload value={d.profile_image_url} onChange={(v) => setD({ ...d, profile_image_url: v })} bucket="profile" />
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-3">Socials</h3>
          <div className="space-y-2">
            {(d.socials ?? []).map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input className="w-40" placeholder="LinkedIn" value={s.label} onChange={(e) => {
                  const next = [...d.socials]; next[i] = { ...next[i], label: e.target.value }; setD({ ...d, socials: next });
                }} />
                <Input placeholder="https://…" value={s.url} onChange={(e) => {
                  const next = [...d.socials]; next[i] = { ...next[i], url: e.target.value }; setD({ ...d, socials: next });
                }} />
                <Button variant="ghost" size="icon" onClick={() => setD({ ...d, socials: d.socials.filter((_, idx) => idx !== i) })}><Trash2 size={14} /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setD({ ...d, socials: [...(d.socials ?? []), { label: "", url: "" }] })}><Plus size={14} /> Add social</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
