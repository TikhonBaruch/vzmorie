# ВЗМОРИЕ — Отчёт о состоянии проекта

> Дата: 06.07.2026
> Коммит: `5927188` (fix: change 'Ближайшие выходы' to 'Ближайшие даты')
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

## 2. Админ-панель

### Разделы админки

| Раздел | URL | Описание |
|--------|-----|----------|
| Дашборд | `/admin` | Статистика + очередь модерации |
| Hero блок | `/admin/hero` | Редактирование текстов главного экрана |
| Публикации | `/admin/posts` | CRUD публикаций + модерация |
| Условия | `/admin/conditions` | Погода, что клюёт, уровень воды, чистота |
| Тарифы | `/admin/tariffs` | Управление тарифными планами |
| Даты заезда | `/admin/dates` | Расписание + включение/выключение на сайте |
| Товары | `/admin/products` | Управление товарами магазина |
| Фото сайта | `/admin/images` | Загрузка/редактирование фото для Hero и галереи |

### Доступ
- Логин: `admin@vzmorie.ru`
- Пароль: `J50ZbqjOJc2CfHoUu3tF`

---

## 3. Публичные API

| Endpoint | Описание |
|----------|----------|
| `GET /api/public/posts` | Публикации (без WEATHER/WATER_LEVEL) |
| `GET /api/public/tariffs` | Тарифы из БД |
| `GET /api/public/dates` | Даты заезда + видимость |
| `GET /api/public/hero` | Тексты hero блока |
| `GET /api/conditions` | Последняя погодная сводка |
| `GET /api/site-images` | Фото для Hero и галереи |

---

## 4. Структура проекта

```
vzmorie/
├── app/
│   ├── admin/
│   │   ├── conditions/page.tsx   # Редактирование условий
│   │   ├── dates/page.tsx        # Управление датами заезда
│   │   ├── hero/page.tsx         # Редактирование hero блока
│   │   ├── images/page.tsx       # Управление фото
│   │   ├── tariffs/page.tsx      # Управление тарифами
│   │   ├── posts/page.tsx        # CRUD публикаций
│   │   └── products/page.tsx     # CRUD товаров
│   ├── api/
│   │   ├── admin/settings/       # CRUD настроек (hero, dates)
│   │   ├── public/
│   │   │   ├── dates/            # Публичный API дат
│   │   │   ├── hero/             # Публичный API hero
│   │   │   ├── posts/            # Публичный API постов
│   │   │   └── tariffs/          # Публичный API тарифов
│   │   └── upload/               # Загрузка файлов
│   ├── posts/page.tsx            # Полная галерея с фильтрами
│   └── posts/[slug]/page.tsx     # Детали поста
├── components/
│   ├── DatesSection.tsx          # Даты заезда (из БД)
│   ├── HeroBento.tsx             # Hero блок (тексты из БД)
│   ├── TariffsBento.tsx          # Тарифы (из БД)
│   ├── LocationMap.tsx           # Карта с OSM тайлами
│   └── Gallery.tsx               # Галерея (макс 8 на главной)
├── prisma/
│   ├── schema.prisma             # 11 моделей + 5 enum
│   └── seed.ts                   # Тестовые данные
└── src/
    └── components/FileUpload.tsx  # Загрузка файлов
```

---

## 5. Модели данных

| Модель | Назначение |
|--------|------------|
| User | Пользователи (admin, telegram, web) |
| Post | Публикации (уловы, погода, новости) |
| Product | Товары + тарифы (category="tariff") |
| SiteImage | Фото для Hero и галереи |
| SiteSetting | Настройки (hero, dates, ...) |
| Tag | Теги для постов |
| Media | Медиафайлы |
| Comment | Комментарии |
| Subscriber | Подписчики |
| Account/Session | NextAuth |

---

## 6. Текущие проблемы

### Для решения
- [ ] S3 ключи пустые — загрузка файлов работает локально, не на Vercel
- [ ] `middleware.ts` deprecated в Next.js 16
- [ ] Admin API routes без explicit auth (middleware защищает)
- [ ] Нет push в origin (38 коммитов)

### Известные ограничения
- DatesSection — хардкод дат в fallback (если БД пуста)
- TariffsBento — fallback на захардкоженные данные

---

## 7. Планы на масштабирование

### Фаза 2 — Контент
- [ ] Подключить реальные фото партнёров
- [ ] Реализовать Telegram Mini App
- [ ] Добавить PDF-презентацию базы

### Фаза 3 — Интеграции
- [ ] S3 (Yandex Object Storage)
- [ ] Погодный API
- [ ] Яндекс.Карты / 2ГИС
- [ ] Email-рассылки (Resend)
- [ ] Голосовые сообщения

### Фаза 4 — Масштабирование
- [ ] Ролевой доступ в UI
- [ ] Фильтр галереи по виду рыбы
- [ ] Система рейтинга
- [ ] Push-уведомления
- [ ] Аналитика

---

## 8. Среда и доступы

| Ресурс | Значение |
|--------|----------|
| Деплой | https://vzmorie-five.vercel.app |
| Админка | https://vzmorie-five.vercel.app/admin |
| Логин | admin@vzmorie.ru |
| Пароль | J50ZbqjOJc2CfHoUu3tF |
| PostgreSQL | pg4.sweb.ru:5433/newlsu |
| Telegram Bot | @vzmorie_bot |
| GitHub | github.com/TikhonBaruch/vzmorie |

---

## 9. Хронология (последние коммиты)

| # | Коммит | Описание |
|---|---|---|
| 38 | `5927188` | Замена 'Ближайшие выходы' на 'Ближайшие даты' |
| 37 | `dd72269` | Hero блок в админке (редактирование текстов) |
| 36 | `77ef7cc` | Даты заезда в админке + включение/выключение |
| 35 | `55a699c` | Тарифы в админке + интеграция с БД |
| 34 | `b3477c2` | Header/Footer на страницах постов |
| 33 | `1caa924` | Кнопка «Все публикации» всегда видна |
| 32 | `84d06e4` | Галерея ограничена 8, страница /posts с фильтрами |
| 31 | `c423768` | Исключение WEATHER/WATER_LEVEL из галереи |
| 30 | `2b5bfda` | Страница условий в админке |
| 29 | `cd6bc5b` | Обновление PROJECT-STATUS.md |
