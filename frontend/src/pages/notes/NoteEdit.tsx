import { NoteEditor } from "@/shared/components/editor/NoteEditor";

export default function NoteEdit() {
  const handleCreate = async (content: string) => {
    console.log(content);
  };

  return (
    <div className="flex h-full flex-col gap-10">
      <div className="flex flex-1 flex-col gap-10">
        <div className="flex">tegi пен для редактирования</div>

        <div className="flex flex-1 flex-col gap-4">
          <h1>Title</h1>
          <span>time</span>
          <NoteEditor onSave={handleCreate} />
        </div>
      </div>
    </div>
  );
}
