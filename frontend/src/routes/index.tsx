import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/task-list";
import { TaskToolbar } from "@/components/task-toolbar";
import { TaskForm } from "@/components/task-form";
import { ListSwitcher } from "@/components/list-switcher";
import { NewListDialog } from "@/components/new-list-dialog";
import { ListMembersDialog } from "@/components/list-members-dialog";
import { listsQueryOptions, useLists } from "@/hooks/useLists";
import { useTasks } from "@/hooks/useTasks";
import { useTaskView } from "@/hooks/useTaskView";
import { requireAuth } from "@/lib/auth";
import type { CreateListInput } from "@/schemas/lists";
import type { Task } from "@/types/tasks";

export const Route = createFileRoute("/")({
  // The selected list, kept in the URL so it survives refreshes
  validateSearch: (search): { list?: string } => ({
    list: typeof search.list === "string" ? search.list : undefined,
  }),
  beforeLoad: requireAuth,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listsQueryOptions),
  component: TasksPage,
});

function TasksPage() {
  const { user } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { lists, createList, addMember } = useLists();
  // Falls back to the personal list, which comes first, if the selected one isn't accessible
  const list = lists.find((l) => l._id === search.list) ?? lists[0];
  const listId = list._id;

  function selectList(id: string) {
    navigate({ search: { list: id } });
  }

  // Switches to the new list once created
  async function handleCreateList(data: CreateListInput) {
    const created = await createList(data);
    if (created) selectList(created._id);
    return !!created;
  }
  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks(listId);
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
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-4 py-8 sm:px-6">
      <div className="flex flex-row items-center gap-1">
        <ListSwitcher
          lists={lists}
          listId={listId}
          userId={user._id}
          onChange={selectList}
        />
        {/* Personal lists can't be shared */}
        {!list.personal && (
          <ListMembersDialog
            list={list}
            isOwner={list.owner._id === user._id}
            onAddMember={(data) => addMember(listId, data)}
          />
        )}
        <NewListDialog onSubmit={handleCreateList} />
      </div>

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
          showCreator={!list.personal}
        />
      </section>
    </div>
  );
}

function countTodos(tasks: Task[]) {
  return tasks.filter((t) => !t.done).length;
}
