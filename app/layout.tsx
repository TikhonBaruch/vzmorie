import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vzmorie-five.vercel.app"),
  title: "Взморье — рыболовно-охотничья база",
  description: "Премиальная база-гибрид на Кулагинском банке Каспийского моря. Трофейная рыбалка, ныряние с гарпуном, комфортное размещение.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Взморье — рыболовно-охотничья база",
    description: "Премиальная база-гибрид на Кулагинском банке Каспийского моря",
    siteName: "Взморье",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Взморье — рыболовно-охотничья база",
    description: "Премиальная база-гибрид на Кулагинском банке Каспийского моря",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <div className="min-h-dvh bg-tactical-radial">
            <div className="min-h-dvh">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

