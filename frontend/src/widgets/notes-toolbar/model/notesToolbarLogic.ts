export type ToolbarSortBy = "createdAt" | "updatedAt" | "title";
export type ToolbarSortOrder = "asc" | "desc";

export interface ToolbarState {
  searchValue: string;
  selectedTagId: string;
  sortBy: ToolbarSortBy;
  sortOrder: ToolbarSortOrder;
}

export function getActiveFilterCount(
  searchValue: string,
  selectedTagId: string,
  sortBy: ToolbarSortBy,
  sortOrder: ToolbarSortOrder,
): number {
  return [
    searchValue.trim() ? 1 : 0,
    selectedTagId !== "all" ? 1 : 0,
    sortBy !== "updatedAt" || sortOrder !== "desc" ? 1 : 0,
  ].reduce((total, value) => total + value, 0);
}

export function readToolbarStateFromUrl(search: string): Partial<ToolbarState> {
  const params = new URLSearchParams(search);

  const searchValue = params.get("search") ?? "";
  const selectedTagId = params.get("tagId") ?? "all";
  const sortBy = params.get("sortBy") as ToolbarSortBy | null;
  const sortOrder = params.get("sortOrder") as ToolbarSortOrder | null;

  return {
    searchValue,
    selectedTagId,
    sortBy:
      sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "title"
        ? sortBy
        : "updatedAt",
    sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc",
  };
}

export function syncToolbarStateToUrl(
  searchValue: string,
  selectedTagId: string,
  sortBy: ToolbarSortBy,
  sortOrder: ToolbarSortOrder,
): void {
  const params = new URLSearchParams(window.location.search);

  if (searchValue.trim()) {
    params.set("search", searchValue.trim());
  } else {
    params.delete("search");
  }

  if (selectedTagId !== "all") {
    params.set("tagId", selectedTagId);
  } else {
    params.delete("tagId");
  }

  if (sortBy !== "updatedAt" || sortOrder !== "desc") {
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
  } else {
    params.delete("sortBy");
    params.delete("sortOrder");
  }

  const nextSearch = params.toString();
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`;
  window.history.replaceState({}, "", nextUrl);
}

export function getNextSortState(value: string): {
  sortBy: ToolbarSortBy;
  sortOrder: ToolbarSortOrder;
} {
  if (value === "createdAt-desc") {
    return { sortBy: "createdAt", sortOrder: "desc" };
  }

  if (value === "createdAt-asc") {
    return { sortBy: "createdAt", sortOrder: "asc" };
  }

  if (value === "updatedAt-desc") {
    return { sortBy: "updatedAt", sortOrder: "desc" };
  }

  if (value === "updatedAt-asc") {
    return { sortBy: "updatedAt", sortOrder: "asc" };
  }

  if (value === "title-asc") {
    return { sortBy: "title", sortOrder: "asc" };
  }

  return { sortBy: "title", sortOrder: "desc" };
}
