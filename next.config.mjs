import createNextIntlPlugin from "next-intl/plugin";
import { withPostHogConfig } from "@posthog/nextjs-config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.devtool = "source-map"; // enable for production build
    }
    return config;
  },
  productionBrowserSourceMaps: true, // 👈 this is key!
  async rewrites() {
    return [
      {
        source: "/:locale*/relay-by9l/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
        locale: false,
      },
      {
        source: "/:locale*/relay-by9l/:path*",
        destination: "https://eu.i.posthog.com/:path*",
        locale: false,
      },
      {
        source: "/:locale*/relay-by9l/flags",
        destination: "https://eu.i.posthog.com/flags",
        locale: false,
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

const withNextIntl = createNextIntlPlugin();

export default withPostHogConfig(withNextIntl(nextConfig), {
  personalApiKey: process.env.POSTHOG_API_KEY, // Personal API Key
  envId: process.env.POSTHOG_ENV_ID, // Environment ID
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST, // (optional), defaults to https://us.posthog.com
  sourcemaps: {
    // (optional)
    enabled: false, // (optional) Enable sourcemaps generation and upload, default to true on production builds
    project: "connections", // (optional) Project name, defaults to repository name
    version: "1.0.0", // (optional) Release version, defaults to current git commit
    deleteAfterUpload: true, // (optional) Delete sourcemaps after upload, defaults to true
  },
});
