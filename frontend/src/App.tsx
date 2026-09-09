import { Toaster } from "@/components/ui/sonner";
import { TaskList } from "./components/task-list";
import { TaskToolbar } from "./components/task-toolbar";
import { TaskForm } from "./components/task-form";
import { useTasks } from "./hooks/useTasks";
import { useTaskView } from "./hooks/useTaskView";

function App() {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-xl flex-col gap-10 px-4 py-8 sm:px-6">
        <TaskForm onSubmit={createTask} />

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
      </div>

      <Toaster />
    </div>
  );
}

export default App;
