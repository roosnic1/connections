import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth, keycloak } from "better-auth/plugins";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: process.env.AUTH_KEYCLOAK_ID!,
          clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
          issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
          scopes: ["openid", "email", "profile"],
        }),
      ],
    }),
  ],
});
