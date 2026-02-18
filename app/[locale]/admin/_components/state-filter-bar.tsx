"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ConnectionState } from "@/app/[locale]/_types";

const FILTERS: { label: string; value: ConnectionState | undefined }[] = [
  { label: "admin_stateFilterAll", value: undefined },
  { label: "admin_stateDraft", value: ConnectionState.DRAFT },
  { label: "admin_stateReview", value: ConnectionState.REVIEW },
  { label: "admin_statePublished", value: ConnectionState.PUBLISHED },
];

export default function StateFilterBar({
  currentState,
}: {
  currentState?: ConnectionState;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const handleFilter = (state: ConnectionState | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (state) {
      params.set("state", state);
    } else {
      params.delete("state");
    }
    router.push(`/admin/connections?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 mb-4">
      {FILTERS.map(({ label, value }) => {
        const isActive = currentState === value;
        return (
          <button
            key={label}
            onClick={() => handleFilter(value)}
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              isActive
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-gray-500"
            }`}
          >
            {t(label as Parameters<typeof t>[0])}
          </button>
        );
      })}
    </div>
  );
}
