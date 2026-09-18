import { apiFetch } from "@/shared/api/apiClient";
import type { NoteTag } from "@/shared/types";

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  tags: NoteTag[];
}

export type NoteFilters = {
  search?: string;
  pinned?: boolean;
  archived?: boolean;
  tagId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export interface NotesListResponse {
  items: Note[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function getNotes(
  filters: NoteFilters = {},
): Promise<NotesListResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const response = await apiFetch(`/notes${query ? `?${query}` : ""}`);

  if (!response.ok) {
    throw new Error("Не удалось получить заметки");
  }

  const payload = (await response.json()) as NotesListResponse | Note[];

  if (Array.isArray(payload)) {
    return {
      items: payload,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? payload.length,
      totalCount: payload.length,
      totalPages: 1,
    };
  }

  return {
    ...payload,
    items: payload.items ?? [],
  };
}

export async function deleteNote(noteId: string): Promise<void> {
  const response = await apiFetch(`/notes/${noteId}`, {
    method: "DELETE",
  });

  // A stale card can refer to a note that was already removed elsewhere.
  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      details || `Не удалось удалить заметку (HTTP ${response.status})`,
    );
  }
}

export async function toggleNotePin(noteId: string): Promise<Note> {
  const response = await apiFetch(`/notes/${noteId}/pin`, {
    method: "PATCH",
  });

  // A stale card can refer to a note that was already removed elsewhere.
  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      details || `Не удалось закрепить заметку (HTTP ${response.status})`,
    );
  }
}

export async function toggleNoteArchive(noteId: string): Promise<Note> {
  const response = await apiFetch(`/notes/${noteId}/archive`, {
    method: "PATCH",
  });

  // A stale card can refer to a note that was already removed elsewhere.
  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      details || `Не удалось архивировать заметку (HTTP ${response.status})`,
    );
  }
}
