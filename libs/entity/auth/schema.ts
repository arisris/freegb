import { object, string, ref } from "yup";

export const authRouterInputTokenSchema = object({
  email: string().email().required(),
  password: string().required(),
  device_name: string().notRequired().default("regular-login")
});
export const authRouterInputCreateSchema = object({
  name: string().required(),
  email: string().email().required(),
  password: string().min(6).max(32).required(),
  password_confirmation: string()
    .oneOf([ref("password"), null], "Password Is Not Match")
    .required()
});
