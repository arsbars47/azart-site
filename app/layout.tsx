import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Starfield from "@/components/layout/Starfield";
import "./globals.css";

// Основной шрифт: весь текст — абзацы, меню, карточки, новости, формы (font-sans).
// next/font скачивает его при сборке и раздаёт с нашего домена — к Google браузер не ходит
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

// Декоративный шрифт: только главные заголовки h1/h2 и акценты-логотипы (font-display)
const eugusto = localFont({
  src: "./fonts/Eugusto_Cyr.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-eugusto",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// Рукописный акцентный шрифт: подписи, даты, кнопки (font-accent)
const uraBumBum = localFont({
  src: "./fonts/UraBumBumSP.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-ura-bum-bum",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "СОП «Азарт» — студенческий отряд проводников",
  description: "Сайт студенческого отряда «Азарт»: новости, состав и набор на сезон 2027.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} ${eugusto.variable} ${uraBumBum.variable}`}>
      <body>
        <Starfield />
        <Sidebar />
        <div className="flex min-h-svh flex-col lg:pl-sidebar">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
