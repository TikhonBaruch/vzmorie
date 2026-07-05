# ВЗМОРИЕ — Отчёт о состоянии проекта

> Дата: 05.07.2026
> Коммит: `875406a` (fix: typo, grammar, sections, API)
> Деплой: https://vzmorie-five.vercel.app

---

## 1. Общая информация

| Параметр | Значение |
|---|---|
| Название | Взморье — рыболовно-охотничья база |
| Стек | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Бэкенд | tRPC + Prisma ORM + REST API |
| БД | PostgreSQL (sweb.ru, pg4.sweb.ru:5433/newlsu) |
| Деплой | Vercel (vzmorie-five.vercel.app) |
| Авторизация | NextAuth.js (Credentials: email/password) |
| Репозиторий | github.com/TikhonBaruch/vzmorie |

---

## 2. Аудит по CONTINUATION-BRIEF.md

### §1.1 Главная страница на реальных данных

| Задача | Статус | Детали |
|---|---|---|
| Seed данных | **ГОТОВО** | `npx prisma db seed` выполнен: 12 тегов, админ, 3 демо-поста |
| HeroBento → API | **ЧАСТИЧНО** | Live-статус тайл подключён к API, фон — picsum.photos (плейсхолдер) |
| Gallery → API | **ГОТОВО** | Тянет опубликованные посты из `/api/admin/posts` |
| TariffsBento → API | **НЕ ГОТОВО** | Тарифы захардкожены в статическом массиве (не из БД) |
| Реальные контакты | **ГОТОВО** | vzmorie@rambler.ru, +7 (909) 372-05-73 в Footer, DatesSection |
| Реальные координаты | **ГОТОВО** | 45.758469, 48.136073 в Footer, LocationMap, DatesSection |
| Реальные тарифы | **ГОТОВО** | Значения верные (7100/7400/9100), но захардкожены |
| Фото партнёров | **НЕ ГОТОВО** | HeroBento: picsum.photos, нет ссылок на domik.travel и т.д. |
| Смена пароля админки | **ГОТОВО** | Пароль обновлён в `.env` |

### §1.2 Постинг с воды

| Задача | Статус | Детали |
|---|---|---|
| Webhook → PENDING пост | **ГОТОВО** | `webhook/route.ts:131-168` — фото+текст → CATCH/PENDING |
| Модерация в /admin/posts | **ГОТОВО** | Кнопки одобрения/отклонения, фильтры, поиск |
| Утренняя сводка — авто-публикация | **ГОТОВО** | WEATHER посты создаются сразу PUBLISHED (route.ts:183) |
| Шаблон сводки (4 вопроса) | **ГОТОВО** | `telegram.ts:125-138` — погода/что клюёт/уровень воды/чистота воды |
| Блок «Условия сегодня» | **ГОТОВО** | `ConditionsBlock.tsx` парсит сводку, подключён к `/api/conditions` |
| Header с погодой/водой | **ГОТОВО** | `Header.tsx` тянет данные из `/api/conditions` в реальном времени |
| Mini App | **НЕ ГОТОВО** | Заглушка, не реализована |

### §2 Реестр задуманного (BACKLOG)

| Элемент | Статус | Детали |
|---|---|---|
| `#fleet` → FleetGuides | **ГОТОВО** | Лодки, эхолокация, егеря (2 персоны) |
| `#rest` → RestSection | **ГОТОВО** | 6 amenities + доп. информация (барбекю, парковка, Wi-Fi) |
| `#spearfishing` → SpearfishingSection | **ГОТОВО** | Прозрак, видимость, правила для подвохов |
| `#dates` → DatesSection | **ГОТОВО** | Календарь дат + бронирование через WhatsApp + FAQ |
| PDF-презентация | **НЕ ГОТОВО** | |
| Фильтр галереи по виду рыбы | **НЕ ГОТОВО** | Базовый фильтр по типу поста есть, по виду рыбы — нет |
| Раздел «Природа» (лотосы) | **НЕ ГОТОВО** | |

### §3 После демо-спринта (преждевременно сделано)

| Задача | Статус | Детали |
|---|---|---|
| S3-хранилище | **ЧАСТИЧНО** | `s3.ts` + presign endpoint есть, ключи пустые |
| middleware.ts для Next.js 16 | **НЕ СДЕЛАН** | Обычный `withAuth` |
| Ролевой доступ | **СДЕЛАН** | `adminProcedure` проверяет role, JWT хранит role |
| Погодный API | **НЕ СДЕЛАН** | Данные только из ручных сводок |
| Yandex Maps / 2GIS | **НЕ СДЕЛАН** | `LocationMap.tsx` — CSS-заглушка |
| Email-рассылки (Resend) | **СДЕЛАН** | Полный subscriber router, `RESEND_API_KEY` пустой |

---

