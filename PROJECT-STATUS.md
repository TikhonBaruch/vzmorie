# ВЗМОРИЕ — Отчёт о состоянии проекта

> Дата: 04.07.2026
> Коммит: `b4c43af`
> Деплой: https://vzmorie-five.vercel.app

---

## 1. Общая информация

| Параметр | Значение |
|---|---|
| Название | Взморье — рыболовно-охотничья база |
| Стек | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Бэкенд | tRPC + Prisma ORM |
| БД | PostgreSQL (sweb.ru, pg4.sweb.ru:5433/newlsu) |
| Деплой | Vercel (vzmorie-five.vercel.app) |
| Авторизация | NextAuth.js (Credentials: email/password) |
| Репозиторий | github.com/TikhonBaruch/vzmorie |

---

## 2. Структура проекта

```
vzmorie/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Сайдбар + навигация + logout
│   │   ├── login/page.tsx      # Страница входа
│   │   ├── page.tsx            # Дашборд (статистика + модерация)
│   │   ├── posts/page.tsx      # Управление публикациями (CRUD)
│   │   └── products/page.tsx   # Управление товарами (CRUD)
│   ├── api/
│   │   ├── admin/
│   │   │   ├── posts/          # REST: CRUD публикаций
│   │   │   ├── products/       # REST: CRUD товаров
│   │   │   └── stats/          # REST: статистика дашборда
│   │   ├── auth/[...nextauth]/ # NextAuth (email/password)
│   │   ├── telegram/webhook/   # Telegram webhook (секрет + модерация)
│   │   ├── trpc/[trpc]/        # tRPC API
│   │   └── upload/presign/     # S3 presigned URL
│   ├── miniapp/page.tsx        # Telegram Mini App (заглушка)
│   ├── posts/
│   │   ├── page.tsx            # Лента публикаций
│   │   └── [slug]/page.tsx     # Детали публикации
│   ├── layout.tsx              # Root layout (Providers)
│   ├── page.tsx                # Главная (лендинг)
│   └── globals.css
├── prisma/
│   ├── schema.prisma           # 9 моделей + 5 enum
│   └── seed.ts                 # Тестовые данные
├── src/
│   ├── components/
│   │   ├── Providers.tsx       # SessionProvider + tRPC + QueryClient
│   │   └── telegram/
│   │       └── PostForm.tsx    # Форма создания поста (Mini App)
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config (Credentials)
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── s3.ts               # S3 upload utility
│   │   ├── telegram.ts         # Telegram API (send, notify, webhook)
│   │   └── trpc.ts             # tRPC client
│   ├── server/
│   │   ├── trpc.ts             # tRPC server + middleware (auth/admin)
│   │   └── routers/
│   │       ├── index.ts        # App router aggregator
│   │       ├── post.ts         # Post CRUD + moderation
│   │       ├── user.ts         # User queries
│   │       ├── tag.ts          # Tag CRUD
│   │       └── subscriber.ts   # Email subscription
│   └── types/
│       └── next-auth.d.ts      # Типы для NextAuth
├── middleware.ts                # Защита /admin + /api/admin
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── .env.example
```

---

## 3. Модели данных (Prisma)

| Модель | Назначение | Статус |
|---|---|---|
| User | Пользователи (admin,.telegram,web) | ✅ Готово |
| Post | Публикации (уловы, новости, события) | ✅ Готово |
| Tag | Теги для постов | ✅ Готово |
| Media | Медиафайлы к постам | ✅ Готово |
| Comment | Комментарии (вложенные) | ✅ Готово |
| Product | Товары магазина | ✅ Готово |
| Subscriber | Подписчики на рассылку | ✅ Готово |
| Account | NextAuth аккаунты | ✅ Готово |
| Session | NextAuth сессии | ✅ Готово |

### Enum'ы
- `UserRole`: USER, MODERATOR, ADMIN
- `PostType`: CATCH, WEATHER, WATER_LEVEL, EVENT, PROMO, NEWS
- `PostStatus`: DRAFT, PENDING, PUBLISHED, ARCHIVED
- `MediaType`: IMAGE, VIDEO, AUDIO, DOCUMENT

---

## 4. Что реализовано

### Фронтенд (лендинг)
- [x] Многостраничный лендинг с тактическим дизайном
- [x] Header sticky с навигацией и CTA
- [x] HeroBento — bento-сетка главного экрана
- [x] FeaturesSplit, TariffsBento, InfrastructureBento
- [x] LocationMap, FleetGuides, Gallery, Footer
- [x] Анимации (framer-motion)
- [x] Страницы постов (лента + детали)

