import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Minus } from "lucide-react";
import { uploadFile } from "@/lib/cms";
import { toast } from "sonner";
import { useEffect } from "react";

export function RichEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline" } }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Write…" }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-[240px] focus:outline-none px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url } = await uploadFile("project-images", file, "editor");
        editor.chain().focus().setImage({ src: url }).run();
      } catch (e) {
        toast.error((e as Error).message);
      }
    };
    input.click();
  };

  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btn = "h-8 w-8 p-0";
  return (
    <div className="rounded-md border border-input bg-white">
      <div className="flex flex-wrap gap-1 border-b border-hairline p-2">
        <Button type="button" variant={editor.isActive("bold") ? "secondary" : "ghost"} size="sm" className={btn} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></Button>
        <Button type="button" variant={editor.isActive("italic") ? "secondary" : "ghost"} size="sm" className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></Button>
        <Button type="button" variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"} size="sm" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></Button>
        <Button type="button" variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"} size="sm" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></Button>
        <Button type="button" variant={editor.isActive("bulletList") ? "secondary" : "ghost"} size="sm" className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></Button>
        <Button type="button" variant={editor.isActive("orderedList") ? "secondary" : "ghost"} size="sm" className={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></Button>
        <Button type="button" variant={editor.isActive("blockquote") ? "secondary" : "ghost"} size="sm" className={btn} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></Button>
        <Button type="button" variant="ghost" size="sm" className={btn} onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></Button>
        <Button type="button" variant={editor.isActive("link") ? "secondary" : "ghost"} size="sm" className={btn} onClick={addLink}><LinkIcon size={14} /></Button>
        <Button type="button" variant="ghost" size="sm" className={btn} onClick={addImage}><ImageIcon size={14} /></Button>
        <span className="mx-1 h-6 w-px bg-hairline" />
        <Button type="button" variant="ghost" size="sm" className={btn} onClick={() => editor.chain().focus().undo().run()}><Undo size={14} /></Button>
        <Button type="button" variant="ghost" size="sm" className={btn} onClick={() => editor.chain().focus().redo().run()}><Redo size={14} /></Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
