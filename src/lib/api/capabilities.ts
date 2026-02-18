const toBoolean = (value: string | undefined, defaultValue: boolean) => {
  if (value == null) return defaultValue;
  return value === '1' || value.toLowerCase() === 'true';
};

export const capabilities = {
  voteResult: toBoolean(import.meta.env.VITE_CAP_VOTE_RESULT, true),
  notificationSettings: toBoolean(import.meta.env.VITE_CAP_NOTIFICATION_SETTINGS, true),
  expenseActions: toBoolean(import.meta.env.VITE_CAP_EXPENSE_ACTIONS, true),
};
