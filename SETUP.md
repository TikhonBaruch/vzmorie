# Взморье — Настройка проекта

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env.local`:

```bash
cp .env.example .env.local
```

Заполните значения:

```env
# Database (рекомендую Neon или Supabase - бесплатные тарифы)
DATABASE_URL="postgresql://user:password@host:5432/vzmorie"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # openssl rand -base64 32

# Telegram Bot (создайте через @BotFather)
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_BOT_SECRET="your-bot-secret"
TELEGRAM_CHANNEL_ID="your-channel-id"
TELEGRAM_ADMIN_CHAT_ID="your-admin-chat-id"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Email (Resend - бесплатный тариф 100 писем/день)
RESEND_API_KEY="your-resend-api-key"

# Admin
ADMIN_EMAIL="admin@vzmorie.ru"
ADMIN_PASSWORD="your-admin-password"
```

### 3. Настройка базы данных

```bash
# Генерация Prisma Client
npm run db:generate

# Создание таблиц
npm run db:push

# Заполнение тестовыми данными
npm run db:seed
```

### 4. Запуск

```bash
npm run dev
```

Откройте http://localhost:3000

## Деплой на Vercel

### 1. Подготовка

1. Загрузите код на GitHub
2. Создайте проект в Vercel
3. Подключите репозиторий

### 2. Переменные окружения

Добавьте все переменные из `.env.local` в настройки проекта Vercel.

### 3. База данных

Рекомендую **Neon** (https://neon.tech):
1. Создайте аккаунт
2. Создайте проект
3. Скопируйте connection string в `DATABASE_URL`

### 4. Telegram Bot

1. Создайте бота через @BotFather в Telegram
2. Получите токен
3. Настройте webhook:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.vercel.app/api/telegram/webhook"}'
   ```

### 5. Email

1. Создайте аккаунт в Resend (https://resend.com)
2. Получите API ключ
3. (Опционально) Настройте свой домен

## Структура проекта

```
vzmorie/
├── app/
│   ├── api/
│   │   ├── auth/         # NextAuth
│   │   ├── trpc/         # tRPC API
│   │   ├── telegram/     # Telegram webhook
│   │   └── upload/       # File upload
│   ├── admin/            # Админ-панель
│   ├── miniapp/          # Telegram Mini App
│   ├── posts/            # Страницы постов
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Главная (лендинг)
├── components/
│   ├── admin/            # Компоненты админки
│   ├── telegram/         # Компоненты Mini App
│   ├── Header.tsx
│   ├── HeroBento.tsx
│   └── ...
├── prisma/
│   ├── schema.prisma     # Схема БД
│   └── seed.ts           # Тестовые данные
├── src/
│   ├── lib/
│   │   ├── auth.ts       # NextAuth config
│   │   ├── prisma.ts     # Prisma client
│   │   ├── s3.ts         # S3 upload
│   │   ├── telegram.ts   # Telegram API
│   │   └── trpc.ts       # tRPC client
│   └── server/
│       ├── trpc.ts       # tRPC server
│       └── routers/      # API роутеры
│           ├── index.ts
│           ├── post.ts
│           ├── user.ts
│           ├── tag.ts
│           └── subscriber.ts
└── .env.example
```

## API Endpoints

### tRPC (все запросы через `/api/trpc`)

- `post.list` — список постов
- `post.bySlug` — пост по slug
- `post.create` — создать пост (авторизованные)
- `post.update` — обновить пост (админ)
- `post.delete` — удалить пост (админ)
- `post.approve` — одобрить пост (админ)
- `post.reject` — отклонить пост (админ)
- `user.me` — текущий пользователь
- `user.list` — список пользователей (админ)
- `tag.list` — список тегов
- `subscriber.subscribe` — подписка на рассылку

### Webhook

- `POST /api/telegram/webhook` — обработка сообщений от Telegram

## Следующие шаги

1. [ ] Добавить голосовые сообщения (Speech-to-Text)
2. [ ] Интеграция с Yandex Maps / 2GIS для карты мест
3. [ ] Push-уведомления для Mini App
4. [ ] Система рейтинга и лидерборд
5. [ ] Интеграция с CRM (Битрикс24, AmoCRM)
6. [ ] Аналитика (Yandex.Metrika, GA4)
