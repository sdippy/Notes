import React, { useState } from "react";
import type { Editor } from "@tiptap/react";

import {
  List,
  ListOrdered,
  MessageSquareQuote,
  Code,
  Link,
  Images,
  SquareCenterlineDashedVertical,
} from "lucide-react";

import { LinkPopover } from "./LinkPopover";
import { ImagePopover } from "./ImagePopover";

interface EditorMenuProps {
  editor: Editor;
  editorState: {
    isBulletList: boolean;
    isOrderedList: boolean;
    isBlockquote: boolean;
    isCodeBlock: boolean;
    isCode: boolean;
    isLink: boolean;
    isHorizontalRule: boolean;
  } | null;
  onClose: () => void;
}

export function EditorMenu({ editor, editorState }: EditorMenuProps) {
  const [activePopover, setActivePopover] = useState<"link" | "image" | null>(
    null,
  );

  const [linkSelection, setLinkSelection] = useState<{
    from: number;
    to: number;
  } | null>(null);

  const handleOpenLink = (event: React.MouseEvent) => {
    event.preventDefault();

    const { from, to } = editor.state.selection;

    setLinkSelection({
      from,
      to,
    });

    setActivePopover("link");
  };

  return (
    <div className="absolute gap-1 left-0 top-full xl:left-full xl:top-0 xl:ml-5 z-50 mt-5 xl:mt-0 w-full xl:w-80 rounded-xl border border-border-subtle bg-bg-card xl:border-transparent xl:bg-transparent p-2 xl:p-0 xl:py-0.5 shadow-2xl flex justify-center">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().toggleBulletList()}
        className={`rounded-xl px-3 py-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed ${
          editorState!.isBulletList
            ? "text-text-primary font-bold bg-bg-input border-accent"
            : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
        }`}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().toggleOrderedList()}
        className={`rounded-xl px-3 py-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed ${
          editorState!.isOrderedList
            ? "text-text-primary font-bold bg-bg-input border-accent"
            : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
        }`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().toggleBlockquote()}
        className={`rounded-xl px-3 py-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed ${
          editorState!.isBlockquote
            ? "text-text-primary font-bold bg-bg-input border-accent"
            : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input border-transparent"
        }`}
      >
        <MessageSquareQuote size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().toggleCodeBlock()}
        className={`rounded-xl px-3 py-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed ${
          editorState!.isCodeBlock
            ? "text-text-primary font-bold bg-bg-input border-accent"
            : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input disabled:cursor-not-allowed border-transparent"
        }`}
      >
        <Code size={18} />
      </button>

      <button
        type="button"
        onMouseDown={handleOpenLink}
        className={`rounded-xl px-3 py-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed ${
          editorState!.isLink
            ? "text-text-primary font-bold bg-bg-input border-accent"
            : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input disabled:cursor-not-allowed border-transparent"
        }`}
      >
        <Link size={18} />
      </button>
      {activePopover === "link" && linkSelection && (
        <LinkPopover
          editor={editor}
          selection={linkSelection}
          onClose={() => {
            setActivePopover(null);
            setLinkSelection(null);
          }}
        />
      )}

      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          setActivePopover(activePopover === "image" ? null : "image");
        }}
        className={`rounded-xl px-3 py-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed ${
          editorState!.isCodeBlock
            ? "text-text-primary font-bold bg-bg-input border-accent"
            : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input disabled:cursor-not-allowed border-transparent"
        }`}
      >
        <Images size={18} />
      </button>
      {activePopover === "image" && (
        <ImagePopover editor={editor} onClose={() => setActivePopover(null)} />
      )}

      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={!editor.can().setHorizontalRule()}
        className={`rounded-xl px-3 py-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed ${
          editorState!.isHorizontalRule
            ? "text-text-primary font-bold bg-bg-input border-accent"
            : "text-text-secondary font-bold hover:text-text-primary hover:bg-bg-input disabled:cursor-not-allowed border-transparent"
        }`}
      >
        <SquareCenterlineDashedVertical size={18} />
      </button>
    </div>
  );
}
