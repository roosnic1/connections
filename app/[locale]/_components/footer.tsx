"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ALL_LANGUAGES } from "@/i18n/config";

const LOCALE_LABELS: Record<string, { full: string; short: string }> = {
  de: { full: "Deutsch", short: "DE" },
  en: { full: "English", short: "EN" },
};

export default function Footer({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations();

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value;
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  const label = LOCALE_LABELS[locale] ?? {
    full: locale,
    short: locale.toUpperCase(),
  };

  return (
    <footer className="bg-white border-t border-[#e5e7eb] px-4 md:px-[42.5px] py-[17px]">
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#6a7282] font-normal leading-5">
          {t("footer_copyright", { year: new Date().getFullYear() })}
        </span>

        {/* Language switcher — native select hidden behind custom label */}
        <div className="relative flex items-center">
          <span className="text-[14px] font-medium text-[#364153] leading-5 pointer-events-none flex items-center gap-1">
            <span className="hidden md:inline">{label.full}</span>
            <span className="md:hidden">{label.short}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#364153"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <select
            value={locale}
            onChange={handleLanguageChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
            aria-label="Select language"
          >
            {ALL_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {LOCALE_LABELS[lang]?.full ?? lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  );
}
