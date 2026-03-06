//types\task.ts
import { TaskStatus } from "@/app/generated/prisma/enums";
import React, { ReactNode } from "react";

export type Task = {
  title: string;
  id: string;
  status: TaskStatus;
  createdAt: Date;
  userId?: string;
};

export type CreateInputTask = {
  title: string;
};

export type ButtonProps<T> = {
  value: T;
  onClick: (value: T) => void;
  className?: string;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export type BaseItem = { id: string | number };
