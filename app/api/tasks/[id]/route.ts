//app\api\tasks\[id]\route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const existing = await prisma.task.findUnique({
    where: { id: id },
  });

  if (!existing) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const st = existing.status === "DONE" ? "PENDING" : "DONE";
    const task = await prisma.task.update({
      where: { id: id },
      data: {
        status: st,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update task " + error },
      { status: 500 },
    );
  }
}