### Админ-панель
- [x] Страница входа (`/admin/login`)
- [x] Middleware — защита `/admin/*` и `/api/admin/*`
- [x] Дашборд — статистика + очередь модерации
- [x] Управление публикациями — CRUD + фильтры + поиск
- [x] Управление товарами — CRUD + категории + витрина
- [x] Кнопки одобрения/отклонения постов

### API
- [x] REST API для админки (posts, products, stats)
- [x] tRPC для фронтенда (post, user, tag, subscriber)
- [x] NextAuth Credentials (email/password)
- [x] Telegram webhook (секрет + модерация)
- [x] S3 upload presigned URL

### Интеграции
- [x] Telegram Bot — токен, webhook, уведомления
- [x] PostgreSQL — подключение к sweb.ru
- [x] NextAuth — JWT сессии, role в token

---

## 5. Текущие проблемы

### Требуют внимания
- [ ] Сайт может быть недоступен из-за сети (Vercel заблокирован из РФ?)
- [ ] Seed данных не запущен (`npx prisma db seed`)
- [ ] Telegram webhook не установлен (нужно выполнить вручную из-за блокировки API Telegram)
- [ ] S3 ключи пустые — загрузка файлов не работает
- [ ] Resend API ключ пустой — email рассылки нет
- [ ] Mini App — заглушка, не реализован

### Известные ограничения
- Auth работает только на email/password из `.env` (нет регистрации)
- Нет role-based access в UI (все админы видят одно и то же)
- Товары не связаны с постами (нет интеграции "улов дня")
- Нет SEO-метаданных для страниц постов (generateMetadata)
- `middleware.ts` deprecated в Next.js 16 (нужен `proxy`)

---

## 6. Хронология разработки

| # | Коммит | Описание |
|---|---|---|
| 1 | `460300e` | Initial clean commit — лендинг |
| 2 | `bbbb320` — `c463190` | Фиксы сборки, деплой на Vercel |
| 3 | `dbc787f` | Полная структура: tRPC, Prisma, Auth, Admin, MiniApp |
| 4 | `839313a` | Рабочая админка с REST API (посты) |
| 5 | `7c8a6c3` | Фикс Next.js 16 params (Promise) |
| 6 | `5a2692a` | Авторизация — login page + middleware |
| 7 | `e94200d` | Управление товарами (CRUD) |
| 8 | `b4c43af` | Исправление критических проблем безопасности |

---

## 7. План развития (прослеживается по действиям)

### Фаза 1 — Ядро ✅
- [x] Лендинг
- [x] Бэкенд (tRPC + Prisma)
- [x] PostgreSQL
- [x] Админ-панель (CRUD постов и товаров)
- [x] Авторизация
- [x] Telegram webhook

### Фаза 2 — Контент (следующая)
- [ ] Запуск seed данных
- [ ] Заполнение сайта реальным контентом (фото, описания, тарифы)
- [ ] Telegram Mini App (отправка уловов из Telegram)
- [ ] Голосовые сообщения (Speech-to-Text)

### Фаза 3 — Интеграции
- [ ] S3-хранилище (Yandex Object Storage или AWS S3)
- [ ] Email-рассылки (Resend)
- [ ] Карта мест (Yandex Maps / 2GIS)
- [ ] Погодный API (OpenWeatherMap или Yandex Погода)

### Фаза 4 — Масштабирование
- [ ] Push-уведомления для Mini App
- [ ] Система рейтинга и лидерборд
- [ ] Интеграция с CRM
- [ ] Аналитика (Yandex.Metrika / GA4)

---

## 8. Среда и доступы

| Ресурс | Значение |
|---|---|
| Деплой | https://vzmorie-five.vercel.app |
| Админка | https://vzmorie-five.vercel.app/admin |
| Логин | admin@vzmorie.ru |
| Пароль | admin-password |
| PostgreSQL | pg4.sweb.ru:5433/newlsu |
| Telegram Bot Token | 8737282103:AAHatRmZTgFm9acVK_KGBTffiuP74MdPeAo |
| Telegram Channel | 301930940 |
| GitHub | github.com/TikhonBaruch/vzmorie |

---

## 9. Git история (полная)

```
b4c43af fix: critical security issues, auth, webhook, tailwind, dead code cleanup
e94200d feat: product management in admin panel with CRUD
5a2692a feat: admin auth with NextAuth - login page, middleware protection
7c8a6c3 fix: Next.js 16 params as Promise
839313a feat: working admin panel with REST API for posts management
dbc787f feat: add full project structure with admin, posts, tRPC, and auth
4175954 Trigger new build
0db79dc Trigger new build
a715439 Trigger new build
c463190 Add public directory for Vercel
292a26f Add public directory for Vercel
1b64bff Fix: ignore ts errors for deployment
bbbb320 fix: framer motion types
460300e Initial clean commit
```
