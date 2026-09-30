import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/task-list";
import { TaskToolbar } from "@/components/task-toolbar";
import { TaskForm } from "@/components/task-form";
import { useTasks } from "@/hooks/useTasks";
import { useTaskView } from "@/hooks/useTaskView";
import type { Task } from "@/types/tasks";

export const Route = createFileRoute("/")({
  component: TasksPage,
});

function TasksPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks();
  const {
    visibleTasks,
    sortBy,
    sortDir,
    setSortBy,
    toggleSortDir,
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  } = useTaskView(tasks);
  const todoCount = countTodos(tasks);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-10 px-4 py-8 sm:px-6">
      <TaskForm onSubmit={createTask} />

      <section aria-labelledby="tasks-heading" className="flex flex-col gap-4">
        {/* Count of not done tasks; shows the total too when filtered */}
        {!loading && !error && (
          <h2 id="tasks-heading" className="text-sm font-medium">
            {hasActiveFilters && `${countTodos(visibleTasks)} of `}
            {todoCount} {todoCount === 1 ? "TODO" : "TODOs"}
          </h2>
        )}

        <TaskToolbar
          sortBy={sortBy}
          sortDir={sortDir}
          setSortBy={setSortBy}
          toggleSortDir={toggleSortDir}
          filters={filters}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <TaskList
          tasks={visibleTasks}
          loading={loading}
          error={error}
          hasActiveFilters={hasActiveFilters}
          onEdit={updateTask}
          onDelete={deleteTask}
        />
      </section>
    </div>
  );
}

function countTodos(tasks: Task[]) {
  return tasks.filter((t) => !t.done).length;
}
