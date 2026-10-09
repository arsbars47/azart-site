import "server-only";

/**
 * Посты со стены группы ВКонтакте (метод wall.get).
 * Запрос идёт только с сервера Next.js: ключ VK_SERVICE_TOKEN не попадает в браузер.
 * Ответ кэшируется на 15 минут (fetch + next.revalidate): главная страница
 * пересобирается в фоне не чаще раза в 15 минут, так что ВК получает
 * около сотни запросов в сутки при любой посещаемости.
 */

const API_URL = "https://api.vk.ru/method/wall.get";
const API_VERSION = "5.199";
/** секунд — как часто обновлять ленту */
const REVALIDATE = 900;

export type VkPost = {
  id: string;
  url: string;
  /** дата для подписи, например «12 сентября 2026» */
  date: string;
  title: string;
  excerpt: string;
  /** картинка поста с CDN ВК или null */
  photo: string | null;
};

type VkImage = { url?: string; width: number; height: number };

type VkAttachment = {
  type: string;
  photo?: { sizes?: VkImage[] };
  video?: { image?: VkImage[] };
  link?: { photo?: { sizes?: VkImage[] } };
};

type VkWallItem = {
  id: number;
  owner_id: number;
  date: number;
  text?: string;
  is_pinned?: number;
  marked_as_ads?: number;
  attachments?: VkAttachment[];
  copy_history?: VkWallItem[];
};

type VkResponse = {
  response?: { items: VkWallItem[] };
  error?: { error_code: number; error_msg: string };
};

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Novosibirsk",
});

/**
 * Последние посты группы. null — лента недоступна (нет ключа, ошибка ВК или сети):
 * тогда блок новостей показывает ссылку на группу вместо карточек.
 */
export async function getVkPosts(limit = 10): Promise<VkPost[] | null> {
  const token = process.env.VK_SERVICE_TOKEN;
  const domain = process.env.VK_GROUP_DOMAIN || "sop_azart";
  if (!token) {
    console.warn("VK_SERVICE_TOKEN не задан — новости из ВК не загружаются");
    return null;
  }

  const params = new URLSearchParams({
    domain,
    count: String(limit + 2), // запас на закреплённый пост и рекламу, которые отбрасываем
    filter: "owner", // только записи от имени группы
    v: API_VERSION,
    access_token: token,
  });

  try {
    const res = await fetch(`${API_URL}?${params}`, {
      next: { revalidate: REVALIDATE, tags: ["vk-news"] },
      signal: AbortSignal.timeout(8000),
    });
    // ВК отвечает 200 и на ошибки — тогда в теле поле error (такой ответ тоже кэшируется на 15 минут)
    const data = (await res.json()) as VkResponse;
    if (data.error || !data.response) {
      console.error(`VK API wall.get: ${data.error?.error_code} ${data.error?.error_msg ?? `HTTP ${res.status}`}`);
      return null;
    }

    return data.response.items
      .filter((item) => !item.is_pinned && !item.marked_as_ads) // закреп обычно старый — в ленте «последних» он лишний
      .map(toPost)
      .filter((post): post is VkPost => post !== null)
      .slice(0, limit);
  } catch (error) {
    console.error("Не удалось загрузить новости из ВК:", error);
    return null;
  }
}

function toPost(item: VkWallItem): VkPost | null {
  // репост без своего текста — показываем исходную запись
  const source = !item.text?.trim() && item.copy_history?.[0] ? item.copy_history[0] : item;
  const [first = "", ...rest] = cleanText(source.text ?? "");
  const photo = pickImage(source.attachments) ?? pickImage(item.attachments);
  if (!first && !photo) return null;

  // заголовок — первое предложение первого абзаца (если оно короткое), остальное — в описание
  const sentence = first.match(/^.+?[.!?…](?=\s|$)/)?.[0] ?? first;
  const title = sentence.length <= 90 ? sentence : truncate(first, 90);
  const remainder = title === sentence ? first.slice(sentence.length).trim() : "";

  return {
    id: `${item.owner_id}_${item.id}`,
    url: `https://vk.com/wall${item.owner_id}_${item.id}`,
    date: dateFormat.format(new Date(item.date * 1000)).replace(/\s*г\.$/, ""),
    title: title || "Фото из жизни отряда",
    excerpt: truncate([remainder, ...rest].filter(Boolean).join(" "), 180),
    photo,
  };
}

/** Убирает разметку ВК: [club1|Текст] → Текст, хэштеги; возвращает непустые строки */
function cleanText(text: string): string[] {
  return text
    .replace(/\[(?:id|club|public)\d+\|([^\]]+)\]/g, "$1")
    .replace(/#[\p{L}\p{N}_]+(?:@[\w.]+)?/gu, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : max).replace(/[\s,.;:—-]+$/, "")}…`;
}

/** Картинка поста: фото, обложка видео или ссылки — самый маленький вариант не уже 600px */
function pickImage(attachments: VkAttachment[] = []): string | null {
  for (const a of attachments) {
    const sizes = a.photo?.sizes ?? a.video?.image ?? a.link?.photo?.sizes;
    const withUrl = sizes?.filter((s): s is VkImage & { url: string } => Boolean(s.url));
    if (!withUrl?.length) continue;
    const sorted = [...withUrl].sort((x, y) => x.width - y.width);
    return (sorted.find((s) => s.width >= 600) ?? sorted[sorted.length - 1]).url;
  }
  return null;
}
