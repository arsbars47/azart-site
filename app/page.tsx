import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import LatestNews from "@/components/sections/LatestNews";
import Squad from "@/components/sections/Squad";
import Partners from "@/components/sections/Partners";
import Recruitment from "@/components/sections/Recruitment";
import { members } from "@/lib/data";
import { photoSrc } from "@/lib/photos";

// Страница статическая и пересобирается в фоне раз в 15 минут — ради ленты ВК (lib/vk.ts).
// Задано и здесь, чтобы страница обновлялась, даже если при сборке ВК не ответил или ключа ещё не было
export const revalidate = 900;

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <LatestNews />
      <Squad members={members.map((m) => ({ ...m, photo: photoSrc("members", m.slug) }))} />
      <Partners />
      <Recruitment />
    </>
  );
}
