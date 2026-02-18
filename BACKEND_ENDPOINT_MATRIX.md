# Backend Main Endpoint Matrix (Frontend Contract Lock)

## Source of truth
- `backend/main` controller mappings
- `frontend/src/lib/api/*` runtime contract

## Supported on `backend/main`
- Auth: `/auth/login`, `/auth/signup`, `/auth/logout`, `/auth/refresh`, `/auth/password/reset`
- User: `/users/me`, `/users/check-nickname`
- Challenge: `/challenges*`, `/challenges/{id}/support/settings`, `/challenges/{id}/delegate`
- Meeting: `/challenges/{id}/meetings`, `/meetings/{id}`, `/meetings/{id}/attendance`, `/meetings/{id}/complete`
- Vote: `/challenges/{id}/votes`, `/votes/{id}`, `/votes/{id}/cast`
- Notification: `/notifications`, `/notifications/{id}/read`

## Extension contract (0218 branch baseline, guarded by capability)
- Vote Result: `/votes/{id}/result`
- Notification extension: `/notifications/{id}`, `/notifications/read-all`, `/notifications/settings`

## Not supported on `backend/main` (blocked or migrated)
- `/auth/check-email` (removed from frontend API layer)
- Legacy Expense REST:
  - `/challenges/{id}/expenses`
  - `/challenges/{id}/expenses/{expenseId}`
  - `/challenges/{id}/expenses/{expenseId}/approve`
  - `/challenges/{id}/expenses/{expenseId}` (`PUT`/`DELETE`)

## Frontend strategy
- Expense flow defaults to vote-driven adapter (`EXPENSE` vote type).
- Legacy expense CRUD remains capability-gated (`VITE_CAP_LEGACY_EXPENSE_API`, `VITE_CAP_EXPENSE_CRUD`).
- Notification extension and vote result remain capability-gated.
