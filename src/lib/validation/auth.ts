import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("emailInvalid"));

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(100, "nameTooLong"),
  email: emailSchema,
  password: z.string().min(8, "passwordTooShort").max(128, "passwordTooLong"),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "passwordRequired"),
});