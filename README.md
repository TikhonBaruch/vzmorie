# VZMORIE — Сайт рыбалки на Байкале

Персональный сайт для специалистов по рыбалке с админ-панелью, Telegram-интеграцией и каталогом товаров.

**Сайт:** https://vzmorie-five.vercel.app

---

## Стек

- **Framework:** Next.js 16 (App Router), React, TypeScript
- **База данных:** PostgreSQL + Prisma ORM
- **Авторизация:** NextAuth v4 (JWT, Credentials provider, bcrypt)
- **UI:** Tailwind CSS, Framer Motion, Lucide icons
- **Хранилище:** Yandex Object Storage (S3) / локальная FS
- **Telegram:** Bot API (webhook, inline-кнопки модерации)
- **Деплой:** Vercel

---

## Функционал

### Публичная часть

| Страница | Описание |
|----------|----------|
| `/` | Главная — герой-блок, тарифы, условия, инфраструктура |
| `/posts` | Лента публикаций (уловы, погода, новости, мероприятия) |
| `/posts/[slug]` | Детальная страница поста с медиа и комментариями |

### Админ-панель (`/admin`)

| Раздел | Описание | Доступ |
|--------|----------|--------|
| Дашборд | Статистика (посты, пользователи, комментарии, подписчики), очередь модерации | ADMIN+ |
| Публикации | CRUD публикаций (улов, погода, уровень воды, мероприятие, новость) | ADMIN+ |
| Чат | Быстрое создание постов через сообщения с хештегами | Все роли |
| Условия | Управление блоком условий отдыха | ADMIN+ |
| Тарифы | Управление тарифами | ADMIN+ |
| Даты заезда | Ближайшие даты | ADMIN+ |
| Товары | Каталог товаров | ADMIN+ |
| Фото сайта | Управление изображениями | ADMIN+ |
| Hero блок | Редактирование главного экрана | ADMIN+ |
| Пользователи | Управление пользователями (CRUD, пароли, роли) | SUPER_ADMIN |

### Роли

| Роль | Описание |
|------|----------|
| SUPER_ADMIN | Полный доступ: управление пользователями, все разделы |
| ADMIN | Управление контентом (посты, тарифы, условия и т.д.) |
| EDITOR | Управление контентом |
| SPECIALIST | Только чат для создания постов (мобильный интерфейс) |
| USER | Пользователь Telegram-бота |

### Telegram-бот

- Приём текста и фото от пользователей → создание постов
- Хештеги `#улов`, `#погода`, `#новость` → автоматические теги
- Модерация через inline-кнопки (одобрить/отклонить)
- Утренняя сводка (команда `/сводка`)
- Автопубликация сводок погоды

---

## Переменные окружения

```env
# База данных
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://vzmorie-five.vercel.app"
NEXTAUTH_SECRET="your-secret"

# Telegram Bot
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_BOT_SECRET="your-bot-secret"
TELEGRAM_CHANNEL_ID="your-channel-id"
TELEGRAM_ADMIN_CHAT_ID="your-admin-chat-id"

# Сайт
NEXT_PUBLIC_SITE_URL="https://vzmorie-five.vercel.app"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# Админ (legacy, работает с fallback)
ADMIN_EMAIL="admin@vzmorie.ru"
ADMIN_PASSWORD="admin-password"

# S3 Storage (опционально)
S3_BUCKET="vzmorie"
S3_ENDPOINT="https://storage.yandexcloud.net"
S3_REGION="ru-central1"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
```

---

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Синхронизация БД
npx prisma db push

# Заполнение БД тестовыми данными
npx prisma db seed

# Development
npm run dev

# Production build
npm run build && npm start
```

---

## Команды

```bash
npm run dev          # Dev-сервер
npm run build        # Сборка
npm run start        # Production-сервер
npm run lint         # Линтинг
npm run db:push      # Синхронизация схемы
npm run db:migrate   # Миграция БД
npm run db:seed      # Тестовые данные
npm run db:studio    # Prisma Studio (GUI базы)
```

---

## API Routes

| Endpoint | Методы | Описание |
|----------|--------|----------|
| `/api/auth/[...nextauth]` | * | Авторизация |
| `/api/admin/posts` | GET/POST | Список/создание постов |
| `/api/admin/posts/[id]` | GET/PUT/DELETE | Редактирование/удаление поста |
| `/api/admin/users` | GET/POST | Список/создание пользователей |
| `/api/admin/users/[id]` | PATCH/DELETE | Обновление/удаление пользователя |
| `/api/admin/chat` | POST | Создание поста из чата |
| `/api/admin/stats` | GET | Статистика для дашборда |
| `/api/upload` | POST | Загрузка файлов |
| `/api/telegram/webhook` | POST | Webhook от Telegram |
| `/api/public/posts` | GET | Публичный список постов |
| `/api/public/hero` | GET | Данные героя |
| `/api/public/tariffs` | GET | Тарифы |
| `/api/public/dates` | GET | Даты заезда |

---

## Структура проекта

```
vzmorie/
├── app/
│   ├── admin/            # Админ-панель
│   │   ├── login/        # Логин
│   │   ├── users/        # Управление пользователями
│   │   ├── chat/         # Чат для создания постов
│   │   ├── posts/        # Управление публикациями
│   │   ├── hero/         # Редактирование героя
│   │   ├── tariffs/      # Тарифы
│   │   ├── dates/        # Даты заезда
│   │   ├── conditions/   # Условия
│   │   ├── products/     # Товары
│   │   └── images/       # Фото сайта
│   ├── api/              # API routes
│   ├── posts/            # Публичные страницы постов
│   └── page.tsx          # Главная
├── components/           # React-компоненты
├── src/
│   ├── lib/              # Утилиты (auth, prisma, s3, telegram)
│   ├── server/           # tRPC роутеры
│   └── types/            # TypeScript типы
├── prisma/
│   ├── schema.prisma     # Схема БД
│   └── seed.ts           # Тестовые данные
└── public/               # Статические файлы
```
