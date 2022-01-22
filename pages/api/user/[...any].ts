import { handleApiError, tokenGuard } from "@/libs/api/handlers";
import prisma from "@/libs/api/prisma";
import { UserRole } from "@/libs/shared/enums";
import NextApiRoute from "@arisris/next-api-router";
import { hash } from "bcryptjs";
import { BadRequest } from "http-json-errors";
import { object, string } from "yup";

export default NextApiRoute({
  onError: handleApiError
})
  .post("/create", tokenGuard(), async (req, res) => {
    let currentUser = req.locals?.user;
    if (currentUser?.role !== UserRole.ADMIN)
      throw new BadRequest("Not allowed");

    let schema = object({
      name: string().required(),
      email: string().email().required(),
      password: string().min(6).max(32).required(),
      avatar: string().nullable()
    });
    let value = await schema.validate(req.body);
    let knownUser = await prisma.users.findUnique({
      where: { email: value.email },
      select: { id: true }
    });
    if (knownUser) throw new BadRequest("Email has been taken!!");
    value.password = await hash(value.password, 10);
    let user = await prisma.users.create({
      data: value
    });
    res.json({ message: "User Created", id: user.id });
  })
  .get("/list", tokenGuard(), async (req, res) => {
    let users = await prisma.users.findMany({
      take: 10,
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerifiedAt: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json({
      users
    });
  })
  .get("/me", tokenGuard(), async (req, res) => {
    let user = await prisma.users.findUnique({
      where: {
        id: req.locals.user?.id
      }
    });
    delete user.password;
    res.json({ user });
  })
  .get("/read/:id", tokenGuard({ required: false }), async (req, res) => {
    let user = await prisma.users.findUnique({
      where: {
        id: parseInt(req.params?.id)
      }
    });
    delete user.password;
    res.json({ user });
  })
  .post("/update/:id", tokenGuard(), async (req, res) => {
    let userId = parseInt(req.params?.id);
    if (!userId) throw new BadRequest("Required User ID");
    let schema = object({
      name: string().nullable(),
      password: string().min(6).max(32).nullable(),
      avatar: string().nullable()
    });
    let value = await schema.validate(req.body);
    let currentUser = req.locals?.user;
    if (currentUser?.id === userId || currentUser?.role === UserRole.ADMIN) {
      if (value.password) value.password = await hash(value.password, 10);
      let user = await prisma.users.update({
        where: { id: userId },
        data: value
      });
      delete user.password;
      res.json({ user });
    } else {
      throw new BadRequest("Not allowed");
    }
  })
  .post("/delete/:id", tokenGuard(), async (req, res) => {
    let userId = parseInt(req.params?.id);
    if (!userId) throw new BadRequest("Required User ID");
    let currentUser = req.locals?.user;
    if (currentUser?.role !== UserRole.ADMIN || currentUser?.id === userId)
      throw new BadRequest("Not allowed");
    let deleted = await prisma.users.delete({
      where: { id: userId }
    });
    if (!deleted) throw new BadRequest("No User Are Deleted..");
    res.json({ message: "User Deleted...", id: userId });
  }).handle;
