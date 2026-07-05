import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSite } from "@/lib/cms";
import { uploadFile } from "@/lib/cms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ResumeAdmin() {
  const { data: site, refetch } = useSite();
  const [busy, setBusy] = useState(false);
  const onFile = async (file: File) => {
    setBusy(true);
    try {
      const { url } = await uploadFile("resume", file, "current");
      const { error } = await supabase.from("site_settings").update({ resume_url: url }).eq("id", 1);
      if (error) throw error;
      toast.success("Résumé uploaded");
      refetch();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };
  return (
    <div>
      <header className="mb-6"><p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Downloadable</p><h1 className="font-display text-4xl mt-1">Résumé</h1></header>
      <Card className="p-6 space-y-4">
        <p className="text-sm text-[var(--color-muted)]">Upload a PDF. The current résumé link on the site points to this file.</p>
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-4 py-2 text-sm hover:bg-neutral-50 w-fit">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          <span>{site?.resume_url ? "Replace résumé" : "Upload résumé"}</span>
          <input type="file" accept="application/pdf" hidden disabled={busy} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
        {site?.resume_url && (
          <a href={site.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline">
            View current résumé <ExternalLink size={12} />
          </a>
        )}
      </Card>
    </div>
  );
}
