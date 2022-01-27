import { compare, hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import jwt from "jwt-simple";
import { createRouter } from "@/libs/api/createRouter";
import {
  authRouterInputCreateSchema,
  authRouterInputTokenSchema
} from "./schema";

export const authRouter = createRouter()
  .mutation("token", {
    input: authRouterInputTokenSchema,
    async resolve({ ctx, input: { email, password } }) {
      let user = await ctx.prisma.users.findUnique({
        where: {
          email: email
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true
        }
      });
      if (!user || !(await compare(password, user.password)))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credential"
        });
      return createJWT({
        id: user.id,
        name: user.name,
        email: user.email
      });
    }
  })
  .mutation("create", {
    input: authRouterInputCreateSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user.isGuest()) throw new TRPCError({ code: "FORBIDDEN" });
      input.password = await hash(input.password, 10);
      delete input.password_confirmation;
      let user = await ctx.prisma.users.create({
        data: {
          ...input,
          roles: {
            connect: {
              slug: "user"
            }
          }
        },
        select: { id: true, name: true, email: true }
      });
      return createJWT(user);
    }
  });

function createJWT(user: SessionUser): JWTResponse {
  let payload: JWTPayload = { user, exp: Date.now() + 3600 * 1000 * 2 };
  let token = jwt.encode(payload, process.env.APP_SECRET_KEY);
  return { token, exp: payload.exp };
}
