"use client";
import React from "react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import MyButton from "./MyButton";

type TaskItemProp = {
  task: Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

function TaskItem({ taskItem }: { taskItem: TaskItemProp }) {
  return (
    <div className="group flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 border border-slate-200">
      <div className="flex items-center flex-1 min-w-0">
        <MyButton
          value={taskItem.task.id}
          onClick={taskItem.toggleTask}
          className="flex-shrink-0 mr-3"
        >
          <div
            className={`w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
              taskItem.task.status === "DONE"
                ? "bg-green-500 border-green-500"
                : "border-slate-400 hover:border-blue-500"
            }`}
          >
            {taskItem.task.status === "DONE" && (
              <svg
                className="w-4 h-4 text-white mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </MyButton>
        <span
          className={`flex-1 truncate cursor-pointer text-lg ${
            taskItem.task.status === "DONE"
              ? "text-slate-500 line-through"
              : "text-slate-700"
          }`}
          onClick={() => taskItem.toggleTask(taskItem.task.id)}
        >
          {taskItem.task.title}
        </span>
        <span className="text-xs text-green-500">
          {format(taskItem.task.createdAt, "yyyy-MM-dd hh:mm:ss aaa")}
        </span>
      </div>

      <MyButton
        value={taskItem.task.id}
        onClick={taskItem.deleteTask}
        className="ml-2 flex-shrink-0 p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        aria-label="Delete task"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </MyButton>
    </div>
  );
}

export default TaskItem;
