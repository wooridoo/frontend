---
description: Create a UX Flow document with emotion mapping and interaction planning
---

# /ux-flow [FeatureName]

<!-- 사용자 경험(UX) 흐름 설계 문서 생성 -->

## Usage
```
/ux-flow JoinChallenge --persona "Kim Employee"
/ux-flow VoteExpense
```

## Steps

// turbo
1. Create folder `docs/01_PLANNING/UX_UI/Flows/` if it doesn't exist.

// turbo
2. Create `docs/01_PLANNING/UX_UI/Flows/[FeatureName].ux.md` using the template below.

## Template Source
- Template: `templates/docs/templates/ux-flow.template.md` (Check this file for structure)

## AI Instructions
1. **Analyze Context**:
   - Read `docs/01_PLANNING/UX_UI/Strategy/UX_EMOTION_MAP.md` to understand emotional curves.
   - Read `docs/01_PLANNING/UX_UI/Behavior/UX_INTERACTIONS.md` for standard patterns.
   - Read `docs/01_PLANNING/UX_UI/Strategy/UX_STRATEGY.md` for personas.

2. **Fill Template**:
   - **Emotion Journey**: Map the user's feelings realistically based on the feature risk (money = anxiety).
   - **Interactions**: Select appropriate WDS interactions (e.g., use BottomSheet for complex actions on mobile).
   - **Micro-copy**: Draft copy that matches the "Immersive Community" tone (warm, trustable).

3. **Output**:
   - Create the file and summarize the key "Delight" moment planned for this flow.
