import { useCallback, useEffect, useState } from "react";

import {
  getNextSortState,
  readToolbarStateFromUrl,
  syncToolbarStateToUrl,
  type ToolbarSortBy,
  type ToolbarSortOrder,
} from "@/widgets/notes-toolbar/model/notesToolbarLogic";

export function useNotesFilters() {
  const [initialState] = useState(() =>
    readToolbarStateFromUrl(window.location.search),
  );
  const [searchValue, setSearchValue] = useState(
    initialState.searchValue ?? "",
  );
  const [selectedTagId, setSelectedTagId] = useState<string>(
    initialState.selectedTagId ?? "all",
  );
  const [sortBy, setSortBy] = useState<ToolbarSortBy>(
    initialState.sortBy ?? "updatedAt",
  );
  const [sortOrder, setSortOrder] = useState<ToolbarSortOrder>(
    initialState.sortOrder ?? "desc",
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const resetFilters = useCallback(() => {
    setSearchValue("");
    setSelectedTagId("all");
    setSortBy("updatedAt");
    setSortOrder("desc");
    setIsFiltersOpen(true);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    const next = getNextSortState(value);
    setSortBy(next.sortBy);
    setSortOrder(next.sortOrder);
  }, []);

  useEffect(() => {
    syncToolbarStateToUrl(searchValue, selectedTagId, sortBy, sortOrder);
  }, [searchValue, selectedTagId, sortBy, sortOrder]);

  return {
    searchValue,
    setSearchValue,
    selectedTagId,
    setSelectedTagId,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isFiltersOpen,
    setIsFiltersOpen,
    resetFilters,
    handleSortChange,
  };
}
