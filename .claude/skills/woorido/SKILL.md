---
name: woorido-platform
description: Active WOORIDO platform skill for Go + PostgreSQL modular monolith work. Use when working on WOORIDO domain rules, API boundaries, state models, financial ledger behavior, documentation SSOT, or AI workflow alignment. Prefer this skill for default WOORIDO work. Use the legacy skill only for Spring/Django/Oracle migration or comparison tasks.
---

# WOORIDO Platform

Use bundled active references first.

1. Read `.woorido/references/active/00-navigation.md`.
2. Read `.woorido/references/active/01-terms.md`.
3. Read `.woorido/references/active/02-state-model.md`.
4. Read `.woorido/references/active/03-financial-model.md`.
5. Read `.woorido/references/active/04-api-boundary.md`.
6. Read `.woorido/references/active/05-db-schema.md` only when schema or persistence matters.

If the project contains `docs/00_CANONICAL`, prefer those project docs over bundled references.

Follow these rules:

- Treat Go + PostgreSQL modular monolith as the only active architecture.
- Treat Spring/Django/Oracle/Elasticsearch materials as migration-only references.
- Use exact policy IDs or canonical enum strings when reviewing or editing.
- Keep new documentation small, single-purpose, and reference-driven.
- Do not propose legacy workflows or legacy architecture unless the task is explicitly migration-related.
