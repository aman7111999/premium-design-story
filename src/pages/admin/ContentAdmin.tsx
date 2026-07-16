import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAllContent } from "@/lib/cms";
import { AdminPage } from "@/components/admin/AdminPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Trash2, Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { iconKeys } from "@/lib/iconRegistry";
import { clsx } from "clsx";

type Blocks = Record<string, any>;

const KEYS = [
  { key: "nav", label: "Navigation" },
  { key: "footer", label: "Footer" },
  { key: "hero", label: "Home · Hero" },
  { key: "home_featured", label: "Home · Featured Work heading" },
  { key: "home_experience", label: "Home · Experience heading" },
  { key: "home_stats", label: "Home · Stats & About band" },
  { key: "home_testimonials", label: "Home · Testimonials heading" },
  { key: "home_faq", label: "Home · FAQ" },
  { key: "home_cta", label: "Home · Final CTA" },
  { key: "about_hero", label: "About · Hero" },
  { key: "about_timeline", label: "About · Timeline heading" },
  { key: "about_experience", label: "About · Experience heading" },
  { key: "about_education", label: "About · Education heading" },
  { key: "about_tools", label: "About · Tools heading" },
  { key: "about_philosophy", label: "About · Philosophy" },
  { key: "about_working_style", label: "About · Working Style" },
  { key: "about_books", label: "About · Books" },
  { key: "about_values", label: "About · Values" },
  { key: "about_fun_facts", label: "About · Fun Facts" },
  { key: "contact_page", label: "Contact page" },
];

