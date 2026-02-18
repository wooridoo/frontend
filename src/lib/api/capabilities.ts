const toBoolean = (value: string | undefined, defaultValue: boolean) => {
  if (value == null) return defaultValue;
  return value === '1' || value.toLowerCase() === 'true';
};

export const capabilities = {
  voteResult: toBoolean(import.meta.env.VITE_CAP_VOTE_RESULT, false),
  notificationDetail: toBoolean(import.meta.env.VITE_CAP_NOTIFICATION_DETAIL, false),
  notificationReadAll: toBoolean(import.meta.env.VITE_CAP_NOTIFICATION_READ_ALL, false),
  notificationSettings: toBoolean(import.meta.env.VITE_CAP_NOTIFICATION_SETTINGS, false),
  expenseActions: toBoolean(import.meta.env.VITE_CAP_EXPENSE_ACTIONS, true),
  expenseCrud: toBoolean(import.meta.env.VITE_CAP_EXPENSE_CRUD, false),
  legacyExpenseApi: toBoolean(import.meta.env.VITE_CAP_LEGACY_EXPENSE_API, false),
};
