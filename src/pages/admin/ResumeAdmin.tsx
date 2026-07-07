import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSite } from "@/lib/cms";
import { uploadFile } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/AdminPage";

export default function ResumeAdmin() {
  const { data: site, refetch } = useSite();
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  const onFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF");
      return;
    }
    setBusy(true);
    try {
      const { url } = await uploadFile("resume", file, "current");
      const { error } = await supabase.from("site_settings").update({ resume_url: url }).eq("id", 1);
      if (error) throw error;
      toast.success("Résumé uploaded");
      refetch();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminPage
      eyebrow="Downloadable"
      title="Résumé"
      description="Upload a PDF. The current résumé link on the site points to this file."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
          }}
          className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 transition-colors ${
            over
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-neutral-300 bg-white text-neutral-500 hover:border-neutral-400"
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            hidden
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          {busy ? <Loader2 className="animate-spin" /> : <Upload size={22} />}
          <p className="text-sm font-medium">
            {busy ? "Uploading…" : site?.resume_url ? "Drop to replace résumé" : "Drop PDF or click to upload"}
          </p>
          <p className="text-xs text-neutral-400">PDF only · one file at a time</p>
        </label>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-neutral-500">
            <FileText size={16} />
            <p className="text-xs uppercase tracking-widest">Current file</p>
          </div>
          {site?.resume_url ? (
            <>
              <p className="text-sm text-neutral-900">resume.pdf</p>
              <Button variant="outline" size="sm" asChild className="mt-4 w-full">
                <a href={site.resume_url} target="_blank" rel="noreferrer">
                  <ExternalLink size={12} /> View current
                </a>
              </Button>
            </>
          ) : (
            <p className="text-sm text-neutral-500">No résumé uploaded yet.</p>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
