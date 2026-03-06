//server\routers\task.ts
import { router, userProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TaskStatus } from "@/app/generated/prisma/enums";

export const taskRouter = router({
  getAll: userProcedure.query(async ({ ctx }) => {
    const tasksArr = await prisma.task.findMany({
      where: { userId: ctx.user.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    const tasks = tasksArr.map((t) => {
      const tt = {
        id: t.id,
        title: t.title,
        status: t.status,
        createdAt: t.createdAt,
        userId: t.userId,
      };

      return tt;
    });
    return tasks;
  }),

  addTask: userProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const taskData = {
        ...input,
        status: TaskStatus.PENDING,
        userId: ctx.user.id as string,
      };
      const task = await prisma.task.create({
        data: taskData,
      });

      return task;
    }),

  toggle: userProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const task = await prisma.task.findUnique({
      where: { id: input, userId: ctx.user.id },
    });

    if (!task) throw new Error("Task not found!");

    const st = task.status === "DONE" ? "PENDING" : "DONE";
    const versionUp = Number(task.version) + 1;

    return prisma.task.update({
      where: { id: input },
      data: {
        status: st,
        version: versionUp,
      },
    });
  }),

  deleteTask: userProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const existingTask = await prisma.task.findFirst({
        where: { id: input, userId: ctx.user.id },
      });

      if (!existingTask) {
        throw new Error("Task not found!");
      }
      const deleted = await prisma.task.delete({
        where: { id: existingTask.id },
      });

      return deleted;
    }),
});
