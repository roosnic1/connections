import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Bounce, ToastContainer } from "react-toastify";
import { GameContextProvider } from "@/app/[locale]/_components/game-context";
import { ReactNode } from "react";
import Footer from "@/app/[locale]/_components/footer";
import Header from "@/app/[locale]/_components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connections",
  description: "Group four groups of four!",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <GameContextProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer locale={locale} />
          </GameContextProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            closeButton={false}
            theme="light"
            transition={Bounce}
          />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
