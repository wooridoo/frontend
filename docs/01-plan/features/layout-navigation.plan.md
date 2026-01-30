# Layout & Navigation 개편 계획 (Retroactive)

## 1. 개요
- **기능명**: layout-navigation
- **작성일**: 2026-01-30 (Retroactive)
- **작성자**: WooriDo Agent (Antigravity)
- **우선순위**: P0 (Core Experience)

## 2. 배경 및 목적
- **UX 개선**: 모바일 퍼스트 대응 및 직관적인 네비게이션 구조 필요.
- **디자인 통일성**: 이모지 아이콘을 제거하고 WDS(WooriDo Design System) 스타일의 커스텀 SVG 아이콘으로 대체.
- **확장성**: 사용자 상태(로그인/비로그인, 프로필)를 네비게이션 곳곳에서 일관되게 처리할 수 있는 컴포넌트 구조 수립.

## 3. 요구사항

### 3.1 기능 요구사항
- [x] FR-001: **SideNav 반응형 동작** - 데스크탑에서는 접힘/펼침, 모바일에서는 드로어(Drawer) 형태로 동작해야 한다.
- [x] FR-002: **TopNav 검색바 개선** - 검색바는 상단 중앙에 위치하며, 반응형으로 크기가 조절되어야 한다.
- [x] FR-003: **Custom Icon System** - `SidebarIcon` 등 커스텀 SVG 컴포넌트를 통해 모든 메뉴 아이콘을 벡터 그래픽으로 렌더링한다.
- [x] FR-004: **Profile Component** - 사이드바 및 리스트에서 사용 가능한 만능 프로필 컴포넌트(Lottie 로딩 포함)를 구현한다.
- [x] FR-005: **My Challenges 노출 제어** - 로그인 상태에 따라 '내 챌린지' 섹션의 노출 여부를 동적으로 제어한다.

### 3.2 비기능 요구사항
- [x] NFR-001: **성능** - Lottie 애니메이션은 필요시에만 로드되거나 가볍게 처리되어야 한다.
- [x] NFR-002: **접근성** - 모든 네비게이션 요소는 키보드 포커싱 및 스크린 리더 인식이 가능해야 한다.

## 4. WooriDo 도메인 규칙 체크

### 4.1 당도(Brix) 시스템 적용
- [ ] 해당 없음 (네비게이션 자체는 점수 로직과 무관)
- [x] 당도 점수 표시 (프로필 컴포넌트 내에서 간접적으로 노출 가능성 있음)

### 4.2 보증금(Deposit) 관련
- [x] 해당 없음

### 4.3 Fintech 규정 준수
- [x] 해당 없음

## 5. 범위

### 5.1 포함 (In Scope)
- `TopNav`, `SideNav` 컴포넌트 리팩토링
- `components/ui/Icons` (Search, Category, Sidebar)
- `components/ui/Profile` 패키지
- `HomePage`의 레이아웃 구조 변경

### 5.2 제외 (Out of Scope)
- `LoginPage` 내부 로직 (별도 `user-auth` 기능으로 분류)
- `ChallengeDetail` 등 개별 페이지의 컨텐츠

## 6. 일정 (Retroactive)

| 단계 | 기간 | 담당 | 상태 |
|------|----------|------|------|
| 설계 | 2026.01.29 | Agent | 완료 |
| 구현 | 2026.01.30 | Agent | 완료 |
| 테스트 | 2026.01.30 | Agent | 완료 |
| 배포 | 2026.01.30 | Agent | 대기 |

## 7. 위험 요소

| 위험 | 영향도 | 대응 방안 (조치 완료) |
|------|--------|----------|
| 모바일 레이아웃 깨짐 | High | `SideNav`를 `position: fixed` 오버레이로 처리하고 z-index 관리 철저히 함. |
| 아이콘 리소스 관리 | Medium | 개별 SVG 파일 대신 컴포넌트(`SidebarIcon`) 내에서 Path 관리로 변경하여 유지보수성 향상. |

## 8. 다음 단계
- [ ] 이 문서 검토 후 `/pdca-design layout-navigation` 실행하여 디자인 문서(Design Log) 작성
