// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { UnleashClient } from "unleash-proxy-client";

Sentry.init({
  dsn: "https://d8a90d627d5b4752e46cadca7070ec52@o4509464836898816.ingest.de.sentry.io/4509464838013008",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.unleashIntegration({ featureFlagClientClass: UnleashClient }),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
