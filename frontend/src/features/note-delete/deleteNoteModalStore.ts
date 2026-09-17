import { create } from "zustand";

type DeleteNoteModalState = {
  isOpen: boolean;
  noteId: string | null;
  noteTitle: string;
  errorMessage: string | null;
  openDeleteModal: (noteId: string, noteTitle: string) => void;
  closeDeleteModal: () => void;
  setDeleteError: (message: string | null) => void;
};

export const useDeleteNoteModalStore = create<DeleteNoteModalState>((set) => ({
  isOpen: false,
  noteId: null,
  noteTitle: "",
  errorMessage: null,

  openDeleteModal: (noteId, noteTitle) =>
    set({ isOpen: true, noteId, noteTitle, errorMessage: null }),

  closeDeleteModal: () =>
    set({ isOpen: false, noteId: null, noteTitle: "", errorMessage: null }),

  setDeleteError: (errorMessage) => set({ errorMessage }),
}));
