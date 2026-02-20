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

const VALID_SORT_FIELDS: ReviewSortField[] = [
  "createdAt",
  "difficulty",
  "reviewerName",
];

export async function getReviews(
  page: number = 1,
  pageSize: number = 20,
  sortBy: ReviewSortField = "createdAt",
  sortDir: SortDir = "desc",
) {
  await requireAuth();

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 20;
  const safeSortBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const safeSortDir: SortDir = sortDir === "asc" ? "asc" : "desc";

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {},
      include: {
        connection: { select: { id: true, publishDate: true } },
      },
      orderBy: { [safeSortBy]: safeSortDir },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    prisma.review.count({ where: {} }),
  ]);

  return {
    reviews,
    total,
    totalPages: Math.ceil(total / safePageSize),
    page: safePage,
  };
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
