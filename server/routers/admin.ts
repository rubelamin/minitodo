//server\routers\admin.ts
import z from "zod";
import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const adminRouter = router({
  getAllUsers: adminProcedure.query(async () => {
    const userArr = await prisma.user.findMany({
      omit: {
        password: true,
      },
      include: {
        tasks: true,
      },
    });

    return userArr;
  }),

  deleteUser: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { id: input },
    });

    if (!user) throw new Error("User not found!");

    const deleted = await prisma.user.delete({
      where: { id: input },
    });

    return deleted;
  }),

  getAllTasks: adminProcedure.query(async () => {
    const taskArr = await prisma.task.findMany({
      include: {
        user: true,
      },
    });

    return taskArr;
  }),

  deleteTask: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    const task = await prisma.task.findUnique({
      where: { id: input },
    });

    if (!task) throw new Error("Task not found!");

    const deleted = await prisma.task.delete({
      where: { id: task.id },
    });

    return deleted;
  }),
});
