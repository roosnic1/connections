import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {getLocale} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import { FlagProvider } from "@unleash/nextjs/client";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connections",
  description: "Group four groups of four!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang="en">
      <NextIntlClientProvider>
        <FlagProvider>
          <body className={inter.className}>{children}</body>
        </FlagProvider>
      </NextIntlClientProvider>
    </html>
  );
}
