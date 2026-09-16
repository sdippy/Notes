import { NavLink } from "react-router-dom";

import { FileQuestionMark, House, Plus } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="h-screen w-full flex flex-col gap-4 items-center justify-center">
      <div className="flex items-center justify-center size-20 bg-accent-dim rounded-xl">
        <FileQuestionMark size={36} className="text-text-primary" />
      </div>
      <span className="text-[14px] text-accent font-semibold">ОШИБКА 404</span>
      <h1 className="text-[24px] font-bold">Эта страница не нашлась</h1>
      <p className="text-[16px] text-text-secondary text-center">
        Возможно, ссылка устарела, заметка была перемещена <br></br> или у вас
        больше нет к ней доступа.
      </p>

      <div className="flex gap-2">
        <NavLink
          to="/"
          className="flex items-center gap-1 bg-accent text-bg-main text-[16px] font-semibold py-2.5 px-5 rounded-xl hover:bg-accent-dim hover:text-text-primary transition-colors duration-200 cursor-pointer"
        >
          <House size={18} className="translate-y-px" />
          Открыть мои заметки
        </NavLink>
        <NavLink
          to="/"
          className="flex items-center gap-1 bg-bg-input text-text-primary text-[16px] font-semibold py-2.5 px-5 rounded-xl hover:bg-accent hover:text-bg-main transition-colors duration-200 cursor-pointer"
        >
          <Plus size={18} className="translate-y-px" />
          Новая заметка
        </NavLink>
      </div>
    </div>
  );
}
