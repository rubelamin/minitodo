// server/context.ts
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/server/auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createContext() {
  const session = await auth();

  return {
    session,
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
