import { useState, useRef, useEffect } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  Settings2,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
} from "lucide-react";

import { EditorMenu } from "./EditorMenu";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor!.isActive("bold"),
      isItalic: ctx.editor!.isActive("italic"),
      isUnderline: ctx.editor!.isActive("underline"),
      isStrike: ctx.editor!.isActive("strike"),

      isH1: ctx.editor!.isActive("heading", { level: 1 }),
      isH2: ctx.editor!.isActive("heading", { level: 2 }),
      isH3: ctx.editor!.isActive("heading", { level: 3 }),

      isLeftAlign: ctx.editor!.isActive({ textAlign: "left" }),
      isCenterAlign: ctx.editor!.isActive({ textAlign: "center" }),
      isRightAlign: ctx.editor!.isActive({ textAlign: "right" }),

      isBulletList: ctx.editor!.isActive("bulletList"),
      isOrderedList: ctx.editor!.isActive("orderedList"),
      isBlockquote: ctx.editor!.isActive("blockquote"),
      isCodeBlock: ctx.editor!.isActive("codeBlock"),
      isHorizontalRule: ctx.editor!.isActive("horizontalRule"),
      isCode: ctx.editor!.isActive("code"),
      isLink: ctx.editor!.isActive("link"),
    }),
  });

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full xl:flex-row gap-2 border-b border-t border-border-subtle p-2">
      <div className="flex items-center justify-center xl:justify-start gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isBold
              ? "text-text-primary font-bold bg-bg-input border-accent"
              : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isItalic
              ? "text-text-primary font-bold italic bg-bg-input border-accent"
              : "text-text-secondary font-bold italic hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().toggleStrike()}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isStrike
              ? "text-text-primary font-bold line-through bg-bg-input border-accent"
              : "text-text-secondary font-bold line-through hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          S
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().toggleUnderline()}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isUnderline
              ? "text-text-primary font-bold underline bg-bg-input border-accent"
              : "text-text-secondary font-bold underline hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          U
        </button>

        <div className="mx-1 h-6 w-px bg-white/30" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={!editor.can().toggleHeading({ level: 1 })}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isH1
              ? "text-text-primary font-bold bg-bg-input border-accent"
              : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={!editor.can().toggleHeading({ level: 2 })}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isH2
              ? "text-text-primary font-bold bg-bg-input border-accent"
              : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={!editor.can().toggleHeading({ level: 3 })}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isH3
              ? "text-text-primary font-bold bg-bg-input border-accent"
              : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          H3
        </button>

        <div className="mx-1 h-6 w-px bg-white/30 hidden xl:flex" />
      </div>

      <div className="flex items-center justify-center xl:justify-start gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          disabled={!editor.can().setTextAlign("left")}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isLeftAlign
              ? "text-text-primary font-bold bg-bg-input border-accent"
              : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          <AlignHorizontalJustifyStart size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          disabled={!editor.can().setTextAlign("center")}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isCenterAlign
              ? "text-text-primary font-bold bg-bg-input border-accent"
              : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          <AlignHorizontalJustifyCenter size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          disabled={!editor.can().setTextAlign("right")}
          className={`rounded-xl px-3 py-1.5 text-[16px] border transition-all cursor-pointer disabled:cursor-not-allowed ${
            editorState?.isRightAlign
              ? "text-text-primary font-bold bg-bg-input border-accent"
              : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
        >
          <AlignHorizontalJustifyEnd size={18} />
        </button>

        <div className="mx-1 h-6 w-px bg-white/30 hidden xl:flex" />
      </div>

      <div
        ref={menuRef}
        className="relative flex items-center justify-center w-full xl:w-auto"
      >
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            setIsMenuOpen((value) => !value);
          }}
          className={`rounded-xl justify-center border w-full xl:w-auto flex items-center gap-2 px-3 py-1.5 transition-all cursor-pointer disabled:cursor-not-allowed ${
            isMenuOpen
              ? "text-text-primary bg-bg-input border-accent"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-input border-transparent"
          }`}
          aria-expanded={isMenuOpen}
          aria-label="Дополнительные инструменты"
        >
          <div
            className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}
          >
            <Settings2 size={18} />
          </div>
        </button>

        {isMenuOpen && (
          <EditorMenu
            editor={editor}
            editorState={editorState}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
