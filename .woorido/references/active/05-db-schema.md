# Active DB Schema

Core tables:

- users
- wallets
- wallet_entries
- financial_events
- financial_event_entries
- challenges
- challenge_members
- challenge_ledger_entries
- meetings
- meeting_attendees
- votes
- vote_records
- expense_requests
- expense_execution_sessions
- notifications
- notification_preferences
- notification_deliveries
- refresh_tokens

Mapping notes:

- accounts -> wallets
- account_transactions -> wallet_entries + financial_event_entries
- payment_barcodes -> expense_execution_sessions
