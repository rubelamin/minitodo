//app\actions\auth.ts
"use server";
import { prisma } from "@/lib/prisma";
import { type RegisterFormState, RegisterSchema } from "@/lib/zod";
import { hashPassword, comparePassword } from "@/utils/hashPass";

export const registerUser = async (
  prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> => {
  const validateResults = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateResults.success)
    return {
      success: false,
      errors: validateResults.error.flatten().fieldErrors,
    };

  const { name, email, password } = validateResults.data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return {
      message: "User already exists with the email you entered.",
    };
  }

  const { passwordHashed } = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHashed,
    },
  });

  return {
    success: true,
    message: `Regitration success for email ${user.email}`,
  };

  //   return {
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     role: user.role,
  //     image: user?.image,
  //     emailVerified: user?.emailVerified,
  //   };
};

export const getDbUser = async (email: string, password: string) => {
  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    console.log("RETURN FROM HERE");
    return null;
  }

  const passwordMatched = await comparePassword(password, user.password);

  if (!passwordMatched) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user?.image,
    emailVerified: user?.emailVerified,
  };
};
