# ВЗМОРИЕ — Отчёт о состоянии проекта

> Дата: 05.07.2026
> Коммит: `ad5415e` + незакоммиченные изменения
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
│   │   │   ├── stats/          # REST: статистика дашборда
│   │   │   └── conditions/     # REST: CRUD условий (погода/вода) [НОВЫЙ]
│   │   ├── auth/[...nextauth]/ # NextAuth (email/password)
│   │   ├── conditions/         # GET: последние опубликованные условия [НОВЫЙ]
│   │   ├── telegram/
│   │   │   ├── webhook/        # Telegram webhook (секрет + модерация)
│   │   │   ├── setup/          # Установка webhook через Vercel (США) [НОВЫЙ]
│   │   │   └── status/         # Статус webhook + пользователей [НОВЫЙ]
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
│   ├── TariffsBento.tsx        # Тарифы
│   ├── FleetGuides.tsx         # Флот и егеря (integrated)
│   ├── RestSection.tsx         # Баня и отдых (integrated) [НОВЫЙ]
│   ├── SpearfishingSection.tsx # Подводная охота (integrated) [НОВЫЙ]
│   ├── DatesSection.tsx        # Даты заезда + бронирование (integrated) [НОВЫЙ]
│   ├── InfrastructureBento.tsx # Инфраструктура
│   ├── LocationMap.tsx         # Карта
│   ├── Gallery.tsx             # Галерея
│   ├── Footer.tsx              # Подвал с контактами
│   └── Providers.tsx           # SessionProvider + tRPC + QueryClient
├── prisma/
│   ├── schema.prisma           # 9 моделей + 5 enum
│   └── seed.ts                 # Тестовые данные
├── src/
│   ├── components/telegram/PostForm.tsx  # Форма создания поста (Mini App)
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── s3.ts               # S3 upload utility
│   │   ├── telegram.ts         # Telegram API (send, notify, webhook)
│   │   └── trpc.ts             # tRPC client
│   ├── server/
│   │   ├── trpc.ts             # tRPC server + middleware
│   │   └── routers/            # post, user, tag, subscriber
│   └── types/next-auth.d.ts
├── middleware.ts                # Защита /admin + /api/admin
└── tailwind.config.ts
```

---

## 3. Модели данных (Prisma)

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

## 4. Что реализовано

### Фронтенд (лендинг)
- [x] Многостраничный лендинг с тактическим дизайном
- [x] Header sticky с навигацией и CTA
- [x] HeroBento — bento-сетка главного экрана
- [x] ConditionsBlock — блок «Условия сегодня» (парсит сводку из БД)
- [x] FeaturesSplit, TariffsBento, InfrastructureBento
- [x] FleetGuides — флот и егеря
- [x] RestSection — баня и отдых (6 карточек amenities + доп. информация)
- [x] SpearfishingSection — подводная охота (Прозрак, видимость, правила)
- [x] DatesSection — календарь дат заезда с бронированием через WhatsApp
- [x] LocationMap, Gallery, Footer
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
- [x] REST API для админки (posts, products, stats, conditions)
- [x] Public API для условий (`/api/conditions`)
- [x] tRPC для фронтенда (post, user, tag, subscriber)
- [x] NextAuth Credentials (email/password)
- [x] Telegram webhook (секрет + модерация)
- [x] Telegram setup endpoint (обход блокировки API Telegram)
- [x] Telegram status endpoint (диагностика webhook + пользователей)
- [x] S3 upload presigned URL

### Интеграции
- [x] Telegram Bot — токен, webhook, уведомления
- [x] PostgreSQL — подключение к sweb.ru
- [x] NextAuth — JWT сессии, role в token

---

## 5. Незакоммиченные изменения

### Изменённые файлы (8)
- `app/admin/page.tsx` — обновлён дашборд
- `app/admin/posts/page.tsx` — обновлен CRUD постов
- `app/admin/products/page.tsx` — обновлен CRUD товаров
- `components/ConditionsBlock.tsx` — отступ mt-8 mb-12
- `components/FleetGuides.tsx` — исправлено описание Сергея (убрано «Прозрак как рыба»)
- `components/Header.tsx` — добавлен реалтайм weather/water из API
- `components/HeroBento.tsx` — обновлён
- `components/SpearfishingSection.tsx` — исправления

### Новые файлы (3 API routes)
- `app/api/admin/conditions/route.ts` — CRUD для сводок условий
- `app/api/telegram/setup/route.ts` — установка webhook через Vercel
- `app/api/telegram/status/route.ts` — диагностика webhook + пользователей

---

## 6. Текущие проблемы

### Требуют внимания
- [ ] **Типографская ошибка**: `SpearfishingSection.tsx:35` — «ПаспортRequired» (лишнее слово Required)
- [ ] Seed данных не запущен (`npx prisma db seed`)
- [ ] S3 ключи пустые — загрузка файлов не работает
- [ ] Resend API ключ пустой — email рассылки нет
- [ ] Mini App — заглушка, не реализован
- [ ] Нет push в origin — 9 коммитов впереди `origin/main`

### Известные ограничения
- Auth работает только на email/password из `.env` (нет регистрации)
- Нет role-based access в UI (все админы видят одно и то же)
- Товары не связаны с постами (нет интеграции «улов дня»)
- Нет SEO-метаданных для страниц постов (generateMetadata)
- `middleware.ts` deprecated в Next.js 16 (нужен `proxy`)
- DatesSection — хардкод дат (не из БД)

---

## 7. Контент страниц (для справки)

### Навигация
| Якорь | Раздел | Статус |
|---|---|---|
| `#fleet` | Флот и Егеря | ✅ Реализован (FleetGuides) |
| `#rest` | Баня и Отдых | ✅ Реализован (RestSection) |
| `#spearfishing` | Подводная охота | ✅ Реализован (SpearfishingSection) |
| `#dates` | Даты заезда | ✅ Реализован (DatesSection) |

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

---

## 8. Хронология разработки

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

---

## 9. Среда и доступы

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

## 10. CONTINUATION-BRIEF — статус задач

### §1.1 Главная на реальных данных
- [x] HeroBento, Gallery, TariffsBento подключены к tRPC/API
- [x] Реальные контакты, координаты, тарифы внесены
- [ ] Seed данных не запущен
- [ ] Реальные фото/3D-туры (domik.travel, astrakhan3d.ru, veles-tour.ru) — не подключены

### §1.2 Постинг с воды
- [x] Webhook принимает фото → Post PENDING → модерация
- [x] Утренняя сводка (WEATHER) — авто-публикация без модерации
- [x] ConditionsBlock — парсит и отображает сводку на Главной
- [x] Header показывает погоду/уровень воды из последней сводки
- [x] Telegram setup endpoint (обход блокировки api.telegram.org)
- [ ] Mini App — заглушка, не реализован

### §2 Реестр задуманного (BACKLOG)
- [x] #fleet → FleetGuides ✅
- [x] #rest → RestSection ✅
- [x] #spearfishing → SpearfishingSection ✅
- [x] #dates → DatesSection ✅
- [ ] PDF-презентация — не реализована
- [ ] Фильтр галереи по виду рыбы — не реализован
- [ ] Раздел «Природа» (4-й портрет ЦА) — не реализован

### §3 После демо-спринта
- [ ] S3 (Yandex Object Storage)
- [ ] Ролевой доступ в админке
- [ ] Погодный API
- [ ] Карта (Yandex Maps / 2ГИС)
- [ ] Email-рассылки (Resend)
- [ ] Аналитика
