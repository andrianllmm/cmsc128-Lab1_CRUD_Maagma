import { useState } from "react";
import type { Task, Priority, Tag } from "@/types/tasks";

// Task priority ranking for sorting
export const PRIORITY_RANK: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
  None: 0,
};

// Sort options
export const SORT_OPTIONS = [
  "createdAt",
  "dueDate",
  "priority",
  "tag",
] as const;
export type SortBy = (typeof SORT_OPTIONS)[number];

export const SORT_DIRECTIONS = ["asc", "desc"] as const;
export type SortDir = (typeof SORT_DIRECTIONS)[number];

// Filter options
export type Filters = {
  tag: Tag | "All";
  priority: Priority | "All";
};

export const DEFAULT_FILTERS: Filters = {
  tag: "All",
  priority: "All",
};

// Task comparison function for sorting
function compareTasks(a: Task, b: Task, sortBy: SortBy): number {
  switch (sortBy) {
    case "createdAt":
      // Oldest first (asc)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    case "dueDate": {
      // No due date is farthest away
      const getDueDate = (t: Task) =>
        t.dueDate ? new Date(t.dueDate).getTime() : Infinity;
      return getDueDate(a) - getDueDate(b);
    }

    case "priority":
      // Based on pre-defined priority ranking
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];

    case "tag":
      // Alphabetical order
      return a.tag.localeCompare(b.tag);
  }
}

export function useTaskView(tasks: Task[]) {
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  // Newest first by default
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const hasActiveFilters = filters.tag !== "All" || filters.priority !== "All";

  // Switches asc to desc and vice versa
  function toggleSortDir() {
    setSortDir((sortDir) => (sortDir === "asc" ? "desc" : "asc"));
  }

  // Update a filter value
  function updateFilters(field: keyof Filters, value: string) {
    setFilters((filters) => ({
      ...filters,
      [field]: value,
    }));
  }

  // Sets all filters to default
  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return {
    visibleTasks: tasks
      .filter((task) => {
        const { tag, priority } = filters;
        return (
          (tag === "All" || task.tag === tag) &&
          (priority === "All" || task.priority === priority)
        );
      })
      .sort((a, b) => {
        const cmp = compareTasks(a, b, sortBy);
        return sortDir === "asc" ? cmp : -cmp;
      }),

    sortBy,
    sortDir,
    setSortBy,
    toggleSortDir,

    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  };
}
