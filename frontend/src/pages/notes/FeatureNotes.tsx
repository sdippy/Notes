import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getNotes, getTags, type NoteFilters } from "@/shared/types";
import NoteList from "@/entities/note/ui/NoteList";
import NotesToolbar from "@/widgets/notes-toolbar/ui/NotesToolbar";
import { useDebouncedSearch } from "@/shared/hooks/useDebouncedSearch";
import { useNotesFilters } from "@/features/notes-filter/model/useNotesFilters";

export default function FeatureNotes() {
  const {
    searchValue,
    setSearchValue,
    selectedTagId,
    setSelectedTagId,
    sortBy,
    sortOrder,
    isFiltersOpen,
    setIsFiltersOpen,
    resetFilters,
    handleSortChange,
  } = useNotesFilters();

  const debouncedSearch = useDebouncedSearch(searchValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    staleTime: 60_000,
  });

  const filters: NoteFilters = {
    search: debouncedSearch || undefined,
    tagId: selectedTagId === "all" ? undefined : selectedTagId,
    sortBy,
    sortOrder,
    pinned: true,
    archived: false,
    page,
    pageSize: 10,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", filters],
    queryFn: () => getNotes(filters),
    staleTime: 20_000,
  });

  const notes = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const filterKey = `${debouncedSearch}|${selectedTagId}|${sortBy}|${sortOrder}`;

  const previousFilterKey = useRef(filterKey);

  useEffect(() => {
    if (previousFilterKey.current === filterKey) {
      return;
    }

    previousFilterKey.current = filterKey;
    const frameId = window.requestAnimationFrame(() => setPage(1));

    return () => window.cancelAnimationFrame(frameId);
  }, [filterKey]);

  const openSearch = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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

  const getNotesText = (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 != 11) {
      return "заметка, которая поможет держать фокус.";
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return "заметки, которые помогут держать фокус.";
    }
    return "заметок, которые помогут держать фокус.";
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <h2 className="text-[14px] font-medium text-accent">
            Личный workspace
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-[24px] font-bold">Избранные заметки</h1>
              <span className="text-[14px] text-text-secondary">
                {data?.totalCount ?? notes.length} {getNotesText(notes.length)}
              </span>
            </div>
          </div>
        </div>
        <NotesToolbar
          searchValue={searchValue}
          selectedTagId={selectedTagId}
          sortBy={sortBy}
          sortOrder={sortOrder}
          isFiltersOpen={isFiltersOpen}
          tags={tags}
          searchInputRef={inputRef}
          onSearchChange={setSearchValue}
          onToggleFilters={() => setIsFiltersOpen((prev) => !prev)}
          onSetTag={setSelectedTagId}
          onResetFilters={resetFilters}
          onSortChange={handleSortChange}
        />
      </div>

      <NoteList
        notes={notes}
        isLoading={isLoading}
        errorMessage={isError ? error.message : undefined}
        addCard={false}
      />
      {totalPages > 1 && (
        <nav
          aria-label="Пагинация заметок"
          className="flex w-full flex-wrap items-center justify-end gap-1.5 sm:gap-2"
        >
          <button
            type="button"
            aria-label="Предыдущая страница"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-border-subtle bg-bg-card text-text-secondary transition-all hover:border-border-focus hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35 sm:size-10"
          >
            <ChevronLeft size={17} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                aria-current={pageNumber === page ? "page" : undefined}
                onClick={() => setPage(pageNumber)}
                className={`flex size-9 cursor-pointer items-center justify-center rounded-xl border text-[13px] font-medium transition-all sm:size-10 sm:text-[14px] ${
                  pageNumber === page
                    ? "border-accent bg-accent text-bg-main shadow-[0_0_18px_rgba(16,185,129,0.16)]"
                    : "border-border-subtle bg-bg-card text-text-secondary hover:border-border-focus hover:text-text-primary"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Следующая страница"
            disabled={page === totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-border-subtle bg-bg-card text-text-secondary transition-all hover:border-border-focus hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35 sm:size-10"
          >
            <ChevronRight size={17} />
          </button>
        </nav>
      )}
    </div>
  );
}
