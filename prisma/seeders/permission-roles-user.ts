import { ucWords } from "../../libs/shared/utils";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const roles = ["user", "moderator", "admin"];
const permissions = [
  "manage:sites",
  "manage:users",
  "manage:posts",
  "manage:permissions",
  "manage:roles",
  "manage:comments",
  "manage:categories",
  "manage:tags",
  "manage:settings",
  "manage:system"
];
export default async (prisma: PrismaClient) => {
  for (let permission of permissions) {
    await prisma.permissions.create({
      data: {
        name: ucWords(permission.replace(":", " ")),
        slug: permission
      }
    });
  }
  for (let role of roles) {
    await prisma.roles.create({
      data: {
        name: ucWords(role),
        slug: role
      }
    });
  }
  await prisma.roles.update({
    where: {
      slug: "moderator"
    },
    data: {
      permissions: {
        connect: [...permissions]
          .filter((p) => p !== "manage:system")
          .map((i) => ({ slug: i }))
      }
    }
  });
  await prisma.users.create({
    data: {
      name: "Admin",
      email: "admin@example.net",
      emailVerifiedAt: new Date(),
      password: await hash("password123", 10),
      avatar: "https://i.pravatar.cc/150?u=Admin",
      roles: {
        connect: {
          slug: "admin"
        }
      }
    }
  });
};
