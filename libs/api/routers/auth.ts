import { createRouter } from "../createRouter";
import * as z from "yup";
import { compare, hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import jwt from "jwt-simple";

export const authRouter = createRouter()
  .mutation("token", {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
      device_name: z.string().optional().default("regular-login")
    }),
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
      if (!(await compare(password, user.password)))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credential"
        });
      let payload: JWTPayload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        exp: Date.now() + 3600 * 1000 * 2
      };
      let token = jwt.encode(payload, process.env.APP_SECRET_KEY);
      let response: JWTResponse = { token, exp: payload.exp };
      return response;
    }
  })
  .mutation("create", {
    input: z.object({
      name: z.string().required(),
      email: z.string().email().required(),
      password: z.string().min(6).max(32),
      password_confirmation: z
        .string()
        .oneOf([z.ref("password"), null], "Password Not Match")
    }),
    async resolve({ ctx, input }) {
      if (!ctx.user.isGuest()) throw new TRPCError({ code: "FORBIDDEN" });
      input.password = await hash(input.password, 10);
      let user = await ctx.prisma.users.create({
        data: input,
        select: { id: true }
      });
      return { message: "User Registered", id: user.id };
    }
  });
