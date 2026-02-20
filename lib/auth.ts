import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth, keycloak } from "better-auth/plugins";
import prisma from "@/lib/prisma";

const keycloakIssuer = process.env.AUTH_KEYCLOAK_ISSUER;
if (!keycloakIssuer) {
  throw new Error("AUTH_KEYCLOAK_ISSUER environment variable is required");
}

const keycloakId = process.env.AUTH_KEYCLOAK_ID;
if (!keycloakId) {
  throw new Error("AUTH_KEYCLOAK_ID environment variable is required");
}

const keycloakSecret = process.env.AUTH_KEYCLOAK_SECRET;
if (!keycloakSecret) {
  throw new Error("AUTH_KEYCLOAK_SECRET environment variable is required");
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
          clientId: keycloakId,
          clientSecret: keycloakSecret,
          issuer: keycloakIssuer,
          scopes: ["openid", "email", "profile"],
        }),
      ],
    }),
  ],
});
