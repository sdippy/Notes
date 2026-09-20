import { create } from "zustand";

type OpenModalPayload = {
  noteId?: string;
  noteTitle?: string;
  isDeleting?: boolean;
  isArchiving?: boolean;
  isClearingTrash?: boolean;
};

type ArchiveNoteModalState = {
  isOpen: boolean;
  isDeleting: boolean;
  isArchiving: boolean;
  isClearingTrash: boolean;
  noteId: string | null;
  noteTitle: string;
  errorMessage: string | null;
  openArchiveModal: (payload: OpenModalPayload) => void;
  closeArchiveModal: () => void;
  setArchiveError: (message: string | null) => void;
};

export const useArchiveNoteModalStore = create<ArchiveNoteModalState>(
  (set) => ({
    isOpen: false,
    isDeleting: false,
    isArchiving: false,
    isClearingTrash: false,
    noteId: null,
    noteTitle: "",
    errorMessage: null,

    openArchiveModal: ({
      noteId,
      noteTitle,
      isDeleting,
      isArchiving = false,
      isClearingTrash = false,
    }) =>
      set({
        isOpen: true,
        noteId,
        noteTitle,
        isDeleting,
        isArchiving,
        isClearingTrash,
        errorMessage: null,
      }),

    closeArchiveModal: () =>
      set({
        isOpen: false,
        isDeleting: false,
        isArchiving: false,
        isClearingTrash: false,
        noteId: null,
        noteTitle: "",
        errorMessage: null,
      }),

    setArchiveError: (errorMessage) => set({ errorMessage }),
  }),
);
