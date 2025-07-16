// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/lib/prisma";

if (!process.env.AUTH0_CLIENT_ID) throw new Error("AUTH0_CLIENT_ID is not set");
if (!process.env.AUTH0_CLIENT_SECRET)
  throw new Error("AUTH0_CLIENT_SECRET is not set");
if (!process.env.AUTH0_ISSUER) throw new Error("AUTH0_ISSUER is not set");
if (!process.env.GOOGLE_CLIENT_ID)
  throw new Error("GOOGLE_CLIENT_ID is not set");
if (!process.env.GOOGLE_CLIENT_SECRET)
  throw new Error("GOOGLE_CLIENT_SECRET is not set");

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      return (
        user.email === "nicolas.k.roos@gmail.com" ||
        user.email === "maria.kraehenbuehl@gmail.com"
      );
    },
  },
  /*pages: {
    //signIn: "/auth/signin",
  },*/
};
// @ts-ignore
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
