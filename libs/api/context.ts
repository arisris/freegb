import prisma from "./prisma";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import jwt from "jwt-simple";

import type { NextApiRequest } from "next";
import { UserContext } from "./classes/UserContext";
import { getAccessTokenFromCookie } from "./utils";

function getUserFromHeader(req: NextApiRequest) {
  try {
    // there has two options cookie based or bearer based
    let token = req.headers?.authorization?.split(" ")[1] ?? null;
    if (!token) token = getAccessTokenFromCookie(req);
    if (!token) return null;

    let payload: JWTPayload = jwt.decode(token, process.env.APP_SECRET_KEY);
    return payload?.user;
  } catch (e) {
    return null;
  }
}
export const createContext = async ({
  req,
  res
}: trpcNext.CreateNextContextOptions) => {
  let user = new UserContext(getUserFromHeader(req));
  await user.init();
  return {
    req,
    res,
    prisma,
    user
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
