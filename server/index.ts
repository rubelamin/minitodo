import { router } from "./trpc";
import { taskRouter } from "./routers/task";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  task: taskRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
