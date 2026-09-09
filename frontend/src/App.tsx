import { Toaster } from "@/components/ui/sonner";
import { TaskList } from "./components/task-list";
import { TaskForm } from "./components/task-form";
import { useTasks } from "./hooks/useTasks";

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-xl flex-col gap-10 px-4 py-8 sm:px-6">
        <TaskForm onSubmit={createTask} />

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onEdit={updateTask}
          onDelete={deleteTask}
        />
      </div>

      <Toaster />
    </div>
  );
}

export default App;
