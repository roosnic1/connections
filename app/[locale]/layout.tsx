import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TolgeeNextProvider } from "@/tolgee/client";
import { getTolgee } from "@/tolgee/server";
import { Bounce, ToastContainer } from "react-toastify";
import { GameContextProvider } from "@/app/[locale]/_components/game-context";
import { ReactNode } from "react";
import Footer from "@/app/[locale]/_components/footer";

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
  /*if (!ALL_LANGUAGES.includes(locale)) {
    notFound();
  }*/
  const tolgee = await getTolgee();
  const records = await tolgee.loadRequired();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <TolgeeNextProvider language={locale} staticData={records}>
          <GameContextProvider>{children}</GameContextProvider>
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
          <Footer locale={locale} />
          <Analytics />
          <SpeedInsights />
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
