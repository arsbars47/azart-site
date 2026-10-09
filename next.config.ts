import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      // фото бойцов и новостей: lib/photos.ts добавляет ?v=<время изменения файла>,
      // чтобы заменённое фото с тем же именем не застревало в кэше
      { pathname: "/images/**" },
      // статические импорты (логотип в меню)
      { pathname: "/_next/static/media/**", search: "" },
    ],
  },
};

export default nextConfig;
