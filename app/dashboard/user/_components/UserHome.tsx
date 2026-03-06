//app\dashboard\user\_components\UserHome.tsx
"use client";

import { useState } from "react";
import { CreateInputTask } from "@/types/task";
import TaskList from "@/components/List";
import TaskItem from "@/components/TaskItem";
import { trpc } from "@/utils/trpc";

export default function UserHome() {
  const [title, setTitle] = useState<string>("");

  const utils = trpc.useUtils();

  const { data: tasks = [] } = trpc.task.getAll.useQuery();

  const taskAdd = trpc.task.addTask.useMutation({
    async onSuccess() {
      await utils.task.getAll.invalidate();
    },
  });

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

  const addTask = async () => {
    if (!title.trim()) return;

    const newTask: CreateInputTask = {
      title,
    };

    setTitle("");

    try {
      await taskAdd.mutateAsync(newTask);
    } catch (error) {
      console.log("Failed to add task. reason: ", error);
    }
  };

  const toggleTask = (id: string) => {
    toggleMutation.mutate(id);
  };

  const deleteTask = (id: string) => {
    deletTaskById.mutate(id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Task Manager
          </h1>
          <p className="text-slate-600">Stay organized and productive</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
            />
            <button
              onClick={addTask}
              disabled={taskAdd.isPending}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </div>
        </div>

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
