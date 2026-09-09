import { ArrowUpIcon, ArrowDownIcon, XIcon } from "lucide-react";
import {
  SORT_OPTIONS,
  type SortBy,
  type SortDir,
  type Filters,
} from "@/hooks/useTaskView";
import { PRIORITIES, TAGS } from "@/types/tasks";
import { PriorityBadge } from "@/components/priority-badge";
import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_LABELS: Record<SortBy, string> = {
  createdAt: "Date added",
  dueDate: "Due date",
  priority: "Priority",
  tag: "Tag",
};

interface TaskToolbarProps {
  sortBy: SortBy;
  sortDir: SortDir;
  setSortBy: (sortBy: SortBy) => void;
  toggleSortDir: () => void;

  filters: Filters;
  updateFilters: <K extends keyof Filters>(field: K, value: Filters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function TaskToolbar({
  sortBy,
  sortDir,
  setSortBy,
  toggleSortDir,
  filters,
  updateFilters,
  resetFilters,
  hasActiveFilters,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      {/* Sorting */}
      <div className="flex flex-row items-center gap-1">
        {/* Select sort by option */}
        <Select
          value={sortBy}
          onValueChange={(v) => v && setSortBy(v as SortBy)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by">
              {(v: SortBy | null) => (v ? SORT_LABELS[v] : "Sort by")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {SORT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Toggle sort direction */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={sortDir === "asc" ? "Sort ascending" : "Sort descending"}
          onClick={toggleSortDir}
        >
          {sortDir === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Button>
      </div>

      {/* Filtering */}
      <div className="flex flex-row items-center gap-1">
        {/* Filter by tag */}
        <Select
          value={filters.tag}
          onValueChange={(v) => v && updateFilters("tag", v as Filters["tag"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tag">
              {(v: Filters["tag"] | null) =>
                v && v !== "All" ? <TagBadge tag={v} /> : "All tags"
              }
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All tags</SelectItem>
            {TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                <TagBadge tag={tag} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter by priority */}
        <Select
          value={filters.priority}
          onValueChange={(v) =>
            v && updateFilters("priority", v as Filters["priority"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority">
              {(v: Filters["priority"] | null) =>
                v && v !== "All" ? (
                  <PriorityBadge priority={v} />
                ) : (
                  "All priorities"
                )
              }
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All priorities</SelectItem>
            {PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                <PriorityBadge priority={priority} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          // Reset filters
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Clear filters"
            onClick={resetFilters}
          >
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
