const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

interface SendMessageOptions {
  chatId: string | number;
  text: string;
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
  replyMarkup?: any;
}

export async function sendTelegramMessage({
  chatId,
  text,
  parseMode = "HTML",
  replyMarkup,
}: SendMessageOptions) {
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      reply_markup: replyMarkup,
    }),
  });

  return response.json();
}

export async function sendPhoto({
  chatId,
  photo,
  caption,
  parseMode = "HTML",
}: {
  chatId: string | number;
  photo: string;
  caption?: string;
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
}) {
  const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      photo,
      caption,
      parse_mode: parseMode,
    }),
  });

  return response.json();
}

export async function notifyNewPost(post: {
  title: string;
  slug: string;
  type: string;
  excerpt?: string;
  coverImage?: string;
}) {
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!chatId) return;

  const typeEmoji: Record<string, string> = {
    CATCH: "🐟",
    WEATHER: "🌤",
    WATER_LEVEL: "🌊",
    EVENT: "📅",
    PROMO: "🎉",
    NEWS: "📰",
  };

  const emoji = typeEmoji[post.type] || "📋";
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`;

  const text = [
    `${emoji} <b>${post.title}</b>`,
    post.excerpt ? `\n${post.excerpt}` : "",
    `\n<a href="${url}">Читать далее →</a>`,
  ]
    .filter(Boolean)
    .join("\n");

  if (post.coverImage) {
    await sendPhoto({
      chatId,
      photo: post.coverImage,
      caption: text,
    });
  } else {
    await sendTelegramMessage({ chatId, text });
  }
}

export async function notifyModeration(post: {
  title: string;
  authorName?: string;
}) {
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!chatId) return;

  const text = [
    `📝 <b>Новая публикация на модерацию</b>`,
    `\n<b>${post.title}</b>`,
    post.authorName ? `\nАвтор: ${post.authorName}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await sendTelegramMessage({
    chatId,
    text,
    replyMarkup: {
      inline_keyboard: [
        [
          { text: "✅ Одобрить", callback_data: `approve:${post.title}` },
          { text: "❌ Отклонить", callback_data: `reject:${post.title}` },
        ],
      ],
    },
  });
}

export async function sendMorningTemplate(chatId: string | number) {
  const text = `📋 <b>Утренняя сводка</b>

Отправь сводку в формате:

<b>Погода:</b> солнечно, +18°C, ветер 3 м/с
<b>Что клюёт:</b> жерех на воблер, окунь на блесну
<b>Уровень воды:</b> стабильный / падает / поднимается
<b>Чистота воды:</b> видимость 2-3 м / мутная

Или просто отправь фото с описанием улова — это будет пост типа "Трофей".`;

  return sendTelegramMessage({ chatId, text });
}

export async function setWebhook(url?: string) {
  const webhookUrl = url || `${process.env.NEXT_PUBLIC_SITE_URL}/api/telegram/webhook`;
  const secret = process.env.TELEGRAM_BOT_SECRET;

  const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["message", "callback_query"],
    }),
  });

  return response.json();
}

export async function getWebhookInfo() {
  const response = await fetch(`${TELEGRAM_API}/getWebhookInfo`);
  return response.json();
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const response = await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
      show_alert: false,
    }),
  });

  return response.json();
}

export async function notifyPublished(title: string, url: string) {
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!chatId) return null;

  return sendTelegramMessage({
    chatId,
    text: `<b>Публикация опубликована</b>\n\n<b>${title}</b>\n<a href="${url}">Открыть на сайте</a>`,
  });
}
