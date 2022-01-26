import { createRouter } from "../createRouter";
import * as z from "yup";
import { compare, hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import jwt from "jwt-simple";

const tokenInput = z.object({
  email: z.string().email(),
  password: z.string(),
  device_name: z.string().notRequired().default("regular-login")
});
const authCreateInput = z.object({
  name: z.string().required(),
  email: z.string().email().required(),
  password: z.string().min(6).max(32),
  password_confirmation: z
    .string()
    .oneOf([z.ref("password"), null], "Password Is Not Match")
});
export type AuthTokenInput = z.InferType<typeof tokenInput>;
export type AuthCreateInput = z.InferType<typeof authCreateInput>;

export const authRouter = createRouter()
  .mutation("token", {
    input: tokenInput,
    async resolve({ ctx, input: { email, password, device_name } }) {
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
    input: authCreateInput,
    async resolve({ ctx, input }) {
      //console.log(ctx.user.getSession())
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
