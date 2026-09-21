import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

import { Clock, Star } from "lucide-react";

import { EditorToolbar } from "@/shared/components/editor/EditorToolbar";
import "./editor.css";

interface NoteEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel?: () => void;
}

export function NoteEditor({
  initialContent = "",
  onSave,
  onCancel,
}: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Highlight.configure({
        multicolor: true,
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      TaskList,

      TaskItem.configure({
        nested: true,
      }),

      Placeholder.configure({ placeholder: "Начните писать заметку..." }),
    ],

    content: initialContent,

    editorProps: {
      attributes: {
        class:
          "min-h-[600px] px-5 py-4 outline-none prose prose-invert max-w-none",
      },
    },
  });

  const handleSave = () => {
    if (!editor) {
      return;
    }
    const content = editor.getHTML();

    onSave(content);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col border-b border-border-subtle">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <div className="mt-auto flex justify-between py-4">
        <span className="text-text-secondary flex items-center gap-2 text-[14px]">
          <Clock size={18} />
          Автосохранения включено
        </span>
        <button
          type="button"
          className="text-accent hover:border-accent flex cursor-pointer items-center gap-2 border-b border-transparent text-[14px] font-medium transition-all duration-200"
        >
          <Star size={18} />В избранное
        </button>
      </div>
    </div>
  );
}
