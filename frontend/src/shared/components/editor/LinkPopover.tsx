import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

interface LinkPopoverProps {
  editor: Editor;
  onClose: () => void;
  selection: {
    from: number;
    to: number;
  };
}

export function LinkPopover({ editor, onClose, selection }: LinkPopoverProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const currentUrl = editor.getAttributes("link").href ?? "";

    setUrl(currentUrl);
  }, [editor]);

  const handleSubmit = () => {
    const value = url.trim();

    if (!value) {
      editor.chain().setTextSelection(selection).unsetLink().run();
      onClose();
      return;
    }

    editor
      .chain()
      .setTextSelection(selection)
      .setLink({
        href: value,
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run();

    onClose();
  };

  return (
    <div
      className="absolute left-0 top-full z-50 mt-5 w-full sm:w-80 rounded-xl border border-border-subtle bg-bg-card p-3 shadow-2xl"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="mb-2 text-xs font-medium text-text-secondary">
        URL ссылки
      </div>
      <input
        autoFocus
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
          }

          if (event.key === "Escape") {
            onClose();
          }
        }}
        placeholder="https://example.com"
        className="w-full rounded-xl border border-border-subtle bg-bg-input px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-border-focus"
      />

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-3 py-2 text-sm text-text-secondary hover:bg-bg-hover cursor-pointer"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!url.trim()}
          className="rounded-xl bg-accent px-3 py-2 text-sm text-bg-main hover:opacity-90 cursor-pointer"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
