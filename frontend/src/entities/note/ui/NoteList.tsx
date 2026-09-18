import { type Note } from "@/shared/types";
import NoteCard from "./NoteCard";
import NoteCardAdd from "./NoteCardAdd";

type NoteListProps = {
  notes: Note[];
  isLoading?: boolean;
  errorMessage?: string;
  addCard?: boolean;
};

export default function NoteList({
  notes,
  isLoading = false,
  addCard,
  errorMessage,
}: NoteListProps) {
  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-200 shadow-[0_0_24px_rgba(248,113,113,0.05)]">
        Не удалось загрузить заметки: {errorMessage}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`note-skeleton-${index}`}
            className="group relative overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-5 shadow-sm"
          >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.02)_100%)]" />

            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-bg-input/80" />
                  <div className="h-3 w-20 rounded bg-bg-input/80" />
                </div>
                <div className="size-6 rounded-full bg-bg-input/80" />
              </div>

              <div className="space-y-2.5">
                <div className="h-5 w-2/3 rounded bg-bg-input/80" />
                <div className="h-4 w-full rounded bg-bg-input/80" />
                <div className="h-4 w-5/6 rounded bg-bg-input/80" />
                <div className="h-4 w-4/5 rounded bg-bg-input/80" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="h-3 w-24 rounded bg-bg-input/80" />
                <div className="h-3 w-16 rounded bg-bg-input/80" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {notes.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-dashed border-border-subtle bg-bg-card/60 p-8 text-center">
          <p className="text-[15px] font-medium text-text-primary">
            Заметок пока нет
          </p>
          <p className="mt-2 text-[13px] text-text-secondary">
            Измените фильтры или создайте первую заметку.
          </p>
        </div>
      ) : (
        notes.map((note, index) => (
          <NoteCard key={note.id} note={note} animationDelay={index * 55} />
        ))
      )}
      {addCard && <NoteCardAdd />}
    </div>
  );
}
