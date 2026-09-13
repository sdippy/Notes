import TopSection from "../components/MainNotes/TopSection";
import NoteList from "../components/Note/NoteList";

export default function MainNotes() {
  return (
    <div className="flex flex-col gap-7">
      <TopSection />
      <NoteList />
    </div>
  );
}
