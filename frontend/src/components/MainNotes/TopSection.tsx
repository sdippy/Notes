import { useCallback, useEffect, useRef, useState } from "react";
import { List, Funnel, Search } from "lucide-react";

export default function TopSection() {
  const [searchValue, setSearchValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd + K на Mac
      // Ctrl + K на Windows/Linux
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        openSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openSearch]);
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h2 className="text-[14px] font-medium text-accent">
          Личный workspace
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] font-bold">Мои заметки</h1>
            <span className="text-[14px] text-text-secondary">
              18 заметок · Последнее изменение сегодня
            </span>
          </div>
          <button className="bg-accent text-bg-main text-[16px] font-semibold px-5 py-2.5 rounded-xl hover:bg-accent-dim hover:text-text-primary transition-colors duration-200 cursor-pointer">
            + Создать заметку
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 flex items-center h-11 text-text-secondary hover:text-text-primary bg-bg-input border border-border-subtle rounded-xl hover:border-border-focus focus-within:border-border-focus cursor-pointer transition-all duration-200">
          <Search size={15} className="absolute left-3 pointer-events-none" />

          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Поиск по заметкам"
            className="w-full h-full pl-9 pr-9 text-[14px] placeholder:text-text-secondary hover:placeholder:text-text-primary text-text-primary bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none"
          />

          <span className="absolute right-3 text-[9px] font-medium text-text-secondary pointer-events-none">
            ⌘K
          </span>
        </div>
        <button className="flex items-center h-11 px-[17.5px] rounded-xl bg-bg-input gap-[9.5px] text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-focus cursor-pointer transition-all duration-200">
          <Funnel size={15} />
          <span>Все теги</span>
        </button>
        <button className="flex items-center h-11 px-[17.5px] rounded-xl bg-bg-input gap-[9.5px] text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-focus cursor-pointer transition-all duration-200">
          <List size={15} />
          <span>Недавние</span>
        </button>
      </div>
    </div>
  );
}
