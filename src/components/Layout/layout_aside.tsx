// import { NavLink } from "react-router-dom";

export default function LayoutAside() {
  return (
    <div className="w-64 h-full border-r border-border-subtle p-4">
      <button className="w-full bg-accent text-bg-main text-[16px] font-semibold py-2.5 rounded-xl hover:bg-accent-dim hover:text-text-primary transition-colors duration-200 cursor-pointer">
        + Новая заметка
      </button>
      <div className="flex flex-col gap-1 mt-6">
        <div className="flex items-center justify-between bg-bg-hover w-full py-2.5 px-[13.5px] rounded-xl cursor-pointer">
          <span className="text-text-primary text-[16px] text-medium">
            Все заметки
          </span>
          <span className="text-text-secondary text-[12px] text-medium">
            18
          </span>
        </div>
        <div className="flex items-center justify-between hover:bg-bg-hover w-full py-2.5 px-[13.5px] rounded-xl cursor-pointer">
          <span className="text-text-secondary text-[16px] text-regular">
            Избранное
          </span>
          <span className="text-text-secondary text-[12px] text-regular">
            4
          </span>
        </div>
        <div className="flex items-center justify-between hover:bg-bg-hover w-full py-2.5 px-[13.5px] rounded-xl cursor-pointer">
          <span className="text-text-secondary text-[16px] text-regular">
            Корзина
          </span>
          <span className="text-text-secondary text-[12px] text-regular">
            2
          </span>
        </div>
      </div>

    </div>
  );
}
