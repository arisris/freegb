import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { transformer } from "../client/trpc";
import { Context } from "./context";

type CreateRouterOptions = {
  protected?: boolean;
};

export function createRouter(options: CreateRouterOptions = {}) {
  const router = trpc.router<Context>();
  if (options.protected) {
    router.middleware(async ({ ctx, next }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      return next();
    });
  }
  router.transformer(transformer);
  return router;
}
