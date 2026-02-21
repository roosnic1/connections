import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";

// This route is only active in E2E test mode.
// It creates a real session for a test admin user, bypassing Keycloak.
// It is completely inert in production (E2E_TEST_MODE is never set there).

const TEST_USER_ID = "e2e-test-admin-user";
const TEST_USER_EMAIL = "e2e-admin@test.local";
const TEST_USER_NAME = "E2E Test Admin";

export async function POST(req: NextRequest) {
  if (process.env.E2E_TEST_MODE !== "true") {
    return new NextResponse(null, { status: 404 });
  }

  const e2eAuthSecret = process.env.E2E_AUTH_SECRET;
  if (!e2eAuthSecret) {
    return new NextResponse("E2E_AUTH_SECRET not configured", { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    (body as Record<string, unknown>).secret !== e2eAuthSecret
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Create or update the test admin user
    await prisma.user.upsert({
      where: { id: TEST_USER_ID },
      update: { updatedAt: new Date() },
      create: {
        id: TEST_USER_ID,
        email: TEST_USER_EMAIL,
        name: TEST_USER_NAME,
        emailVerified: true,
      },
    });

    // Delete any existing sessions for this test user to keep things clean
    await prisma.session.deleteMany({ where: { userId: TEST_USER_ID } });

    // Create a new session
    const sessionToken = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        id: randomUUID(),
        userId: TEST_USER_ID,
        token: sessionToken,
        expiresAt,
      },
    });

    const response = new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // Set the session cookie that Better Auth reads
    response.cookies.set("better-auth.session_token", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("[test-auth] Failed to create test session:", error);
    return new NextResponse("Failed to create test session", { status: 500 });
  }
}
