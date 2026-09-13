export default function NoteCardAdd() {
  return (
    <div className="flex flex-col gap-8.75 p-5 justify-center border border-dashed border-border-subtle hover:border-border-focus rounded-xl cursor-pointer">
      <div className="size-10 rounded-xl bg-bg-input flex items-center justify-center text-accent font-bold text-[20px]">
        +
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-[16px]">Зафиксировать мысль</h2>
        <p className="text-[14px] text-text-secondary">
          Пустая заметка откроется в спокойном редакторе.
        </p>
      </div>
    </div>
  );
}
