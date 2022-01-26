import { createRouter } from "../createRouter";
import { object, string, ref } from "yup";
import { compare, hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import jwt from "jwt-simple";

export const authRouter = createRouter()
  .mutation("token", {
    input: object({
      email: string().email(),
      password: string(),
      device_name: string().notRequired().default("regular-login")
    }),
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
    input: object({
      name: string().required(),
      email: string().email().required(),
      password: string().min(6).max(32),
      password_confirmation: string().oneOf(
        [ref("password"), null],
        "Password Is Not Match"
      )
    }),
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
