const toBoolean = (value: string | undefined, defaultValue: boolean) => {
  if (value == null) return defaultValue;
  return value === '1' || value.toLowerCase() === 'true';
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const capabilities = {
  voteResult: toBoolean(import.meta.env.VITE_CAP_VOTE_RESULT, true),
  notificationDetail: toBoolean(import.meta.env.VITE_CAP_NOTIFICATION_DETAIL, true),
  notificationReadAll: toBoolean(import.meta.env.VITE_CAP_NOTIFICATION_READ_ALL, true),
  notificationSettings: toBoolean(import.meta.env.VITE_CAP_NOTIFICATION_SETTINGS, false),
  feedInlineThread: toBoolean(import.meta.env.VITE_CAP_FEED_INLINE_THREAD, true),
  commentLike: toBoolean(import.meta.env.VITE_CAP_COMMENT_LIKE, true),
  socialNotifications: toBoolean(import.meta.env.VITE_CAP_SOCIAL_NOTIFICATIONS, true),
  expenseActions: toBoolean(import.meta.env.VITE_CAP_EXPENSE_ACTIONS, true),
  expenseCrud: toBoolean(import.meta.env.VITE_CAP_EXPENSE_CRUD, false),
  legacyExpenseApi: toBoolean(import.meta.env.VITE_CAP_LEGACY_EXPENSE_API, false),
};
