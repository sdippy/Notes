import type { RefObject } from "react";
import {
  ArrowDownUp,
  ChevronDown,
  Funnel,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  getActiveFilterCount,
  type ToolbarSortBy,
  type ToolbarSortOrder,
} from "@/widgets/notes-toolbar/model/notesToolbarLogic";

export interface TagOption {
  id: string;
  name: string;
  color: string;
}

interface NotesToolbarProps {
  searchValue: string;
  selectedTagId: string;
  sortBy: ToolbarSortBy;
  sortOrder: ToolbarSortOrder;
  isFiltersOpen: boolean;
  tags: TagOption[];
  searchInputRef: RefObject<HTMLInputElement | null>;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  onSetTag: (tagId: string) => void;
  onResetFilters: () => void;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { value: "updatedAt-desc", label: "Недавние" },
  { value: "updatedAt-asc", label: "Старые" },
  { value: "title-asc", label: "А → Я" },
  { value: "title-desc", label: "Я → А" },
  { value: "createdAt-desc", label: "Дата ↓" },
  { value: "createdAt-asc", label: "Дата ↑" },
] as const;

export default function NotesToolbar({
  searchValue,
  selectedTagId,
  sortBy,
  sortOrder,
  isFiltersOpen,
  tags,
  searchInputRef,
  onSearchChange,
  onToggleFilters,
  onSetTag,
  onResetFilters,
  onSortChange,
}: NotesToolbarProps) {
  const activeFilterCount = getActiveFilterCount(
    searchValue,
    selectedTagId,
    sortBy,
    sortOrder,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 *:h-11">
        <div className="relative flex h-11 min-w-0 w-full flex-1 items-center rounded-xl border border-border-subtle bg-bg-input/80 text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-sm transition-all duration-200 hover:border-border-focus hover:text-text-primary hover:shadow-[0_0_0_1px_rgba(16,185,129,0.10)] focus-within:border-accent/60 focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.18)] cursor-pointer sm:min-w-65">
          <Search size={15} className="absolute left-3 pointer-events-none" />

          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по заметкам"
            className="w-full h-full pl-9 pr-9 text-[14px] placeholder:text-text-secondary hover:placeholder:text-text-primary text-text-primary bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none"
          />

          <span className="absolute right-3 text-[9px] font-medium text-text-secondary pointer-events-none">
            ⌘K
          </span>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => onToggleFilters()}
            className="inline-flex items-center gap-2 h-11 rounded-xl border border-accent/40 bg-accent/10 px-3 text-[12px] font-medium text-text-primary transition-all duration-200 cursor-pointer hover:border-accent/60 hover:bg-accent/15 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.18)]"
          >
            <Funnel size={13} className="shrink-0" />
            <span>Активные фильтры</span>
            <span className="inline-flex min-w-5 justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-bg-main">
              {activeFilterCount}
            </span>
          </button>
        )}

        <button
          type="button"
          aria-expanded={isFiltersOpen}
          onClick={onToggleFilters}
          className={`inline-flex items-center gap-2 h-11 rounded-xl border px-3 text-[13px] font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.18)] ${
            isFiltersOpen
              ? "border-accent/60 bg-accent/10 text-text-primary shadow-[0_0_0_1px_rgba(16,185,129,0.18)]"
              : "border-border-subtle bg-bg-input text-text-secondary hover:border-border-focus hover:text-text-primary"
          }`}
        >
          <SlidersHorizontal size={14} className="shrink-0" />
          <span>Фильтры</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              isFiltersOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isFiltersOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-2xl border border-border-subtle bg-bg-input/80 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSetTag("all")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  selectedTagId === "all"
                    ? "bg-accent text-bg-main shadow-[0_0_0_1px_rgba(16,185,129,0.25)] ring-1 ring-accent/40"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }`}
              >
                <Funnel size={14} />
                Все теги
              </button>

              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-[12px] font-medium text-text-secondary transition-all duration-200 cursor-pointer hover:border-border-focus hover:text-text-primary"
              >
                <RotateCcw size={13} />
                Сбросить фильтры
              </button>

              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onSetTag(tag.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                    selectedTagId === tag.id
                      ? "bg-accent text-bg-main shadow-[0_0_0_1px_rgba(16,185,129,0.25)] ring-1 ring-accent/40"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                  }`}
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3">
              <div className="mr-1 flex items-center gap-2 px-2 text-[12px] font-medium text-text-secondary">
                <ArrowDownUp size={14} />
                Сортировка
              </div>

              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSortChange(option.value)}
                  className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                    `${sortBy}-${sortOrder}` === option.value
                      ? "bg-accent text-bg-main shadow-[0_0_0_1px_rgba(16,185,129,0.25)] ring-1 ring-accent/40"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