## 3. Структура проекта

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
│   │   │   ├── stats/          # REST: статистика дашборда
│   │   │   └── conditions/     # REST: CRUD условий (погода/вода)
│   │   ├── auth/[...nextauth]/ # NextAuth (email/password)
│   │   ├── conditions/         # GET: последние опубликованные условия
│   │   ├── telegram/
│   │   │   ├── webhook/        # Telegram webhook (секрет + модерация)
│   │   │   ├── setup/          # Установка webhook через Vercel (США)
│   │   │   └── status/         # Статус webhook + пользователей
│   │   ├── trpc/[trpc]/        # tRPC API
│   │   └── upload/presign/     # S3 presigned URL
│   ├── miniapp/page.tsx        # Telegram Mini App (заглушка)
│   ├── posts/
│   │   ├── page.tsx            # Лента публикаций
│   │   └── [slug]/page.tsx     # Детали публикации
│   ├── layout.tsx              # Root layout (Providers)
│   ├── page.tsx                # Главная (лендинг)
│   └── globals.css
├── components/
│   ├── Header.tsx              # Sticky header с погодой/водой в реальном времени
│   ├── HeroBento.tsx           # Главный экран bento-сетка
│   ├── ConditionsBlock.tsx     # «Условия сегодня» — парсит сводку из БД
│   ├── FeaturesSplit           # Преимущества
│   ├── TariffsBento.tsx        # Тарифы (захардкожены)
│   ├── FleetGuides.tsx         # Флот и егеря
│   ├── RestSection.tsx         # Баня и отдых
│   ├── SpearfishingSection.tsx # Подводная охота
│   ├── DatesSection.tsx        # Даты заезда + бронирование
│   ├── InfrastructureBento.tsx # Инфраструктура
│   ├── LocationMap.tsx         # Карта (CSS-заглушка)
│   ├── Gallery.tsx             # Галерея (из API)
│   ├── Footer.tsx              # Подвал с контактами
│   └── Providers.tsx           # SessionProvider + tRPC + QueryClient
├── prisma/
│   ├── schema.prisma           # 9 моделей + 5 enum
│   └── seed.ts                 # Тестовые данные (выполнен)
├── src/
│   ├── components/telegram/PostForm.tsx  # Форма создания поста (Mini App)
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── s3.ts               # S3 upload utility (ключи пустые)
│   │   ├── telegram.ts         # Telegram API (send, notify, webhook)
│   │   └── trpc.ts             # tRPC client
│   ├── server/
│   │   ├── trpc.ts             # tRPC server + middleware (role check)
│   │   └── routers/            # post, user, tag, subscriber
│   └── types/next-auth.d.ts
├── middleware.ts                # Защита /admin + /api/admin
├── .env                        # Переменные окружения
└── tailwind.config.ts
```

---

## 4. Модели данных (Prisma)

| Модель | Назначение | Статус |
|---|---|---|
| User | Пользователи (admin, telegram, web) | ✅ Готово |
| Post | Публикации (уловы, погода, события) | ✅ Готово |
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

## 5. Текущие проблемы

### Критичные (для демо)
- [ ] TariffsBento захардкожен — не подключён к БД
- [ ] HeroBento фон — picsum.photos вместо реальных фото партнёров
- [ ] 10 коммитов не запушены в origin (нет git credentials на сервере)

### Важные
- [ ] S3 ключи пустые — загрузка файлов не работает
- [ ] Resend API ключ пустой — email рассылки нет
- [ ] Mini App — заглушка, не реализована
- [ ] LocationMap — CSS-заглушка, реальной карты нет
- [ ] Устаревший BACKLOG-комментарий в HeroBento.tsx:168

### Известные ограничения
- Auth работает только на email/password из `.env` (нет регистрации)
- `middleware.ts` deprecated в Next.js 16 (нужен `proxy`)
- DatesSection — хардкод дат (не из БД)
- Нет SEO-метаданных для страниц постов (generateMetadata)

---

## 6. Среда и доступы

| Ресурс | Значение |
|---|---|
| Деплой | https://vzmorie-five.vercel.app |
| Админка | https://vzmorie-five.vercel.app/admin |
| Логин | admin@vzmorie.ru |
| Пароль | J50ZbqjOJc2CfHoUu3tF |
| PostgreSQL | pg4.sweb.ru:5433/newlsu |
| Telegram Bot Token | 8737282103:AAHatRmZTgFm9acVK_KGBTffiuP74MdPeAo |
| Telegram Channel | 301930940 |
| GitHub | github.com/TikhonBaruch/vzmorie |

---

## 7. Хронология разработки

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
| 9 | `303a34c` | Главная на реальных данных (контакты, тарифы, галерея из API, hero) |
| 10 | `cc0a123` | Постинг с воды: Telegram catches + morning summary + conditions block |
| 11 | `ad5415e` | Секции сайта: флот, отдых, подводная охота, даты с бронированием |
| 12 | `875406a` | Исправление опечаток, грамматики, API conditions, telegram setup |

---

## 8. Контент страниц (справка)

### Навигация
| Якорь | Раздел | Статус |
|---|---|---|
| `#fleet` | Флот и Егеря | ✅ FleetGuides |
| `#rest` | Баня и Отдых | ✅ RestSection |
| `#spearfishing` | Подводная охота | ✅ SpearfishingSection |
| `#dates` | Даты заезда | ✅ DatesSection |

### Контакты (реальные)
- Email: vzmorie@rambler.ru
- Телефон: +7 (909) 372-05-73
- Координаты: 45.758469, 48.136073
- WhatsApp: +7 909 372-05-73

### Тарифы (реальные)
- Стандарт: от 7 100 ₽/сутки/чел
- I категория: от 7 400 ₽/сутки/чел
- Люкс: от 9 100 ₽/сутки/чел
- Включено: 3-разовое питание