export default function ContentAdmin() {
  const { data: initial, isLoading } = useAllContent();
  const qc = useQueryClient();
  const [blocks, setBlocks] = useState<Blocks>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [openKey, setOpenKey] = useState<string>("nav");

  useEffect(() => {
    if (initial) setBlocks(initial);
  }, [initial]);

  const save = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase
        .from("content_blocks" as any)
        .upsert({ key, data: blocks[key] ?? {} }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: (_d, key) => {
      toast.success("Saved");
      setDirty((s) => ({ ...s, [key]: false }));
      qc.invalidateQueries({ queryKey: ["content_block", key] });
      qc.invalidateQueries({ queryKey: ["content_blocks_all"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const setField = (key: string, path: string[], value: any) => {
    setBlocks((prev) => {
      const next = structuredClone(prev);
      next[key] ??= {};
      let obj = next[key];
      for (let i = 0; i < path.length - 1; i++) {
        obj[path[i]] ??= {};
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
    setDirty((s) => ({ ...s, [key]: true }));
  };

  if (isLoading) {
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
      title="Site content"
      description="Every editable string, list, and item that appears on the public site."
    >
      <div className="space-y-3">
        {KEYS.map(({ key, label }) => {
          const open = openKey === key;
          return (
            <section key={key} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <button
                onClick={() => setOpenKey(open ? "" : key)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">{label}</p>
                  <p className="text-[11px] text-neutral-500">{key}</p>
                </div>
                <div className="flex items-center gap-2">
                  {dirty[key] && (
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); save.mutate(key); }}
                      disabled={save.isPending}
                    >
                      <Save size={13} /> Save
                    </Button>
                  )}
                  <ChevronDown
                    size={16}
                    className={clsx("text-neutral-500 transition-transform", open && "rotate-180")}
                  />
                </div>
              </button>
              {open && (
                <div className="border-t border-neutral-100 p-5">
                  <BlockEditor
                    value={blocks[key] ?? {}}
                    onChange={(path, v) => setField(key, path, v)}
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </AdminPage>
  );
}

// Generic recursive editor for JSON blocks
function BlockEditor({
  value,
  onChange,
  path = [],
}: {
  value: any;
  onChange: (path: string[], v: any) => void;
  path?: string[];
}) {
  if (value == null || typeof value !== "object") return null;

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item: any, i: number) => (
          <div key={i} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-neutral-500">Item {i + 1}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-neutral-500 hover:text-red-600"
                onClick={() => {
                  const next = value.slice();
                  next.splice(i, 1);
                  onChange(path, next);
                }}
              >
                <Trash2 size={13} />
              </Button>
            </div>
            {typeof item === "string" ? (
              <Textarea
                rows={2}
                value={item}
                onChange={(e) => {
                  const next = value.slice();
                  next[i] = e.target.value;
                  onChange(path, next);
                }}
              />
            ) : (
              <BlockEditor
                value={item}
                path={[...path, String(i)]}
                onChange={(sub, v) => {
                  const next = value.slice();
                  const subPath = sub.slice(path.length + 1);
                  let obj = next[i];
                  if (subPath.length === 0) {
                    next[i] = v;
                  } else {
                    obj = structuredClone(obj);
                    let cur = obj;
                    for (let k = 0; k < subPath.length - 1; k++) {
                      cur[subPath[k]] ??= {};
                      cur = cur[subPath[k]];
                    }
                    cur[subPath[subPath.length - 1]] = v;
                    next[i] = obj;
                  }
                  onChange(path, next);
                }}
              />
            )}
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const template = value.length > 0
              ? (typeof value[0] === "string" ? "" : structuredClone(value[0]))
              : "";
            const next = value.slice();
            next.push(typeof template === "string" ? "" : blankify(template));
            onChange(path, next);
          }}
        >
          <Plus size={13} /> Add item
        </Button>
      </div>
    );
  }

  // object
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Object.entries(value).map(([k, v]) => {
        const isLongString = typeof v === "string" && (v.length > 80 || k === "subline" || k === "body" || k === "bio" || k === "a" || k === "quote" || k === "description");
        const fieldPath = [...path, k];
        const spanFull = typeof v === "object" || isLongString;

        return (
          <div key={k} className={spanFull ? "md:col-span-2" : ""}>
            <Label className="text-xs capitalize">{k.replace(/_/g, " ")}</Label>
            {typeof v === "string" ? (
              k === "icon" ? (
                <select
                  className="mt-1 h-9 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm"
                  value={v}
                  onChange={(e) => onChange(fieldPath, e.target.value)}
                >
                  {iconKeys.map((ik) => <option key={ik} value={ik}>{ik}</option>)}
                </select>
              ) : k === "tint" ? (
                <select
                  className="mt-1 h-9 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm"
                  value={v}
                  onChange={(e) => onChange(fieldPath, e.target.value)}
                >
                  <option value="accent">accent</option>
                  <option value="text">text</option>
                </select>
              ) : isLongString ? (
                <Textarea
                  rows={3}
                  value={v}
                  className="mt-1"
                  onChange={(e) => onChange(fieldPath, e.target.value)}
                />
              ) : (
                <Input
                  value={v}
                  className="mt-1"
                  onChange={(e) => onChange(fieldPath, e.target.value)}
                />
              )
            ) : typeof v === "number" ? (
              <Input
                type="number"
                value={v}
                className="mt-1"
                onChange={(e) => onChange(fieldPath, Number(e.target.value))}
              />
            ) : typeof v === "boolean" ? (
              <div className="mt-2">
                <input
                  type="checkbox"
                  checked={v}
                  onChange={(e) => onChange(fieldPath, e.target.checked)}
                />
              </div>
            ) : (
              <div className="mt-2 rounded-lg border border-neutral-200 p-3">
                <BlockEditor value={v} path={fieldPath} onChange={onChange} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function blankify(template: any): any {
  if (template == null) return "";
  if (Array.isArray(template)) return [];
  if (typeof template === "object") {
    const out: any = {};
    for (const k of Object.keys(template)) {
      const v = template[k];
      out[k] = typeof v === "string" ? "" : typeof v === "number" ? 0 : blankify(v);
    }
    return out;
  }
  if (typeof template === "string") return "";
  if (typeof template === "number") return 0;
  return template;
}
