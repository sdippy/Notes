import { type Note } from "@/shared/types";
import NoteArchiveCard from "./NoteArchiveCard";

type NoteListProps = {
  notes: Note[];
  isLoading?: boolean;
  errorMessage?: string;
};

export default function NoteList({
  notes,
  isLoading = false,
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
      <div className="flex w-full flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`note-skeleton-${index}`}
            className="group relative w-full overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-5 shadow-sm"
          >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.02)_100%)]" />

            <div className="relative flex flex-col">
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center gap-3 col-span-2">
                  <div className="size-10 rounded-xl bg-bg-input/80" />
                  <div className="flex flex-col gap-2">
                    <div className="w-60 h-6 rounded-xl bg-bg-input/80" />
                    <div className="w-30 h-5 rounded-xl bg-bg-input/80" />
                  </div>
                </div>
                <div className="hidden lg:flex items-center">
                  <div className="w-40 h-6 rounded-xl bg-bg-input/80" />
                </div>
                <div className="hidden lg:flex gap-2 items-center justify-end">
                  <div className="w-30 h-11 rounded-xl bg-bg-input/80" />
                  <div className="w-11 h-11 rounded-xl bg-bg-input/80" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-border-subtle bg-bg-card shadow-sm overflow-hidden rounded-xl">
      {notes.length > 0 && (
        <div className="hidden xl:grid grid-cols-4 items-center uppercase text-text-secondary text-[12px] font-semibold p-5 border-b border-border-subtle">
          <span className="col-span-2">Заметка</span>
          <span>Удалена</span>
          <span className="flex justify-end">Действия</span>
        </div>
      )}

      <div>
        {notes.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border-subtle bg-bg-card/60 p-8 text-center">
            <p className="text-[15px] font-medium text-text-primary">
              Корзина пустая.
            </p>
          </div>
        ) : (
          notes.map((note, index) => (
            <NoteArchiveCard
              key={note.id}
              note={note}
              animationDelay={index * 55}
            />
          ))
        )}
      </div>
    </div>
  );
}
