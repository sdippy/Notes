import { apiFetch } from "@/shared/api/apiClient";

export interface NoteTag {
  id: string;
  name: string;
  color: string;
}

export async function getTags(): Promise<NoteTag[]> {
  const response = await apiFetch("/tags");

  if (!response.ok) {
    throw new Error("Не удалось получить теги");
  }

  return response.json();
}
