import { NavLink } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";

import { Star, Box, Trash, Shield } from "lucide-react";
import { getNotes } from "@/shared/types";

interface LayoutAsideProps {
  onNavigate?: () => void;
}

export default function LayoutAside({ onNavigate }: LayoutAsideProps) {
  const countQueries = useQueries({
    queries: [
      {
        queryKey: ["notes-count", "all"],
        queryFn: () => getNotes({ archived: false, page: 1, pageSize: 1 }),
        staleTime: 20_000,
      },
      {
        queryKey: ["notes-count", "favorites"],
        queryFn: () =>
          getNotes({ pinned: true, archived: false, page: 1, pageSize: 1 }),
        staleTime: 20_000,
      },
      {
        queryKey: ["notes-count", "trash"],
        queryFn: () => getNotes({ archived: true, page: 1, pageSize: 1 }),
        staleTime: 20_000,
      },
    ],
  });

  const counts = countQueries.map((query) => query.data?.totalCount ?? 0);

  return (
    <div className="flex h-full w-64 flex-col border-r border-border-subtle p-4">
      <button className="w-full bg-accent text-bg-main text-[16px] font-semibold py-2.5 rounded-xl hover:bg-accent-dim hover:text-text-primary transition-colors duration-200 cursor-pointer">
        + Новая заметка
      </button>

      <div className="flex-1 flex flex-col gap-2 mt-6">
        <NavLink
          to="/MainNotes"
          onClick={onNavigate}
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
              <span className="text-[12px] text-regular">{counts[0]}</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/Feature"
          onClick={onNavigate}
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
              <span className="text-[12px] text-regular">{counts[1]}</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/Archive"
          onClick={onNavigate}
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
              <span className="text-[12px] text-regular">{counts[2]}</span>
            </>
          )}
        </NavLink>
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
