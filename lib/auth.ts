import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth, keycloak } from "better-auth/plugins";
import prisma from "@/lib/prisma";

const keycloakIssuer = process.env.AUTH_KEYCLOAK_ISSUER;
if (!keycloakIssuer) {
  throw new Error("AUTH_KEYCLOAK_ISSUER environment variable is required");
}

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
          issuer: keycloakIssuer,
          scopes: ["openid", "email", "profile"],
        }),
      ],
    }),
  ],
});
