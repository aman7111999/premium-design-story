import { useCallback, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uploadFile } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { GripVertical, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type GalleryImage = { url: string; path?: string; caption?: string };

export function ImageGallery({ value, onChange, bucket = "project-images" }: { value: GalleryImage[]; onChange: (v: GalleryImage[]) => void; bucket?: string }) {
  const [uploading, setUploading] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onFiles = useCallback(async (files: FileList) => {
    setUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((f) => uploadFile(bucket, f, "gallery")));
      onChange([...value, ...uploads.map((u) => ({ url: u.url, path: u.path }))]);
      toast.success(`Uploaded ${uploads.length} image${uploads.length > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }, [value, onChange, bucket]);

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIdx = value.findIndex((_, i) => `img-${i}` === e.active.id);
    const newIdx = value.findIndex((_, i) => `img-${i}` === e.over!.id);
    onChange(arrayMove(value, oldIdx, newIdx));
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-3 py-2 text-sm hover:bg-neutral-50">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          <span>Upload images</span>
          <input type="file" accept="image/*" multiple hidden disabled={uploading} onChange={(e) => e.target.files && onFiles(e.target.files)} />
        </label>
        <p className="text-xs text-[var(--color-muted)]">Drag to reorder</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((_, i) => `img-${i}`)} strategy={rectSortingStrategy}>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {value.map((img, i) => (
              <SortableItem key={`img-${i}`} id={`img-${i}`} img={img} onRemove={() => remove(i)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ id, img, onRemove }: { id: string; img: GalleryImage; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className="group relative aspect-video overflow-hidden rounded-md border border-hairline bg-neutral-100"
    >
      <img src={img.url} alt="" className="h-full w-full object-cover" />
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag"
        className="absolute left-2 top-2 rounded bg-white/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        type="button"
      >
        <GripVertical size={14} />
      </button>
      <button
        onClick={onRemove}
        aria-label="Remove"
        type="button"
        className="absolute right-2 top-2 rounded bg-white/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function SingleImageUpload({ value, onChange, bucket, prefix }: { value: string | null; onChange: (url: string | null) => void; bucket: string; prefix?: string }) {
  const [busy, setBusy] = useState(false);
  const onFile = async (file: File) => {
    setBusy(true);
    try {
      const { url } = await uploadFile(bucket, file, prefix);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };
  return (
    <div className="flex items-center gap-4">
      <div className="h-24 w-32 rounded border border-hairline bg-neutral-100" style={{ background: value ? `center/cover url(${value})` : undefined }} />
      <div className="space-y-2">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-3 py-2 text-sm hover:bg-neutral-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          <span>{value ? "Replace" : "Upload"}</span>
          <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange(null)}>Remove</Button>
        )}
      </div>
    </div>
  );
}
