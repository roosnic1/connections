import NextAuth from "next-auth";
import KeycloakProvider from "@auth/core/providers/keycloak";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Adapter } from "@auth/core/adapters";

const prismaAdapter = PrismaAdapter(prisma);

const MyAdapter: Adapter = {
  ...prismaAdapter,
  linkAccount: (account) => {
    if (!prismaAdapter.linkAccount)
      throw new Error("prismaAdapter.linkAccount is undefined");
    const {
      userId,
      access_token,
      refresh_token,
      token_type,
      id_token,
      session_state,
      scope,
      expires_at,
      provider,
      type,
      providerAccountId,
    } = account;
    return prismaAdapter.linkAccount({
      userId,
      access_token,
      expires_at,
      refresh_token,
      token_type,
      id_token,
      session_state,
      scope,
      provider,
      type,
      providerAccountId,
    });
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: false,
  adapter: MyAdapter,
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      account(token) {
        const {
          access_token,
          expires_in,
          refresh_token,
          token_type,
          id_token,
          session_state,
          scope,
          expires_at,
          provider,
          type,
          providerAccountId,
        } = token;
        return {
          access_token,
          expires_in,
          refresh_token,
          token_type,
          id_token,
          session_state,
          scope,
          expires_at,
          provider,
          type,
          providerAccountId,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      return (
        user.email === "nicolas.k.roos@protonmail.com" ||
        user.email === "maria.kraehenbuehl@protonmail.com" ||
        user.email === "nicolas.k.roos+testuser@protonmail.com"
      );
    },
  },
});
