// server/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { Role } from "@/app/generated/prisma/enums";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

export const requireRole = (roles: Role[]) =>
  protectedProcedure.use(({ ctx, next }) => {
    if (!ctx.user.role) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User role is missing.",
      });
    }

    if (!roles.includes(ctx.user.role as Role)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          ...ctx.user,
          role: ctx.user.role as Role,
        },
      },
    });
  });

export const adminProcedure = requireRole([Role.ADMIN]);

export const userProcedure = requireRole([Role.USER]);
