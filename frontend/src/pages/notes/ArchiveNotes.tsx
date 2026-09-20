import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Trash2, Clock } from "lucide-react";

import { getNotes, type NoteFilters } from "@/shared/types";
import NoteArchiveList from "@/entities/note/ui/NotesArchive/NoteArchiveList";
import { useNotesFilters } from "@/features/notes-filter/model/useNotesFilters";
import { useArchiveNoteModalStore } from "@/features/note-archive/archiveNoteModalStore";

export default function ArchiveNotes() {
  const openArchiveModal = useArchiveNoteModalStore(
    (state) => state.openArchiveModal,
  );

  const { sortBy, sortOrder } = useNotesFilters();

  const [page, setPage] = useState(1);

  const filters: NoteFilters = {
    sortBy,
    sortOrder,
    archived: true,
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

  const getNotesText = (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (count == 0) {
      return;
    }
    if (mod10 === 1 && mod100 != 11) {
      return "удаленная заметка. Она будет окончательна удалена через 30 дней.";
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return "удаленные заметки. Они будут окончательно удалены через 30 дней.";
    }
    return "удаленных заметок. Они будут окончательно удалены через 30 дней.";
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <h2 className="text-[14px] font-medium text-accent">
            Личный workspace
          </h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-[24px] font-bold">Корзина</h1>
              {(data?.totalCount ?? notes.length) > 0 && (
                <span className="text-[14px] text-text-secondary">
                  {data?.totalCount ?? notes.length}{" "}
                  {getNotesText(data?.totalCount ?? notes.length)}
                </span>
              )}
            </div>

            {notes.length > 0 && (
              // <PageNavButton
              //   onClick={() => {
              //     openArchiveModal({
              //       isArchiving: true,
              //     });
              //   }}
              //   className="w-full border border-border-subtle bg-bg-input px-5 py-2.5 text-[15px] font-semibold text-text-secondary shadow-[0_0_24px_rgba(16,185,129,0.12)] hover:border-red-400/30 hover:bg-red-400/20 hover:text-red-200 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              //   icon={<Trash2 size={18} />}
              //   label="Очистить корзину"
              // />
              <button
                type="button"
                onClick={() => {
                  openArchiveModal({
                    noteId: 1,
                    isClearingTrash: true,
                  });
                }}
                className="inline-flex items-center gap-2 justify-center rounded-xl transition-all duration-200 cursor-pointer w-full border border-border-subtle bg-bg-input px-5 py-2.5 text-[15px] font-semibold text-text-secondary shadow-[0_0_24px_rgba(16,185,129,0.12)] hover:border-red-400/30 hover:bg-red-400/20 hover:text-red-200 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                <Trash2 size={18} />
                Очистить корзину
              </button>
            )}
            <div className="flex sm:hidden items-center bg-bg-card border-border-subtle gap-3 p-5 rounded-xl border-subtle">
              <div className="size-10 bg-accent-dim rounded-xl flex justify-center items-center text-accent">
                <Clock size={18} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-[14px] font-medium text-text-primary">
                  30 дней на восстановление
                </h2>
                <span className="text-[12px] text-text-secondary">
                  После этого срока заметки удалятся навсегда.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NoteArchiveList
        notes={notes}
        isLoading={isLoading}
        errorMessage={isError ? error.message : undefined}
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
