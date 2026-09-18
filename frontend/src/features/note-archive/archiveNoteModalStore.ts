import { create } from "zustand";

type ArchiveNoteModalState = {
  isOpen: boolean;
  noteId: string | null;
  noteTitle: string;
  errorMessage: string | null;
  openArchiveModal: (noteId: string, noteTitle: string) => void;
  closeArchiveModal: () => void;
  setArchiveError: (message: string | null) => void;
};

export const useArchiveNoteModalStore = create<ArchiveNoteModalState>(
  (set) => ({
    isOpen: false,
    noteId: null,
    noteTitle: "",
    errorMessage: null,

    openArchiveModal: (noteId, noteTitle) =>
      set({ isOpen: true, noteId, noteTitle, errorMessage: null }),

    closeArchiveModal: () =>
      set({ isOpen: false, noteId: null, noteTitle: "", errorMessage: null }),

    setArchiveError: (errorMessage) => set({ errorMessage }),
  }),
);
