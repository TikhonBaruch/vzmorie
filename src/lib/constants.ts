// Common CSS classes
export const INPUT_CLASS =
  "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none";

export const LABEL_CLASS = "block mb-1 text-sm text-slate-400";

// Post types
export const POST_TYPE_LABELS: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Мероприятие",
  PROMO: "Акция",
  NEWS: "Новость",
};

export const POST_TYPE_COLORS: Record<string, string> = {
  CATCH: "bg-blue-500/20 text-blue-400",
  WEATHER: "bg-emerald-500/20 text-emerald-400",
  WATER_LEVEL: "bg-cyan-500/20 text-cyan-400",
  EVENT: "bg-purple-500/20 text-purple-400",
  PROMO: "bg-red-500/20 text-red-400",
  NEWS: "bg-amber-500/20 text-amber-400",
};

// Post statuses
export const POST_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Черновик",
  PENDING: "На модерации",
  PUBLISHED: "Опубликовано",
  ARCHIVED: "В архиве",
};

export const POST_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-700 text-slate-200",
  PENDING: "bg-yellow-900/50 text-yellow-300",
  PUBLISHED: "bg-green-900/50 text-green-300",
  ARCHIVED: "bg-slate-800 text-slate-400",
};

// User roles
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Супер-админ",
  ADMIN: "Администратор",
  EDITOR: "Редактор",
  SPECIALIST: "Специалист",
  USER: "Пользователь",
};

export const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-amber-900/50 text-amber-300",
  ADMIN: "bg-purple-900/50 text-purple-300",
  EDITOR: "bg-blue-900/50 text-blue-300",
  SPECIALIST: "bg-cyan-900/50 text-cyan-300",
  USER: "bg-slate-700 text-slate-200",
};

// Image processing defaults
export const IMAGE_MAX_WIDTH = 1920;
export const IMAGE_MAX_HEIGHT = 1080;
export const IMAGE_QUALITY = 80;
export const IMAGE_REDUCE_PERCENT = 30;

// Pagination
export const POSTS_PER_PAGE = 9;
export const AUDIT_PER_PAGE = 20;

// Phone validation
export const PHONE_REGEX = /^\+7\d{10}$/;
export const PHONE_ERROR = "Некорректный номер телефона";
