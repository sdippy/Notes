import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { Star, Box, Trash, Shield } from "lucide-react";

import { getTags, type NoteTag } from "@/types";

export default function LayoutAside() {
  const [noteTags, setNoteTags] = useState<NoteTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNoteTags() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getTags();

        setNoteTags(data);
      } catch {
        setError("Не удалось загрузить заметки");
      } finally {
        setIsLoading(false);
      }
    }

    loadNoteTags();
  }, []);

  if (isLoading) return <div>12312321</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="w-64 h-full flex flex-col border-r border-border-subtle p-4">
      <button className="w-full bg-accent text-bg-main text-[16px] font-semibold py-2.5 rounded-xl hover:bg-accent-dim hover:text-text-primary transition-colors duration-200 cursor-pointer">
        + Новая заметка
      </button>

      <div className="flex flex-col gap-1 mt-6">
        <NavLink
          to="/MainNotes"
          className={({ isActive }) =>
            `flex items-center justify-between w-full py-2.5 px-[13.5px] rounded-xl cursor-pointer transition-all duration-200 ease-out
    ${
      isActive
        ? "text-text-primary bg-bg-hover"
        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
    }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="flex items-center gap-[13.5px] text-[16px] text-regular">
                <Box
                  size={15}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-text-secondary"
                  }`}
                />
                Все заметки
              </span>
              <span className="text-[12px] text-regular">4</span>
            </>
          )}
        </NavLink>

        <NavLink
          to=""
          className={({ isActive }) =>
            `flex items-center justify-between w-full py-2.5 px-[13.5px] rounded-xl cursor-pointer transition-all duration-200 ease-out
    ${
      isActive
        ? "text-text-primary bg-bg-hover"
        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
    }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="flex items-center gap-[13.5px] text-[16px] text-regular">
                <Star
                  size={15}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-text-secondary"
                  }`}
                />
                Избранное
              </span>
              <span className="text-[12px] text-regular">4</span>
            </>
          )}
        </NavLink>
        <NavLink
          to=""
          className={({ isActive }) =>
            `flex items-center justify-between w-full py-2.5 px-[13.5px] rounded-xl cursor-pointer transition-all duration-200 ease-out
    ${
      isActive
        ? "text-text-primary bg-bg-hover"
        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
    }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="flex items-center gap-[13.5px] text-[16px] text-regular">
                <Trash
                  size={15}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-text-secondary"
                  }`}
                />
                Корзина
              </span>
              <span className="text-[12px] text-regular">4</span>
            </>
          )}
        </NavLink>
      </div>

      <div className="flex-1 flex flex-col gap-5 mt-8 px-[13.5px]">
        <span className="text-text-secondary text-[12px] font-semibold">
          КОЛЛЕКЦИИ
        </span>
        <div className="flex flex-col gap-3 text-text-secondary text-[16px]">
          {noteTags.slice(0, 10).map((tag) => (
            <span
              key={tag.id}
              className="flex gap-3 items-center border-b border-transparent hover:text-text-primary hover:border-b-border-focus cursor-pointer transition-all duration-200"
            >
              <div
                style={{ backgroundColor: tag.color }}
                className="rounded-full size-2"
              ></div>
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 px-[13.5px] py-4 bg-bg-card rounded-xl border border-border-subtle">
        <span className="flex gap-2 items-center text-text-primary text-medium text-[14px]">
          <Shield size={14} className="text-accent" />
          <h2>Локально и приватно</h2>
        </span>
        <p className="text-text-secondary text-[12px]">
          Ваши мысли остаются в личном пространстве.
        </p>
      </div>
    </div>
  );
}
