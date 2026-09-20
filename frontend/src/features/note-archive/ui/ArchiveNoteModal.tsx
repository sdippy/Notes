import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2, X, ArchiveRestore } from "lucide-react";

import { toggleNoteArchive, deleteNote } from "@/entities/note/api/notes";
import { useArchiveNoteModalStore } from "@/features/note-archive/archiveNoteModalStore";

export default function ArchiveNoteModal() {
  const {
    isOpen,
    noteId,
    noteTitle,
    isDeleting,
    isArchiving,
    closeArchiveModal,
  } = useArchiveNoteModalStore();
  const { errorMessage, setArchiveError } = useArchiveNoteModalStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!noteId) {
        throw new Error("Заметка не выбрана");
      }

      if (!isDeleting) {
        return toggleNoteArchive(noteId);
      } else {
        return deleteNote(noteId);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notes"] }),
        queryClient.invalidateQueries({ queryKey: ["notes-count"] }),
      ]);
      closeArchiveModal();
    },
    onError: (error) => {
      setArchiveError(
        error instanceof Error ? error.message : "Не удалось удалить заметку",
      );
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleteMutation.isPending) {
        closeArchiveModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeArchiveModal, deleteMutation.isPending, isOpen]);

  if (!isOpen || !noteId) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex animate-[modal-backdrop-in_180ms_ease-out_both] items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleteMutation.isPending) {
          closeArchiveModal();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-note-title"
        className="w-full max-w-md animate-[modal-in_220ms_cubic-bezier(0.16,1,0.3,1)_both] rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-start justify-between gap-4">
          {isArchiving ? (
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent">
                <ArchiveRestore size={19} />
              </div>
              <div>
                <h2
                  id="delete-note-title"
                  className="text-[18px] font-semibold"
                >
                  Восстановить заметку?
                </h2>
                <p className="mt-2 text-[13px] leading-5 text-text-secondary">
                  «{noteTitle}» будет восстановлена.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                <AlertTriangle size={19} />
              </div>
              <div>
                <h2
                  id="delete-note-title"
                  className="text-[18px] font-semibold"
                >
                  Удалить заметку?
                </h2>
                {isDeleting ? (
                  <p className="mt-2 text-[13px] leading-5 text-text-secondary">
                    «{noteTitle}» будет безвозвратно удалена.
                  </p>
                ) : (
                  <p className="mt-2 text-[13px] leading-5 text-text-secondary">
                    «{noteTitle}» будет удалена и добавлена в корзину.
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            aria-label="Закрыть окно подтверждения"
            disabled={deleteMutation.isPending}
            onClick={closeArchiveModal}
            className="cursor-pointer rounded-lg p-1 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-[12px] text-red-300">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex md:justify-end gap-2">
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={closeArchiveModal}
            className="w-full md:w-auto cursor-pointer rounded-xl border border-border-subtle px-4 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-focus hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Отмена
          </button>
          {isArchiving ? (
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => {
                setArchiveError(null);
                deleteMutation.mutate();
              }}
              className="w-full md:w-auto justify-center inline-flex cursor-pointer items-center gap-2 rounded-xl border border-accent/40 bg-accent px-4 py-2.5 text-[13px] font-medium text-bg-main transition-colors hover:bg-accent/20 hover:text-text-primary disabled:cursor-wait disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Восстановление..." : "Восстановить"}
            </button>
          ) : (
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => {
                setArchiveError(null);
                deleteMutation.mutate();
              }}
              className="w-full md:w-auto justify-center inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-[13px] font-medium text-red-300 transition-colors hover:bg-red-400/20 hover:text-red-200 disabled:cursor-wait disabled:opacity-60"
            >
              <Trash2 size={14} />
              {deleteMutation.isPending ? "Удаление..." : "Удалить"}
            </button>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}
