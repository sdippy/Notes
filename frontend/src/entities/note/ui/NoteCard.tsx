import { useEffect, useRef, useState } from "react";
import { Ellipsis, Pencil, Star, Trash2 } from "lucide-react";
import { useDeleteNoteModalStore } from "@/features/note-delete/deleteNoteModalStore";
import { type Note, formatMiddleTimeAgoRu } from "@/shared/types";

interface NoteCardType {
  note: Note;
  animationDelay?: number;
}

function NoteMeta({
  isPinned,
  content,
}: {
  isPinned: boolean;
  content: string;
}) {
  if (isPinned) {
    return (
      <div className="flex gap-2 items-center">
        <Star size={11} className="text-accent" />
        <span className="text-[14px] text-text-secondary font-semibold">
          Важное
        </span>
      </div>
    );
  }

  const linesCount = content.split("\n").length;
  const lastDigit = linesCount % 10;
  const lastTwoDigits = linesCount % 100;
  const linesTitle =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? "строк"
      : lastDigit === 1
        ? "строка"
        : lastDigit >= 2 && lastDigit <= 4
          ? "строки"
          : "строк";

  return (
    <span className="text-[14px] text-text-secondary font-semibold">
      {linesCount} {linesTitle}
    </span>
  );
}

export default function NoteCard({ note, animationDelay = 0 }: NoteCardType) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const openDeleteModal = useDeleteNoteModalStore(
    (state) => state.openDeleteModal,
  );

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const maxWords = 20;
  const words = note.content?.split(" ") || [];
  const isLongText = words.length > maxWords;

  const truncatedContent = isLongText
    ? words.slice(0, maxWords).join(" ") + "..."
    : note.content;

  const tag = note.tags?.[0];

  return (
    <div
      style={{ animationDelay: `${animationDelay}ms` }}
      className="flex animate-[note-reveal_450ms_ease-out_both] cursor-pointer flex-col gap-4 rounded-xl border border-border-subtle bg-bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_10px_35px_rgba(16,185,129,0.08)]"
    >
      <div className="grid grid-cols-2">
        <div className="flex gap-2 items-center">
          {tag && (
            <>
              <div
                style={{ backgroundColor: tag.color }}
                className="size-2.5 rounded-full"
              ></div>
              <h2 className="rounded-md border border-border-subtle bg-bg-input/70 px-2 py-1 text-[12px] font-semibold text-text-primary">
                {tag.name}
              </h2>
            </>
          )}
        </div>

        <div ref={menuRef} className="relative col-start-2">
          <button
            type="button"
            aria-label={`Действия с заметкой «${note.title}»`}
            aria-expanded={isMenuOpen}
            title="Действия с заметкой"
            onClick={() => {
              setIsMenuOpen((isOpen) => !isOpen);
            }}
            className="ml-auto flex cursor-pointer items-center justify-end rounded-lg p-1 text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-bg-hover hover:text-text-primary hover:shadow-[0_4px_14px_rgba(16,185,129,0.12)]"
          >
            <Ellipsis
              size={22}
              className="transition-transform duration-300 hover:rotate-90"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-20 min-w-44 overflow-hidden rounded-xl border border-border-subtle bg-bg-input/95 p-1 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <button
                type="button"
                disabled
                title="Редактирование пока недоступно"
                className="flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-text-muted opacity-60"
              >
                <Pencil size={14} />
                Редактировать
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  openDeleteModal(note.id, note.title);
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-red-300 transition-colors hover:bg-red-400/10 hover:text-red-200"
              >
                <Trash2 size={14} />
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[18px] font-semibold">{note.title}</h1>

        <p className="h-15 text-[14px] text-text-secondary">
          {truncatedContent}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-text-secondary">
            Изменено{" "}
            {note.updatedAt ? formatMiddleTimeAgoRu(note.updatedAt) : ""}
          </span>

          <NoteMeta isPinned={note.isPinned} content={note.content || ""} />
        </div>
      </div>
    </div>
  );
}
