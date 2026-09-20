import { BookType, Trash2 } from "lucide-react";

import { useArchiveNoteModalStore } from "@/features/note-archive/archiveNoteModalStore";
import { type Note, formatMiddleTimeAgoRu } from "@/shared/types";

interface NoteCardType {
  note: Note;
  animationDelay?: number;
}

function NoteMeta({ content }: { content: string }) {
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

export default function NoteArchiveCard({
  note,
  animationDelay = 0,
}: NoteCardType) {
  const openArchiveModal = useArchiveNoteModalStore(
    (state) => state.openArchiveModal,
  );
  return (
    <div
      style={{ animationDelay: `${animationDelay}ms` }}
      className="flex flex-col gap-3 sm:gap-0 sm:grid grid-cols-4 sm:items-center animate-[note-reveal_450ms_ease-out_both] cursor-pointer rounded-xl border-b last:border-0 border-border-subtle bg-bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(16,185,129,0.08)]"
    >
      <div className="col-span-2 flex gap-2 items-center">
        <div className="size-11 flex items-center justify-center bg-bg-input rounded-xl">
          <BookType size={18} className="text-text-secondary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-[18px] font-semibold">{note.title}</h1>
          <div className="flex items-center gap-2">
            {note.tags &&
              note.tags.map((tag) => (
                <div key={tag.id} className="flex gap-1.5 items-center">
                  <h2 className="text-[14px] text-text-secondary">
                    {tag.name}
                  </h2>
                </div>
              ))}
            <div className="size-0.5 bg-text-secondary rounded-full"></div>
            <NoteMeta content={note.content || ""} />
            <div className="xl:hidden size-0.5 bg-text-secondary rounded-full"></div>

            <span className="xl:hidden text-[14px] text-text-secondary first-letter:uppercase">
              {note.updatedAt ? formatMiddleTimeAgoRu(note.updatedAt) : ""}
            </span>
          </div>
        </div>
      </div>

      <span className="hidden xl:block text-[14px] text-text-secondary first-letter:uppercase">
        {note.updatedAt ? formatMiddleTimeAgoRu(note.updatedAt) : ""}
      </span>

      <div className="flex sm:justify-end gap-3 col-span-2 xl:col-span-1">
        <button
          type="button"
          onClick={() => {
            openArchiveModal({
              noteId: note.id,
              noteTitle: note.title,
              isArchiving: true,
            });
          }}
          className="h-11 w-full sm:w-auto sm:px-5 text-[14px] font-semibold rounded-xl cursor-pointer text-bg-main border border-accent/40 bg-accent sm:text-text-primary sm:bg-bg-input sm:border-border-subtle transition-colors sm:hover:text-bg-main sm:hover:border-accent/40 sm:hover:bg-accent disabled:cursor-wait disabled:opacity-60 "
        >
          Восстановить
        </button>
        <button
          type="button"
          onClick={() => {
            openArchiveModal({
              noteId: note.id,
              noteTitle: note.title,
              isDeleting: true,
            });
          }}
          className="size-11 inline-flex items-center justify-center bg-bg-input rounded-xl cursor-pointer text-[#ef4444] sm:hover:text-red-200 border border-border-subtle transition-colors hover:bg-red-400/20 disabled:cursor-wait disabled:opacity-60"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
