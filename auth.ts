import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

export const { handlers, auth, signOut, signIn, unstable_update } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.NEXT_PUBLIC_SECRET,
  session: { strategy: "jwt" },
  ...authConfig,
});
