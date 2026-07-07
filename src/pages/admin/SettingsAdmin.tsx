import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSite, type SiteSettings } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Save, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { SingleImageUpload } from "@/components/admin/ImageUploader";
import { AdminPage } from "@/components/admin/AdminPage";

export default function SettingsAdmin() {
  const { data: site, isLoading, refetch } = useSite();
  const qc = useQueryClient();
  const [d, setD] = useState<SiteSettings | null>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (site) {
      setD(site);
      setDirty(false);
    }
  }, [site]);

  const update = (patch: Partial<SiteSettings>) => {
    setD((prev) => (prev ? { ...prev, ...patch } : prev));
    setDirty(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!d) return;
      const { error } = await supabase.from("site_settings").update(d as any).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["site"] });
      setDirty(false);
      refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !d) {
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <AdminPage
      wide
      eyebrow="Global"
      title="Site settings"
      description={dirty ? "Unsaved changes" : "All changes saved"}
      actions={
        <Button size="sm" onClick={() => save.mutate()} disabled={!dirty || save.isPending}>
          {save.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : dirty ? (
            <Save size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          Save
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Section title="Identity">
            <div className="grid gap-4 md:grid-cols-2">
              <F label="Name">
                <Input value={d.name ?? ""} onChange={(e) => update({ name: e.target.value })} />
              </F>
              <F label="Email">
                <Input value={d.email ?? ""} onChange={(e) => update({ email: e.target.value })} />
              </F>
              <div className="md:col-span-2">
                <F label="Tagline" hint="One-liner shown in the site header.">
                  <Input
                    value={d.tagline ?? ""}
                    onChange={(e) => update({ tagline: e.target.value })}
                  />
                </F>
              </div>
              <div className="md:col-span-2">
                <F label="Bio" hint="Multi-paragraph OK — split with blank lines.">
                  <Textarea
                    rows={5}
                    value={d.bio ?? ""}
                    onChange={(e) => update({ bio: e.target.value })}
                  />
                </F>
              </div>
              <F label="Location">
                <Input
                  value={d.location ?? ""}
                  onChange={(e) => update({ location: e.target.value })}
                />
              </F>
            </div>
          </Section>

          <Section title="Socials" description="Links surfaced in the footer and About page.">
            <div className="space-y-2">
              {(d.socials ?? []).map((s, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    className="w-40"
                    placeholder="LinkedIn"
                    value={s.label}
                    onChange={(e) => {
                      const next = [...d.socials];
                      next[i] = { ...next[i], label: e.target.value };
                      update({ socials: next });
                    }}
                  />
                  <Input
                    placeholder="https://…"
                    value={s.url}
                    onChange={(e) => {
                      const next = [...d.socials];
                      next[i] = { ...next[i], url: e.target.value };
                      update({ socials: next });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-500 hover:text-red-600"
                    onClick={() => update({ socials: d.socials.filter((_, idx) => idx !== i) })}
                    aria-label="Remove"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => update({ socials: [...(d.socials ?? []), { label: "", url: "" }] })}
              >
                <Plus size={13} /> Add social
              </Button>
            </div>
          </Section>
        </div>

        <aside className="space-y-4">
          <Section title="Profile image">
            <SingleImageUpload
              value={d.profile_image_url}
              onChange={(v) => update({ profile_image_url: v })}
              bucket="profile"
              aspect="portrait"
            />
          </Section>
        </aside>
      </div>
    </AdminPage>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white">
      <header className="border-b border-neutral-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-neutral-500">{description}</p>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-neutral-500">{hint}</p>}
    </div>
  );
}
