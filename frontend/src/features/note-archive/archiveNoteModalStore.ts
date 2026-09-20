import { create } from "zustand";

type OpenModalPayload = {
  noteId: string;
  noteTitle: string;
  isDeleting?: boolean;
  isArchiving?: boolean;
};

type ArchiveNoteModalState = {
  isOpen: boolean;
  isDeleting: boolean;
  isArchiving: boolean;
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
    noteId: null,
    noteTitle: "",
    errorMessage: null,

    openArchiveModal: ({
      noteId,
      noteTitle,
      isDeleting,
      isArchiving = false,
    }) =>
      set({
        isOpen: true,
        noteId,
        noteTitle,
        isDeleting,
        isArchiving,
        errorMessage: null,
      }),

    closeArchiveModal: () =>
      set({
        isOpen: false,
        isDeleting: false,
        isArchiving: false,
        noteId: null,
        noteTitle: "",
        errorMessage: null,
      }),

    setArchiveError: (errorMessage) => set({ errorMessage }),
  }),
);
