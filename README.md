🚂 СОП «АЗАРТ» — Официальный веб-сайт
Официальный сайт студенческого отряда проводников «АЗАРТ».

Проект разработан для презентации отряда, публикации свежих новостей, знакомства с командным составом и привлечения новых кандидатов в грядущие трудовые сезоны.

Сделано с любовью для бойцов, кандидатов и ветеранов азарта!!!

«Новые друзья, множество знакомств, бесконечные возможности. Работаем, путешествуем и растём вместе!» 💙

---

## Запуск и настройка

Нужен Node.js 20.19+ (лучше 22 или 24).

```bash
cp .env.example .env      # заполнить AUTH_SECRET и VK_SERVICE_TOKEN
npm ci                    # заодно генерирует клиент Prisma
npm run db:migrate        # создаёт базу data/azart.db и таблицы
npm run dev               # http://localhost:3000
```

### Переменные окружения (`.env`)

| Переменная | Что это |
| --- | --- |
| `DATABASE_URL` | файл SQLite, по умолчанию `file:./data/azart.db` |
| `AUTH_SECRET` | ключ подписи сессий: `npx auth secret` или `openssl rand -base64 32`. На сервере — свой |
| `VK_SERVICE_TOKEN` | сервисный ключ приложения VK (кабинет разработчика VK → приложение → «Сервисный ключ доступа»). Только на сервере, в браузер не попадает. Группа должна быть открытой |
| `VK_GROUP_DOMAIN` | короткое имя группы из адреса `vk.com/<имя>` |

Без `VK_SERVICE_TOKEN` сайт работает, а в блоке новостей — ссылка на группу ВКонтакте.

### Аккаунты бойцов

Регистрации нет — аккаунты создаёт админ на сервере:

```bash
npm run user -- create --login ivanov --member member-5          # имя и цитата из карточки бойца
npm run user -- create --login guest1 --name "Иван Иванов"       # без привязки к карточке
npm run user -- password --login ivanov                          # новый пароль
npm run user -- member --login ivanov --member member-5          # привязать к карточке (none — отвязать)
npm run user -- list
npm run user -- delete --login ivanov
```

Пароль скрипт придумывает сам и показывает один раз. Боец входит на `/login` и попадает в `/profile`:
там он меняет цитату и отмечает кирпичики за целины на воротнике бойцовки. Если аккаунт привязан к карточке (`--member`),
цитата и кирпичики видны на `/members/<slug>`. Шевроны на рукавах рисуются у всех — `components/jacket/Jacket.tsx`.
После 5 неверных паролей подряд логин блокируется на 15 минут.

### Блог

Статьи — в `lib/blog.ts` (текст в Markdown, инструкция в начале файла), обложки — `public/images/blog/<slug>.jpg`.

### Деплой на VPS (PM2 + nginx)

Первый раз: `.env` → `npm ci` → `npm run db:migrate` → `npm run build` → `pm2 start ecosystem.config.js`.

Обновление:

```bash
git pull && npm ci && npm run db:migrate && npm run build && pm2 reload ecosystem.config.js
```

База — один файл `data/azart.db`, его стоит бэкапить (например, `sqlite3 data/azart.db ".backup backup.db"` по cron).
Счётчики неудачных входов хранятся в памяти, поэтому в `ecosystem.config.js` должен остаться один процесс (`instances: 1`).
