//types\next-auth.d.ts
import "next-auth";
import { Role } from "@/app/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: Role;
      name?: string;
      email?: string;
      image?: string | null;
      emailVerified?: string | number | object;
    };
  }

  interface User {
    id?: string;
    role?: Role;
    name?: string | null;
    email?: string | null;
    password?: string | null;
    image?: string | null;
    emailVerified?: DateTime;
    createdAt?: DateTime;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
