//auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { ZodError } from "zod";
import { signinSchema } from "./lib/zod";
import { getDbUser } from "./app/actions/auth";
import type { NextAuthConfig } from "next-auth";
import { Role } from "./app/generated/prisma/enums";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          let user = null;

          const { email, password } =
            await signinSchema.parseAsync(credentials);

          user = await getDbUser(email, password);

          if (!user)
            throw new Error(
              "Please sign in with Google to access your account.",
            );

          return {
            id: user?.id,
            name: user?.name,
            email: user.email,
            image: user?.image,
            role: user.role,
            emailVerified: user?.emailVerified,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email_verified) {
          return false;
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "USER";
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
