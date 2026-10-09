export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Главная", href: "/" },
  { label: "Об отряде", href: "/#about" },
  { label: "Новости", href: "/#news" },
  { label: "Состав", href: "/#squad" },
  { label: "Блог", href: "/blog" },
  { label: "Набор", href: "/#recruit" },
  { label: "Контакты", href: "/#contacts" },
];

export type Social = { label: string; href: string; icon: "vk" | "telegram" };

export const socials: Social[] = [
  { label: "ВКонтакте", href: "https://vk.ru/sop_azart", icon: "vk" },
  { label: "Telegram", href: "https://t.me/sop_azart", icon: "telegram" },
];

export const contacts = {
  city: "г. Новосибирск",
  email: "sopazart@gmail.com",
  commander: { name: "командос", phone: "+7 (900) 677-67-69", tel: "+79006776769" },
};

export type MemberCategory = "command" | "veterans" | "fighters" | "candidates";

export const memberFilters: { value: MemberCategory | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "command", label: "Командный состав" },
  { value: "veterans", label: "Ветераны" },
  { value: "fighters", label: "Бойцы" },
  { value: "candidates", label: "Кандидаты" },
];

export type Member = {
  /**
   * Уникальный id бойца: адрес страницы /members/<slug> и имя файла фото
   * public/images/members/<slug>.jpg. Задан явно, а не по индексу, чтобы при
   * перестановке бойцов в списке фото не «переезжали» к другим людям.
   * Новому бойцу — следующий свободный номер.
   */
  slug: string;
  name: string;
  role: string;
  category: MemberCategory;
  since: number;
  quote: string;
};

export const members: Member[] = [
  { slug: "member-1", name: "Оксана Шерстянкина", role: "Командир", category: "command", since: 2024, quote: "Отряд — это круто!" },
  { slug: "member-2", name: "Анастасия Ставицкая", role: "Комиссар", category: "command", since: 2024, quote: "Главное — чтобы горели глаза." },
  { slug: "member-3", name: "Артур Гибадуллин", role: "Инженер", category: "command", since: 2026, quote: "Сначала техника безопасности." },
  { slug: "member-4", name: "Анастасия Брюханова", role: "Медик", category: "fighters", since: 2024, quote: "Медик." },
  { slug: "member-5", name: "Роман Винокуров", role: "Глава пресс-центра, 1 целина", category: "fighters", since: 2024, quote: "Гори, но не перегорай!" },
  { slug: "member-6", name: "Елена Муракаева", role: "Боец, 1 целина", category: "fighters", since: 2025, quote: "Лучшее лето в жизни." },
  { slug: "member-7", name: "Мария Коршунова", role: "Боец, 1 целина", category: "fighters", since: 2025, quote: "Мозоли проходят, друзья остаются." },
  { slug: "member-8", name: "Арсалан Нинтаев", role: "Боец, 1 целина", category: "fighters", since: 2025, quote: "Актёр, артист, и бездарь." },
  { slug: "member-9", name: "Никита Макалин", role: "Экс-командир, 1 целина", category: "fighters", since: 2024, quote: "Легенда." },
  { slug: "member-10", name: "Михаил Луценко", role: "Боец, 1 целина", category: "fighters", since: 2026, quote: "Пришел за друзьями, остался за делом." },
];

export function getMember(slug: string) {
  return members.find((m) => m.slug === slug);
}
