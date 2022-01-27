import { transformer } from "../client/trpc";
import { authRouter } from "../entity/auth/router";
import { userRouter } from "../entity/users/router";
import { errorFormater } from "./errorFormater";
import { createRouter } from "./createRouter";

export const appRouter = createRouter()
  .formatError(errorFormater)
  .transformer(transformer)
  // .middleware(async ({ ctx, next }) => {
  //   return next();
  // })
  .merge("users.", userRouter)
  .merge("auth.", authRouter);

export type AppRouter = typeof appRouter;
