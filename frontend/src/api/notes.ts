import { apiFetch } from "./apiClient";
import type { NoteTag } from "@/types";

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchiveed: boolean;
  createdAt: string;
  updatedAt: string;
  tags: NoteTag[];
}

export async function getNotes(): Promise<Note[]> {
  const response = await apiFetch("/notes");

  if (!response.ok) {
    throw new Error("Не удалось получить заметки");
  }

  return response.json();
}
