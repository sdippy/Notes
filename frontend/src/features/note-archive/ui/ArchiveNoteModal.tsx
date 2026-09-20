import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2, X, ArchiveRestore } from "lucide-react";

import {
  toggleNoteArchive,
  deleteNote,
  deleteArchivedNotes,
} from "@/entities/note/api/notes";
import { useArchiveNoteModalStore } from "@/features/note-archive/archiveNoteModalStore";

type ModalMode = "restore" | "trash" | "delete" | "clear-trash";

export default function ArchiveNoteModal() {
  const {
    isOpen,
    noteId,
    noteTitle,
    isDeleting,
    isArchiving,
    isClearingTrash,
    closeArchiveModal,
    errorMessage,
    setArchiveError,
  } = useArchiveNoteModalStore();

  const queryClient = useQueryClient();

  const getModalMode = (): ModalMode => {
    if (isArchiving) return "restore";
    if (isClearingTrash) return "clear-trash";
    if (isDeleting) return "delete";
    return "trash";
  };

  const mode = getModalMode();

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!noteId && mode !== "clear-trash") {
        throw new Error("Заметка не выбрана");
      }

      switch (mode) {
        case "restore":
          return toggleNoteArchive(noteId!);
        case "trash":
          return toggleNoteArchive(noteId!);
        case "delete":
          return deleteNote(noteId!);
        case "clear-trash":
          return deleteArchivedNotes();
          return Promise.resolve();
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
        error instanceof Error
          ? error.message
          : "Произошла ошибка при выполнении операции",
      );
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleteMutation.isPending) {
        closeArchiveModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeArchiveModal, deleteMutation.isPending, isOpen]);

  if (!isOpen || (!noteId && mode !== "clear-trash")) {
    return null;
  }

  const getModalContent = () => {
    switch (mode) {
      case "restore":
        return {
          title: "Восстановить заметку?",
          description: `«${noteTitle}» будет восстановлена.`,
          icon: <ArchiveRestore size={19} />,
          iconBg: "bg-accent-dim text-accent",
          confirmText: deleteMutation.isPending
            ? "Восстановление..."
            : "Восстановить",
          confirmButtonClass:
            "border-accent/40 bg-accent text-bg-main hover:bg-accent/20 hover:text-text-primary",
          showTrashIcon: false,
        };

      case "trash":
        return {
          title: "Удалить заметку?",
          description: `«${noteTitle}» будет удалена и добавлена в корзину.`,
          icon: <AlertTriangle size={19} />,
          iconBg: "bg-red-400/10 text-red-300",
          confirmText: deleteMutation.isPending ? "Удаление..." : "Удалить",
          confirmButtonClass:
            "border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/20 hover:text-red-200",
          showTrashIcon: true,
        };

      case "delete":
        return {
          title: "Удалить заметку?",
          description: `«${noteTitle}» будет безвозвратно удалена.`,
          icon: <AlertTriangle size={19} />,
          iconBg: "bg-red-400/10 text-red-300",
          confirmText: deleteMutation.isPending ? "Удаление..." : "Удалить",
          confirmButtonClass:
            "border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/20 hover:text-red-200",
          showTrashIcon: true,
        };

      case "clear-trash":
        return {
          title: "Очистить корзину?",
          description:
            "Все заметки в корзине будут безвозвратно удалены. Это действие нельзя отменить.",
          icon: <Trash2 size={19} />,
          iconBg: "bg-red-400/10 text-red-300",
          confirmText: deleteMutation.isPending
            ? "Очистка..."
            : "Очистить корзину",
          confirmButtonClass:
            "border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/20 hover:text-red-200",
          showTrashIcon: false,
        };
    }
  };

  const content = getModalContent();

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
          <div className="flex items-start gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${content.iconBg}`}
            >
              {content.icon}
            </div>
            <div>
              <h2 id="delete-note-title" className="text-[18px] font-semibold">
                {content.title}
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-text-secondary">
                {content.description}
              </p>
            </div>
          </div>

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

          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => {
              setArchiveError(null);
              deleteMutation.mutate();
            }}
            className={`w-full md:w-auto justify-center inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${content.confirmButtonClass}`}
          >
            {content.showTrashIcon && <Trash2 size={14} />}
            {content.confirmText}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
