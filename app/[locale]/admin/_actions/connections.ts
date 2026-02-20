"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ConnectionState, Difficulty } from "@/prisma/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/prisma/generated/prisma/internal/prismaNamespace";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

const DIFFICULTIES = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
  Difficulty.EXPERT,
] as const;

export type ConnectionActionState = {
  error?: string;
};

type ParsedCategory = { level: Difficulty; title: string; words: string[] };

function parseCategories(formData: FormData): ParsedCategory[] {
  return DIFFICULTIES.map((level) => {
    const title = (formData.get(`category_${level}_title`) as string)?.trim();
    const words = [0, 1, 2, 3].map(
      (i) =>
        (formData.get(`category_${level}_word_${i}`) as string)?.trim() ?? "",
    );
    return { level, title, words };
  });
}

function validateAndParseDate(
  publishDate: string,
): { date: Date | null } | { error: string } {
  if (!publishDate) return { date: null };
  const parsed = new Date(publishDate);
  if (isNaN(parsed.getTime())) return { error: "Invalid publish date format." };
  return { date: parsed };
}

function validateFormData(
  categories: ParsedCategory[],
): ConnectionActionState | null {
  for (const cat of categories) {
    if (!cat.title) {
      return { error: `Title is required for ${cat.level} category.` };
    }
    if (cat.words.some((w) => !w)) {
      return { error: `All 4 words are required for ${cat.level} category.` };
    }
  }
  return null;
}

export async function createConnection(
  _prevState: ConnectionActionState,
  formData: FormData,
): Promise<ConnectionActionState> {
  await requireAuth();

  const publishDate = formData.get("publishDate") as string;
  const parsedDate = validateAndParseDate(publishDate);
  if ("error" in parsedDate) return parsedDate;
  const categories = parseCategories(formData);
  const validationError = validateFormData(categories);
  if (validationError) return validationError;

  try {
    await prisma.connection.create({
      data: {
        publishDate: parsedDate.date,
        categories: {
          create: categories.map((cat) => ({
            title: cat.title,
            words: cat.words,
            level: cat.level,
          })),
        },
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "A connection with this publish date already exists." };
    }
    throw e;
  }

  revalidatePath("/admin/connections");
  redirect("/admin/connections");
}

export async function updateConnection(
  connectionId: number,
  _prevState: ConnectionActionState,
  formData: FormData,
): Promise<ConnectionActionState> {
  await requireAuth();

  const publishDate = formData.get("publishDate") as string;
  const parsedDate = validateAndParseDate(publishDate);
  if ("error" in parsedDate) return parsedDate;
  const categories = parseCategories(formData);
  const validationError = validateFormData(categories);
  if (validationError) return validationError;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.connection.update({
        where: { id: connectionId },
        data: { publishDate: parsedDate.date },
      });

      for (const cat of categories) {
        await tx.category.upsert({
          where: {
            connectionId_level: {
              connectionId,
              level: cat.level,
            },
          },
          update: {
            title: cat.title,
            words: cat.words,
          },
          create: {
            connectionId,
            title: cat.title,
            words: cat.words,
            level: cat.level,
          },
        });
      }
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "A connection with this publish date already exists." };
    }
    throw e;
  }

  revalidatePath("/admin/connections");
  redirect("/admin/connections");
}

export async function deleteConnection(
  connectionId: number,
): Promise<ConnectionActionState> {
  await requireAuth();

  try {
    await prisma.connection.delete({
      where: { id: connectionId },
    });
  } catch (e) {
    unstable_rethrow(e);
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
      return { error: "Connection not found." };
    }
    throw e;
  }

  revalidatePath("/admin/connections");
  redirect("/admin/connections");
}

export async function getConnections(
  page: number = 1,
  pageSize: number = 10,
  state?: ConnectionState,
) {
  await requireAuth();

  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));

  const where = state ? { state } : {};
  const [connections, total] = await Promise.all([
    prisma.connection.findMany({
      where,
      include: {
        categories: { orderBy: { level: "asc" } },
        _count: { select: { reviews: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    prisma.connection.count({ where }),
  ]);

  return {
    connections,
    total,
    totalPages: Math.ceil(total / safePageSize),
    page: safePage,
  };
}

export async function updateConnectionState(
  connectionId: number,
  newState: ConnectionState,
  publishDate?: string,
): Promise<ConnectionActionState> {
  await requireAuth();

  const updateData: {
    state: ConnectionState;
    publishedAt?: Date;
    publishDate?: Date;
  } = { state: newState };

  if (newState === ConnectionState.PUBLISHED) {
    updateData.publishedAt = new Date();
    if (publishDate) {
      updateData.publishDate = new Date(publishDate);
    }
  }

  try {
    await prisma.connection.update({
      where: { id: connectionId },
      data: updateData,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "A connection with this publish date already exists." };
    }
    throw e;
  }

  revalidatePath("/admin/connections");
  return {};
}

export async function getConnection(id: number) {
  await requireAuth();

  return prisma.connection.findUnique({
    where: { id },
    include: { categories: { orderBy: { level: "asc" } } },
  });
}
