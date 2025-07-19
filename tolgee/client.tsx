"use client";

import { useEffect } from "react";
import {
  CachePublicRecord,
  TolgeeProvider,
  TolgeeStaticData,
} from "@tolgee/react";
import { useRouter } from "next/navigation";
import { TolgeeBase } from "./shared";

type Props = {
  staticData: TolgeeStaticData | CachePublicRecord[];
  language: string;
  children: React.ReactNode;
};

const tolgee = TolgeeBase().init({
  staticData: {
    en: () => import("../messages/en.json"),
    de: () => import("../messages/de.json"),
  },
});

export const TolgeeNextProvider = ({
  language,
  staticData,
  children,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    const { unsubscribe } = tolgee.on("permanentChange", () => {
      router.refresh();
    });
    return () => unsubscribe();
  }, [tolgee, router]);

  return (
    <TolgeeProvider tolgee={tolgee} ssr={{ language, staticData }}>
      {children}
    </TolgeeProvider>
  );
};
