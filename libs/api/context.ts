import prisma from "./prisma";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import jwt from "jwt-simple";

import type { NextApiRequest } from "next";
import { UserContext } from "./classes/UserContext";

async function getUserFromHeader(req: NextApiRequest) {
  if (req.headers.authorization) {
    try {
      let payload: JWTPayload = jwt.decode(
        req.headers.authorization.split(" ")[1],
        process.env.APP_SECRET_KEY
      );
      return payload;
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}
export const createContext = async ({
  req,
  res
}: trpcNext.CreateNextContextOptions) => {
  let userSession: SessionUser | null = (await getUserFromHeader(req))?.user;
  let user = new UserContext(userSession);
  await user.init();
  return {
    req,
    res,
    prisma,
    user
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
