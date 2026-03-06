"use server";
import { prisma } from "@/lib/prisma";

export async function toggleTask(id: string) {
  if (!id) return;

  const existing = await prisma.task.findUnique({
    where: { id: id },
  });

  if (!existing) return;

  await prisma.task.update({
    where: { id: id },
    data: {
      status: "DONE",
    },
  });
}
