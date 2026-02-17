"use client"; // Error boundaries must be Client Components

import posthog from "posthog-js";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-semibold text-black">
        Something went wrong!
      </h2>
      <button
        className="px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition-colors"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
