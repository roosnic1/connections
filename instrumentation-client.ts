import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/relay-by9l",
  ui_host: "https://eu.posthog.com",
  defaults: "2025-05-24",
});
