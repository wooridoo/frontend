---
description: Generate a standardized git commit message
---

# /git-commit

<!-- Git 커밋 메시지 컨벤션 가이드 -->

## Usage
```
/git-commit "Users login functionality"
/git-commit "Fix typo in README"
```

## Convention Rules

> **Reference**: `docs/02_ENGINEERING/CODING_CONVENTION.md` Section 6.1

### Structure
```text
<type>: <subject>

<body>

<footer>
```

### Types
| Type | Description |
|:---:|:---|
| **Feat** | New feature (기능 추가) |
| **Fix** | Bug fix (버그 수정) |
| **Docs** | Documentation only (문서 수정) |
| **Style** | Formatting, semi-colons (코드 포맷팅, 로직 변경 없음) |
| **Refactor** | Code change that neither fixes a bug nor adds a feature (리팩토링) |
| **Test** | Adding missing tests or correcting existing tests (테스트) |
| **Chore** | Build process, aux tools (빌드, 설정 등) |

### Rules
1. **Subject**:
   - 50 characters or less
   - Capitalized first letter
   - No period (.) at the end
   - Imperative mood (e.g., "Add user login" not "Added")
2. **Body**:
   - Wrap at 72 characters
   - Explain **what** and **why** (not how)
3. **Footer**:
   - Reference issues (e.g., `Closes #123`)

## Examples

### Feature
```text
Feat: Add user authentication via Google OAuth

Implement Google OAuth 2.0 login flow.
User can now sign in using their Google account.
Sensitive tokens are stored in secure HTTP-only cookies.

Closes #42
```

### Bug Fix
```text
Fix: Resolve infinite loop in pagination logic

The previous while-loop condition was incorrect, causing
the browser to crash when total items > 100.
Fixed boundary check to include the last page.
```

### Refactor
```text
Refactor: Extract payment validation to service

Move validation logic from Controller to PaymentService
to improve testability and reuse in background jobs.
```
