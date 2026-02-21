import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL!;
  const isAccelerate =
    url?.startsWith("prisma://") || url?.startsWith("prisma+postgres://");
  if (isAccelerate) {
    return new PrismaClient({ log: ["warn"], accelerateUrl: url });
  }
  return new PrismaClient({
    log: ["warn"],
    adapter: new PrismaPg({ connectionString: url }),
  });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
