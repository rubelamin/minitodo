//lib\zod.ts
import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .email()
    .min(3, "Enter valid email")
    .max(50, "Enter valid email")
    .toLowerCase()
    .normalize(),
  password: z
    .string()
    .min(8, "Minimum 8 characters!")
    .max(32, "Max 32 characters"),
});

export const RegisterSchema = z.object({
  name: z.string({ error: "Enter valid name!" }).min(1).max(55),
  email: z.email({ error: "Enter valid email" }),
  password: z
    .string({ error: "Enter password" })
    .min(8, "Minmum 8 charecters")
    .max(32, "Max 32 chars"),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type RegisterFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
  message?: string;
  values?: {
    name?: string;
    email?: string;
    password?: string;
  };
};
