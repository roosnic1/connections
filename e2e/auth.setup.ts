import { test as setup, expect } from "@playwright/test";
import { mkdirSync } from "fs";

const authFile = "e2e/.auth/admin.json";

setup("authenticate as admin", async ({ request }) => {
  mkdirSync("e2e/.auth", { recursive: true });

  const response = await request.post("/api/auth/sign-in/email", {
    data: {
      email: "chappell.roan@pinkponyclub.com",
      password: "pinkdolphinclub",
    },
  });

  expect(response.ok()).toBeTruthy();

  await request.storageState({ path: authFile });
  console.log("[auth.setup] Auth state saved to", authFile);
});
