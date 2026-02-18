"use client";

import { useRouter } from "next/navigation";
import { ALL_LANGUAGES } from "@/i18n/config";

const LANGUAGE_LABELS: Record<string, string> = {
  de: "Deutsch",
  en: "English",
};

export default function Footer({ locale }: { locale: string }) {
  const router = useRouter();

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value;
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <footer className="flex items-center justify-between px-6 py-3 text-sm text-gray-500">
      <span>&copy; {new Date().getFullYear()} Connections</span>
      <select
        value={locale}
        onChange={handleLanguageChange}
        className="bg-transparent text-sm text-gray-500 cursor-pointer outline-none"
      >
        {ALL_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_LABELS[lang] ?? lang}
          </option>
        ))}
      </select>
    </footer>
  );
}
