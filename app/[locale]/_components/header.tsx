"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { GameContext } from "@/app/[locale]/_components/game-context";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const gameContext = useContext(GameContext);
  const t = useTranslations();

  const publishDate = gameContext?.publishDate ?? DateTime.now();
  const dateFormatted = publishDate
    .setLocale("de-CH")
    .toLocaleString(DateTime.DATE_SHORT);
  const title = t("HomePage_title", { day: dateFormatted });

  return (
    <header className="bg-white border-b border-[#e5e7eb]">
      <div className="flex items-center justify-between px-4 md:px-[42.5px] h-[65px]">
        <p className="font-bold text-lg md:text-2xl text-black">{title}</p>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className="text-[#364153] font-medium text-base hover:opacity-70 transition-opacity"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-[#364153] font-medium text-base hover:opacity-70 transition-opacity"
          >
            About
          </Link>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="4"
              y1="6"
              x2="20"
              y2="6"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="12"
              x2="20"
              y2="12"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="18"
              x2="20"
              y2="18"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[#e5e7eb] px-4">
          <Link
            href="/"
            className="block py-4 text-[#364153] font-medium text-base border-b border-[#e5e7eb]"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-4 text-[#364153] font-medium text-base"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
