# WooriDo Agent Context

> **IMPORTANT**: This document serves as the primary context and rule set for all AI agents working on the WooriDo project.
> (이 문서는 우리두 프로젝트에서 작업하는 모든 AI 에이전트를 위한 핵심 컨텍스트 및 규칙 모음입니다.)

## 1. Project Overview (프로젝트 개요)

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Spring Boot 3.2 (Java 21) & Django 5.0
- **Database**: Oracle (Main) & Elasticsearch (Search/Rec)
- **Design System**: WDS (WooriDo Design System)
- **Reference**: Detailed code patterns can be found in `woorido-skills` package.
  (상세한 코드 템플릿과 예시는 woorido-skills 패키지를 참조하세요.)

---

## 2. Frontend Rules (프론트엔드 규칙)

### 2.1 Styling Strategy (스타일링 전략)
- **CSS Modules**: All component styles must be in `[Name].module.css`.
  (모든 컴포넌트 스타일은 CSS Modules를 사용해야 합니다.)
- **WDS Tokens**: strictly use WDS variables (e.g., `var(--color-orange-500)`, `var(--space-4)`).
  (반드시 WDS 디자인 토큰 변수를 사용하세요.)
- **Tailwind**: Use ONLY for layout utilities like `flex`, `grid`, `w-full`. Do not use for colors or typography.
  (Tailwind는 오직 레이아웃 유틸리티 용도로만 사용하세요. 색상이나 타이포그래피에는 사용 금지.)

### 2.2 Component Structure (컴포넌트 구조)
- **Path**: `src/components/[Feature]/[Name]/[Name].tsx` (Import via `@/components/...`)
- **Pattern**:
  1. Import styles from `*.module.css`
  2. Use `clsx` for class merging
  3. Wrap Radix UI primitives if interactive
  (스타일 임포트, clsx 사용, Radix UI 래핑 패턴을 준수하세요.)

### 2.3 Form Pattern (폼 패턴)
- **Library**: `react-hook-form` + `zod` for validation.
  (폼 처리는 react-hook-form과 zod 유효성 검사를 사용하세요.)
- **Example**: Define schema with `z.object`, use `zodResolver`.
  (z.object로 스키마를 정의하고 zodResolver를 연동하세요.)

### 2.4 State Management (상태 관리)
- **Server State**: Use `React Query` (`@tanstack/react-query`) with specific query keys.
  (서버 데이터는 React Query를 사용하고 명확한 쿼리 키를 지정하세요.)
- **Client State**: Use `Zustand` for global UI state (e.g., theme, modal).
  (UI 관련 전역 상태는 Zustand를 사용하세요.)

---

## 3. Backend Rules (백엔드 규칙)

### 3.1 Spring Boot (Main API)
- **Controller**: Use `ApiResponse<T>` wrapper for consistent JSON response.
  (일관된 JSON 응답을 위해 ApiResponse 래퍼를 사용하세요.)
- **Mapper**: Use MyBatis with XML mappers for Oracle DB interactions.
  (Oracle DB 연동 시 MyBatis XML 매퍼를 사용하세요.)

### 3.2 Django (Sub API)
- **Framework**: Django REST Framework (DRF)
- **Role**: Search (Elasticsearch) & Recommendation logic only.
  (검색 및 추천 로직 전용으로 사용됩니다.)

---

## 4. Naming Conventions (명명 규칙)

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `ChallengeCard.tsx` |
| Hook | camelCase | `useChallenge.ts` |
| CSS Class | camelCase | `.challengeCard` |
| Interface | PascalCase | `ChallengeProps` |
| API URL | kebab-case | `/api/user-profiles` |

---

## 5. Critical Instructions (핵심 지시사항)

1. **Always Check Context**: Refer to `AGENTS.md` before generating code to ensure compliance.
   (코드 생성 전 항상 이 파일을 참조하여 규칙 준수 여부를 확인하세요.)
2. **Hybrid Language**: When writing comments or explanations, use **Korean** for context/rationale and **English** for technical terms.
   (주석이나 설명 작성 시, 맥락/이유는 한글로, 기술 용어는 영문으로 작성하세요.)
