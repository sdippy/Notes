import NoteCard from "./NoteCard";
import NoteCardAdd from "./NoteCardAdd";
import type { NoteCardType } from "@/types";

// Временное хранилище для теста
const Note: NoteCardType[] = [
  {
    id: 1,
    title: "План запуска нового продукта",
    category: "Работа",
    content:
      "Собрать обратную связь от бета-группы, уточнить сценарий первого входа и подготовить список метрик для недели…",
    updated_at: "Изменено 12:40",
  },
  {
    id: 2,
    title: "Ритуал фокусной недели",
    category: "Идеи",
    content:
      "Без встреч до полудня. Один главный результат на день. Вечером — короткая ретроспектива без уведомлений.",
    updated_at: "Вчера",
  },
];

export default function NoteList() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Note.map((item) => (
        <NoteCard key={item.id} {...item} />
      ))}
      <NoteCardAdd />
    </div>
  );
}
