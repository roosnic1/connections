import { test as setup, expect } from "@playwright/test";
import { mkdirSync } from "fs";
import { TEST_EMAIL, TEST_PASSWORD } from "./constants";

const authFile = "e2e/.auth/admin.json";

setup("authenticate as admin", async ({ request }) => {
  mkdirSync("e2e/.auth", { recursive: true });

  const response = await request.post("/api/auth/sign-in/email", {
    data: {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    },
  });

  expect(response.ok()).toBeTruthy();

  await request.storageState({ path: authFile });
  console.log("[auth.setup] Auth state saved to", authFile);
});
