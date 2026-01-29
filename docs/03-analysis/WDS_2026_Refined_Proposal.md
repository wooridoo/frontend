# WDS 2026 Evolution Proposal (Refined)

> **Analysis Date**: 2026-01-29
> **Reference**: `PRODUCT_AGENDA.md` (MVP Focus, Trust-First), `WDS_2026_Evolution_Proposal.md` (Trends)
> **Decision**: Filter out high-risk/high-effort trends. Focus on "Trust + Warmth" enhancements.

## 1. Filtered Decisions

| 2026 Trend Idea | Decision | Reason |
|-----------------|----------|--------|
| **Tactile Maximalism**<br>(Squishy buttons, textures) | **⚠️ PARTIAL REJECT** | **Reason**: 금융 앱의 신뢰성 저하 우려. "Flat & Simple" 원칙 위배.<br>**Action**: "Squishy"는 제외하고, **"Soft Pop" (가벼운 입체감)** 정도만 수용. |
| **Adaptive Interfaces**<br>(Mood/Time-based Themes) | **❌ REJECT (Post-Demo)** | **Reason**: "Dark Mode is Post-Demo" (Agenda). MVP 개발 리소스 분산 우려.<br>**Action**: 테마 시스템은 나중으로 미루고, **기본 'Light Mode'의 완성도**에 집중. |
| **Social Gamification**<br>(3D Badges, Skins) | **✅ ACCEPT** | **Reason**: "Brix (당도)" 시스템은 우리두의 핵심 차별화 요소. 시각적 강화 필수.<br>**Action**: Brix Badge를 3D/Lottie로 고도화하여 성취감 부여. |
| **Kinetic Motion**<br>(Rolling Numbers) | **✅ ACCEPT** | **Reason**: "Toss-like" 경험의 핵심. 숫자가 변할 때의 생동감은 금융 앱의 표준.<br>**Action**: `FinancialText` 컴포넌트에 Rolling Animation 추가. |

---

## 2. Refined Action Plan (MVP Compatible)

### 💎 Concept: "Trustable Warmth" (신뢰할 수 있는 따뜻함)
> 과도한 장식(Maximalism)을 배제하고, **데이터(숫자)**와 **등급(Brix)**을 돋보이게 하는 마이크로 인터랙션에 집중합니다.

### Phase 1: High Impact, Low Effort (Immediate)
1.  **Rolling Counter (Kinetic Numbers)**
    -   *Why*: 정적인 숫자를 동적으로 바꿔 "살아있는 장부" 느낌 전달.
    -   *Where*: `FinancialText` 컴포넌트 내부 구현.
    -   *Tech*: `framer-motion`의 `useSpring` 활용.

2.  **Glassmorphism Lite**
    -   *Why*: 오버레이(Modal, BottomSheet)의 깊이감 개선.
    -   *Where*: `WDS_OVERLAY.md` 관련 컴포넌트.
    -   *Value*: `backdrop-filter: blur(12px)` + `background: rgba(255, 255, 255, 0.8)` (TDS 스타일).

3.  **Bouncy Interaction (Micro)**
    -   *Why*: 버튼 클릭 시 미세한 피드백으로 조작감 향상.
    -   *Value*: `active: scale(0.96)` 정도의 가벼운 텐션.

### Phase 2: Core Identity Upgrade (Next Sprint)
4.  **3D Brix Badge**
    -   *Why*: 당도(신뢰도)가 텍스트로만 존재하여 임팩트 부족.
    -   *Action*: 각 등급(🍯, 🍇, 🍎...)에 맞는 3D 이모지 또는 SVG 아이콘 제작/적용.

---

## 3. Rejected Items (Do Not Implement)
- ❌ **Morphing UI**: 구현 난이도 대비 MVP 임팩트 낮음.
- ❌ **Complex Gradients**: 브랜드 컬러(Orange)의 가시성을 해칠 수 있음.
- ❌ **Scrollytelling**: 정보 전달(장부, 투표)이 우선인 유틸리티 앱임.

## 4. Conclusion
"트렌드를 쫓기보다 **우리두의 본질(금융+커뮤니티)**을 강화하는 방향"으로 선회합니다.
**Rolling Counter**와 **Glassmorphism** 두 가지만 적용해도 앱의 퀄리티(Deep)가 크게 향상될 것입니다.
