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
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <div>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Отмена
          </button>
        )}

        <button type="button" onClick={handleSave}>
          Сохранить
        </button>
      </div>
    </div>
  );
}
