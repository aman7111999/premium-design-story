import { useCallback, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uploadFile } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { GripVertical, Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";

export type GalleryImage = { url: string; path?: string; caption?: string };

/* ============================================================
   DropZone — reusable file drop zone with visual affordance.
   ============================================================ */
export function DropZone({
  onFiles,
  accept = "image/*",
  multiple = true,
  disabled,
  busy,
  compact,
  children,
}: {
  onFiles: (files: FileList) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  busy?: boolean;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (files?: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;
    void onFiles(files);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files);
      }}
      className={clsx(
        "group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
        compact ? "px-4 py-4" : "px-6 py-10",
        over
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-neutral-300 bg-neutral-50 text-neutral-500 hover:border-neutral-400 hover:bg-white",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled || busy}
        onChange={(e) => handle(e.target.files)}
      />
      {busy ? (
        <Loader2 className="animate-spin" size={compact ? 16 : 20} />
      ) : (
        <ImageIcon size={compact ? 16 : 22} />
      )}
      {children ?? (
        <>
          <p className={clsx("font-medium", compact ? "text-xs" : "text-sm")}>
            {busy ? "Uploading…" : "Drop files or click to upload"}
          </p>
          {!compact && (
            <p className="text-xs text-neutral-400">PNG, JPG, WEBP · up to 10MB each</p>
          )}
        </>
      )}
    </label>
  );
}

/* ============================================================
   Gallery — drag-to-reorder + drop-to-upload.
   ============================================================ */
export function ImageGallery({
  value,
  onChange,
  bucket = "project-images",
}: {
  value: GalleryImage[];
  onChange: (v: GalleryImage[]) => void;
  bucket?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onFiles = useCallback(
    async (files: FileList) => {
      setUploading(true);
      setProgress({ done: 0, total: files.length });
      try {
        const uploaded: GalleryImage[] = [];
        for (const file of Array.from(files)) {
          const u = await uploadFile(bucket, file, "gallery");
          uploaded.push({ url: u.url, path: u.path });
          setProgress((p) => (p ? { ...p, done: p.done + 1 } : null));
        }
        onChange([...value, ...uploaded]);
        toast.success(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? "s" : ""}`);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setUploading(false);
        setProgress(null);
      }
    },
    [value, onChange, bucket],
  );

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIdx = value.findIndex((_, i) => `img-${i}` === e.active.id);
    const newIdx = value.findIndex((_, i) => `img-${i}` === e.over!.id);
    onChange(arrayMove(value, oldIdx, newIdx));
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const updateCaption = (i: number, caption: string) =>
    onChange(value.map((img, idx) => (idx === i ? { ...img, caption } : img)));

  return (
    <div className="space-y-3">
      <DropZone onFiles={onFiles} busy={uploading} compact={value.length > 0} />
      {progress && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${(progress.done / progress.total) * 100}%` }}
          />
        </div>
      )}

      {value.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value.map((_, i) => `img-${i}`)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {value.map((img, i) => (
                <SortableItem
                  key={`img-${i}`}
                  id={`img-${i}`}
                  img={img}
                  index={i}
                  onRemove={() => remove(i)}
                  onCaption={(v) => updateCaption(i, v)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <p className="text-xs text-neutral-500">
        {value.length} image{value.length === 1 ? "" : "s"} · drag to reorder · click a card to add a
        caption
      </p>
    </div>
  );
}

function SortableItem({
  id,
  img,
  index,
  onRemove,
  onCaption,
}: {
  id: string;
  img: GalleryImage;
  index: number;
  onRemove: () => void;
  onCaption: (v: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={clsx(
        "group relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow",
        isDragging ? "shadow-xl" : "hover:shadow-md",
      )}
    >
      <div className="relative aspect-video bg-neutral-100">
        <img src={img.url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag"
          className="absolute right-10 top-2 rounded bg-white/95 p-1 opacity-0 shadow transition-opacity group-hover:opacity-100"
          type="button"
        >
          <GripVertical size={14} />
        </button>
        <button
          onClick={onRemove}
          aria-label="Remove"
          type="button"
          className="absolute right-2 top-2 rounded bg-white/95 p-1 opacity-0 shadow transition-opacity hover:bg-red-500 hover:text-white group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
      <input
        value={img.caption ?? ""}
        onChange={(e) => onCaption(e.target.value)}
        placeholder="Caption (optional)"
        className="w-full border-t border-neutral-200 bg-transparent px-3 py-2 text-xs focus:bg-neutral-50 focus:outline-none"
      />
    </div>
  );
}

/* ============================================================
   Single image upload — drop zone + preview + replace.
   ============================================================ */
export function SingleImageUpload({
  value,
  onChange,
  bucket,
  prefix,
  aspect = "video",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: string;
  prefix?: string;
  aspect?: "video" | "square" | "portrait";
}) {
  const [busy, setBusy] = useState(false);
  const onFile = async (file: File) => {
    setBusy(true);
    try {
      const { url } = await uploadFile(bucket, file, prefix);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const aspectClass =
    aspect === "square" ? "aspect-square" : aspect === "portrait" ? "aspect-[3/4]" : "aspect-video";

  if (!value) {
    return (
      <DropZone
        onFiles={(files) => files[0] && onFile(files[0])}
        multiple={false}
        busy={busy}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          "relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100",
          aspectClass,
        )}
      >
        <img src={value} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-black/40 text-white">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50">
          <Upload size={12} /> Replace
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </label>
        <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
          Remove
        </Button>
      </div>
    </div>
  );
}
