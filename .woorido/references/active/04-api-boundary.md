# Active API Boundary

- Client -> Go API only
- Go API -> PostgreSQL + worker
- Worker handles Brix batch, notifications, and reconciliation
- Money-moving responses should reference `financial_events` where applicable
- Approved expense reimbursement should use `expense_execution_sessions`
- Search, recommendation, analytics, and barcode payment are phase 2 references
- Do not design default client flows around Spring/Django split ownership
