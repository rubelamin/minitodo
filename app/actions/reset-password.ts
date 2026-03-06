"use server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { success: "If an account exists, a reset link has been sent." };
  }

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  const token = uuidv4();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: token,
      expires: expires,
    },
  });

  try {
    await sendPasswordResetEmail(email, token);
    return { success: "Reset link sent to your email!" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to send email. Try again later." };
  }
};
