import { createRouter } from "../createRouter";
import { transformer } from "@/libs/client/trpc";
import { errorFormater } from "../errorFormater";
import { authRouter } from "./auth";
import { userRouter } from "./users";

export const appRouter = createRouter()
  .formatError(errorFormater)
  .transformer(transformer)
  .middleware(async ({ ctx, next }) => {
    // const result = await next();
    // console.log(result)
    //console.log(ctx.req.statusCode)
    return next();
  })
  .merge("users.", userRouter)
  .merge("auth.", authRouter)
  

export type AppRouter = typeof appRouter;
