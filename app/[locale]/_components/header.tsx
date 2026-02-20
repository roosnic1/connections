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
  const dateFormatted = publishDate.toLocaleString(DateTime.DATE_FULL);
  const title = t("HomePage_title", { day: dateFormatted });

  const HamburgerIcon = () => (
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
  );

  const CloseIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="5"
        y1="5"
        x2="19"
        y2="19"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="19"
        y1="5"
        x2="5"
        y2="19"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <>
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
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <HamburgerIcon />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          {/* Overlay header bar */}
          <div className="flex items-center justify-between px-4 h-[65px] border-b border-[#e5e7eb] shrink-0">
            <p className="font-bold text-lg text-black">{title}</p>
            <button
              className="p-2 -mr-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-4 pt-4">
            <Link
              href="/"
              className="py-5 text-[#364153] font-medium text-xl border-b border-[#e5e7eb]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="py-5 text-[#364153] font-medium text-xl border-b border-[#e5e7eb]"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
