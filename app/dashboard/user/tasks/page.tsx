//app\dashboard\user\_components\UserHome.tsx
"use client";

import TaskList from "@/components/List";
import TaskItem from "@/components/TaskItem";
import { trpc } from "@/utils/trpc";

export default function UserTasksList() {
  const utils = trpc.useUtils();

  const { data: tasks = [] } = trpc.task.getAll.useQuery();

  const deletTaskById = trpc.task.deleteTask.useMutation({
    onSuccess: async () => {
      await utils.task.getAll.invalidate();
    },
  });

  const toggleMutation = trpc.task.toggle.useMutation({
    onSuccess: async () => {
      await utils.task.getAll.invalidate();
    },
  });

  const toggleTask = (id: string) => {
    toggleMutation.mutate(id);
  };

  const deleteTask = (id: string) => {
    deletTaskById.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
            <span>Your Tasks</span>
            <span className="ml-2 bg-slate-200 text-slate-600 text-sm px-2.5 py-0.5 rounded-full">
              {tasks?.length}
            </span>
          </h2>

          {tasks?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No tasks yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Add a task to get started
              </p>
            </div>
          ) : (
            <>
              <TaskList
                items={tasks}
                renderItem={(task) => {
                  const taskListItems = {
                    task: {
                      title: task.title,
                      id: task.id,
                      status: task.status,
                      userId: task.userId,
                      createdAt: new Date(task.createdAt),
                    },
                    toggleTask,
                    deleteTask,
                  };
                  return <TaskItem taskItem={taskListItems} />;
                }}
              />
            </>
          )}
        </div>

        {/* Footer Stats */}
        {tasks?.length > 0 && tasks !== undefined && (
          <div className="mt-6 text-sm text-slate-500 text-center">
            <span>
              {tasks?.filter((t) => t.status !== "DONE").length} tasks remaining
            </span>
            <span className="mx-2">•</span>
            <span>
              {tasks?.filter((t) => t.status === "DONE").length} completed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
