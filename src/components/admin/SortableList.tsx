import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { clsx } from "clsx";

export type SortableItem = { id: string };

/**
 * Vertical drag-to-reorder list. Renders each item with a drag handle.
 * `onReorder` gets the new ordered array of ids.
 */
export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
  className,
}: {
  items: T[];
  onReorder: (ids: string[]) => void;
  renderItem: (item: T, handle: ReactNode, isDragging: boolean) => ReactNode;
  className?: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleEnd = useCallback(
    (e: DragEndEvent) => {
      if (!e.over || e.active.id === e.over.id) return;
      const oldIdx = items.findIndex((i) => i.id === e.active.id);
      const newIdx = items.findIndex((i) => i.id === e.over!.id);
      if (oldIdx < 0 || newIdx < 0) return;
      onReorder(arrayMove(items, oldIdx, newIdx).map((i) => i.id));
    },
    [items, onReorder],
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className={clsx("space-y-3", className)}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id} item={item} renderItem={renderItem} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow<T extends SortableItem>({
  id,
  item,
  renderItem,
}: {
  id: string;
  item: T;
  renderItem: (item: T, handle: ReactNode, isDragging: boolean) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const handle = (
    <button
      type="button"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
      className="grid h-8 w-6 shrink-0 cursor-grab place-items-center text-neutral-400 hover:text-neutral-700 active:cursor-grabbing"
    >
      <GripVertical size={16} />
    </button>
  );

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : undefined,
        opacity: isDragging ? 0.9 : 1,
      }}
    >
      {renderItem(item, handle, isDragging)}
    </li>
  );
}

/** Debounced tracker so callers can persist reorders without spamming the DB. */
export function useReorderDebounce<T>(ms = 400) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pending, setPending] = useState<T | null>(null);
  const schedule = (payload: T, run: (p: T) => void) => {
    setPending(payload);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      run(payload);
      setPending(null);
    }, ms);
  };
  return { schedule, pending };
}
