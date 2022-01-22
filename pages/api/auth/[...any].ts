import { handleApiError, tokenGuard } from "@/libs/api/handlers";
import prisma from "@/libs/api/prisma";
import NextApiRoute from "@arisris/next-api-router";
import { compare, hash } from "bcryptjs";
import { BadRequest } from "http-json-errors";
import { object, ref, string } from "yup";
import * as jwt from "jwt-simple";

export default NextApiRoute({
  onError: handleApiError
})
  .all("*", tokenGuard({ required: false }))
  .post("/register", async (req, res) => {
    if (req.locals?.user) throw new BadRequest("Already Logged In");
    const schema = object({
      name: string().required(),
      email: string().email().required(),
      password: string().min(6).max(32).required(),
      password_confirmation: string().equals(
        [ref("password"), null],
        "Password Is Not Match"
      )
    });
    const value = await schema.validate(req.body);
    delete value.password_confirmation;
    value.password = await hash(value.password, 10);
    let user = await prisma.users.create({
      data: value
    });
    res.json({ message: "User Registered", id: user.id });
  })
  .post("/token", async (req, res) => {
    if (req.locals?.user) throw new BadRequest("Already Logged In");
    const schema = object({
      email: string().email().required(),
      password: string().min(6).max(32).required(),
      device_name: string().nullable()
    });
    const value = await schema.validate(req.body);
    if (!value.device_name) value.device_name = "regular-login";
    const user = await prisma.users.findUnique({
      where: {
        email: value.email
      }
    });
    const isPasswordMatch = await compare(value.password, user.password);
    if (!isPasswordMatch) throw new BadRequest("Invalid Username OR Password");
    let exp = Date.now() + 3600 * 1000 * 2;
    let token = jwt.encode(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        exp
      },
      process.env.APP_SECRET_KEY
    );
    res.json({ token, exp });
  }).handle;
