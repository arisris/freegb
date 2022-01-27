import { object, string, number } from "yup";

export const userRouterInputCreateSchema = object({
  name: string().required(),
  email: string().email().required(),
  avatar: string().url().optional(),
  password: string().min(6).max(32).required()
});

export const userRouterInputUpdateSchema = object({
  id: number().required(),
  input: object({
    name: string().optional(),
    email: string().email().optional(),
    avatar: string().url().optional(),
    password: string().min(6).max(32).optional()
  })
})

export const userRouterInputDeleteSchema = object({
  id: number().required()
});

export const userRouterInputByIdSchema = userRouterInputDeleteSchema;