import { createRouter } from "../createRouter";
import { authRouter } from "./auth";
import { userRouter } from "./users";

export const appRouter = createRouter()
  .merge("users.", userRouter)
  .merge("auth.", authRouter);

export type AppRouter = typeof appRouter;
