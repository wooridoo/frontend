# Active Financial Model

- Use append-only entries for money movement.
- Treat wallet and challenge balances as projections.
- Require idempotency keys for charge, refund, and automated money flows.
- Model join payment as support + deposit lock + optional entry fee.
- Keep deposit in the user's wallet lock, not in challenge balance.
- Use `expense_execution_sessions` for approved spending execution.
- Phase 1 execution type is `LEADER_REIMBURSEMENT`.
- Do not treat direct payment barcodes as the active MVP flow.
