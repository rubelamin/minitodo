// /app/actions/update-password.ts
"use server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/hashPass";

export const updatePasswordWithToken = async (
  token: string,
  newPass: string,
) => {
  const existingToken = await prisma.verificationToken.findFirst({
    where: { token: token },
  });

  if (!existingToken || existingToken.expires < new Date()) {
    return { error: "Token expired or invalid!" };
  }

  const { passwordHashed } = await hashPassword(newPass);

  await prisma.user.update({
    where: { email: existingToken.identifier },
    data: { password: passwordHashed },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return { success: "Password updated successfully!" };
};
