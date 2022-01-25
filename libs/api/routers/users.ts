import { createRouter } from "../createRouter";
import * as z from "yup";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

export const defaultUserSelect = Prisma.validator<Prisma.UsersSelect>()({
  id: true,
  name: true,
  avatar: true,
  createdAt: true,
  updatedAt: true
});

export const userRouter = createRouter()
  .mutation("create", {
    input: z.object({
      name: z.string().required(),
      email: z.string().email().required(),
      avatar: z.string().url().optional(),
      password: z.string().min(6).max(32).required()
    }),
    async resolve({ ctx, input }) {
      if (!ctx.user.isAdmin())
        throw new TRPCError({ code: "FORBIDDEN", message: "Not right roles" });

      let knownUser = await ctx.prisma.users.findUnique({
        where: { email: input.email },
        select: { id: true }
      });
      if (knownUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email has been taken!!"
        });
      input.password = await hash(input.password, 10);
      let user = await ctx.prisma.users.create({
        data: input,
        select: defaultUserSelect
      });
      return user;
    }
  })
  .mutation("update", {
    input: z.object({
      id: z.number().required(),
      input: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        avatar: z.string().url().optional(),
        password: z.string().min(6).max(32).optional()
      })
    }),
    async resolve({ ctx, input: { id, input } }) {
      if (!ctx.user.isAdmin())
        throw new TRPCError({ code: "FORBIDDEN", message: "Not right roles" });
      if (input.password) input.password = await hash(input.password, 10);
      if (input.email) {
        let knownUser = await ctx.prisma.users.findUnique({
          where: { email: input.email },
          select: { id: true }
        });
        if (knownUser)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email has been taken!!"
          });
      }
      let user = await ctx.prisma.users.update({
        where: { id },
        data: input,
        select: defaultUserSelect
      });
      return user;
    }
  })
  .mutation("delete", {
    input: z.object({
      id: z.number().required()
    }),
    async resolve({ ctx, input: { id } }) {
      if (!ctx.user.isAdmin())
        throw new TRPCError({ code: "FORBIDDEN", message: "Not right roles" });
      let user = await ctx.prisma.users.delete({
        where: { id },
        select: defaultUserSelect
      });
      return user;
    }
  })
  .query("byId", {
    input: z.object({
      id: z.number().required()
    }),
    async resolve({ ctx, input: { id } }) {
      let user = await ctx.prisma.users.findUnique({
        where: { id },
        select: defaultUserSelect
      });
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with id '${id}'`
        });
      return user;
    }
  })
  .query("me", {
    async resolve({ ctx }) {
      //console.log(ctx.req.headers["x-ssr"])
      let currentUser = ctx.user.getSession();
      //return { hello: "World"}
      if (!currentUser) return null;
      let user = await ctx.prisma.users.findUnique({
        where: { id: currentUser.id },
        select: {
          ...defaultUserSelect,
          email: true,
          emailVerifiedAt: true,
          roles: { select: { id: true, name: true } },
          permissions: { select: { id: true, name: true } }
        }
      });
      return user;
    }
  })
  .query("all", {
    async resolve({ ctx }) {
      let user = await ctx.prisma.users.findMany({
        select: defaultUserSelect
      });
      return user;
    }
  });
