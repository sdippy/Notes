import { Ellipsis, Star } from "lucide-react";
import { type Note, formatMiddleTimeAgoRu } from "@/types";

interface NoteCardType {
  note: Note;
}

function NoteMeta({
  isPinned,
  content,
}: {
  isPinned: boolean;
  content: string;
}) {
  if (isPinned) {
    return (
      <div className="flex gap-2 items-center">
        <Star size={11} className="text-accent" />
        <span className="text-[14px] text-text-secondary font-semibold">
          Важное
        </span>
      </div>
    );
  }

  const linesCount = content.split("\n").length;
  const lastDigit = linesCount % 10;
  const lastTwoDigits = linesCount % 100;
  const linesTitle =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? "строк"
      : lastDigit === 1
        ? "строка"
        : lastDigit >= 2 && lastDigit <= 4
          ? "строки"
          : "строк";

  return (
    <span className="text-[14px] text-text-secondary font-semibold">
      {linesCount} {linesTitle}
    </span>
  );
}

export default function NoteCard({ note }: NoteCardType) {
  const maxWords = 20;
  const words = note.content?.split(" ") || [];
  const isLongText = words.length > maxWords;

  const truncatedContent = isLongText
    ? words.slice(0, maxWords).join(" ") + "..."
    : note.content;

  const tag = note.tags?.[0];

  return (
    <div className="flex flex-col gap-4 p-5 bg-bg-card border border-border-subtle rounded-xl hover:border-border-focus cursor-pointer transition-all duration-200">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {tag && (
            <>
              <div
                style={{ backgroundColor: tag.color }}
                className="size-2.5 rounded-full"
              ></div>
              <h2 className="text-[12px] text-text-secondary font-semibold">
                {tag.name}
              </h2>
            </>
          )}
        </div>

        <button className="flex items-center justify-center text-text-secondary hover:text-text-primary cursor-pointer">
          <Ellipsis
            size={22}
            className="transition-transform duration-500 hover:rotate-90"
          />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[18px] font-semibold">{note.title}</h1>

        <p className="h-15 text-[14px] text-text-secondary">
          {truncatedContent}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-text-secondary">
            Изменено{" "}
            {note.updatedAt ? formatMiddleTimeAgoRu(note.updatedAt) : ""}
          </span>

          <NoteMeta isPinned={note.isPinned} content={note.content || ""} />
        </div>
      </div>
    </div>
  );
}
