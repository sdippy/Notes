import { Ellipsis } from "lucide-react";
import type { NoteCardType } from "@/types";

export default function NoteCard(props: NoteCardType) {
  return (
    <div className="flex flex-col gap-4 p-5 bg-bg-card border border-border-subtle rounded-xl hover:border-border-focus cursor-pointer transition-all duration-200">
      <div className="flex justify-between items-center">
        <h2 className="font-[12px] rounded-xl px-2.5 py-1 bg-accent-dim">
          {props.category}
        </h2>
        <button className="flex items-center justify-center text-text-secondary hover:text-text-primary cursor-pointer">
          <Ellipsis
            size={22}
            className="transition-transform duration-500 hover:rotate-90"
          />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[18px] font-semibold">{props.title}</h1>
        <p className="text-[14px] text-text-secondary">{props.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-text-secondary">
            {props.updated_at}
          </span>
          <span>Теги алгоритм</span>
        </div>
      </div>
    </div>
  );
}
