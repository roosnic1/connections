export type ReviewSortField = "createdAt" | "difficulty" | "reviewerName";
export type SortDir = "asc" | "desc";

export const VALID_SORT_FIELDS: ReviewSortField[] = [
  "createdAt",
  "difficulty",
  "reviewerName",
];

export const VALID_SORT_DIRS: SortDir[] = ["asc", "desc"];
