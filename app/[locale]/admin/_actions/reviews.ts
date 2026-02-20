"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export type ReviewSortField = "createdAt" | "difficulty" | "reviewerName";
export type SortDir = "asc" | "desc";

export async function getReviews(
  page: number = 1,
  pageSize: number = 20,
  sortBy: ReviewSortField = "createdAt",
  sortDir: SortDir = "desc",
) {
  await requireAuth();

  const where = {};

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        connection: { select: { id: true, publishDate: true } },
      },
      orderBy: { [sortBy]: sortDir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count({ where }),
  ]);

  return { reviews, total, totalPages: Math.ceil(total / pageSize), page };
}

export async function getConnectionReviews(connectionId: number) {
  await requireAuth();

  const [reviews, connection, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { connectionId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.connection.findUnique({
      where: { id: connectionId },
      include: { categories: { orderBy: { level: "asc" } } },
    }),
    prisma.review.aggregate({
      where: { connectionId },
      _count: { id: true },
      _avg: { difficulty: true },
    }),
  ]);

  return {
    reviews,
    connection,
    count: aggregate._count.id,
    avgDifficulty: aggregate._avg.difficulty,
  };
}

export async function getReview(id: number) {
  await requireAuth();

  return prisma.review.findUnique({
    where: { id },
    include: {
      connection: {
        include: { categories: { orderBy: { level: "asc" } } },
      },
    },
  });
}
