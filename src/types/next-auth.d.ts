import { DefaultSession } from "next-auth";
import type { UserRole } from "./index";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userId: string;
      role: UserRole;
      language: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: UserRole | string;
    language?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    userId?: string;
    role?: UserRole | string;
    language?: string;
  }
}
