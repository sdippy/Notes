import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2, X } from "lucide-react";

import { deleteNote } from "@/entities/note/api/notes";
import { useDeleteNoteModalStore } from "@/features/note-delete/deleteNoteModalStore";

export default function DeleteNoteModal() {
  const { isOpen, noteId, noteTitle, closeDeleteModal } =
    useDeleteNoteModalStore();
  const { errorMessage, setDeleteError } = useDeleteNoteModalStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!noteId) {
        throw new Error("Заметка не выбрана");
      }

      return deleteNote(noteId);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notes"] }),
        queryClient.invalidateQueries({ queryKey: ["notes-count"] }),
      ]);
      closeDeleteModal();
    },
    onError: (error) => {
      setDeleteError(
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
        closeDeleteModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDeleteModal, deleteMutation.isPending, isOpen]);

  if (!isOpen || !noteId) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex animate-[modal-backdrop-in_180ms_ease-out_both] items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleteMutation.isPending) {
          closeDeleteModal();
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
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <AlertTriangle size={19} />
            </div>
            <div>
              <h2 id="delete-note-title" className="text-[18px] font-semibold">
                Удалить заметку?
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-text-secondary">
                «{noteTitle}» будет удалена без возможности восстановления.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Закрыть окно подтверждения"
            disabled={deleteMutation.isPending}
            onClick={closeDeleteModal}
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

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={closeDeleteModal}
            className="cursor-pointer rounded-xl border border-border-subtle px-4 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-focus hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => {
              setDeleteError(null);
              deleteMutation.mutate();
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-[13px] font-medium text-red-300 transition-colors hover:bg-red-400/20 hover:text-red-200 disabled:cursor-wait disabled:opacity-60"
          >
            <Trash2 size={14} />
            {deleteMutation.isPending ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
