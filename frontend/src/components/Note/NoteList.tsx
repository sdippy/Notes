import { useState, useEffect } from "react";

import NoteCard from "./NoteCard";
import NoteCardAdd from "./NoteCardAdd";
import { getNotes, type Note } from "@/types";

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getNotes();

        setNotes(data);
      } catch {
        setError("Не удалось загрузить заметки");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();
  }, []);

  if (isLoading) return <div>12312321</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
      <NoteCardAdd />
    </div>
  );
}
