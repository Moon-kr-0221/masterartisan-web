@AGENTS.md

# [1순위 — 절대 규칙] Pencil 디자인 검증 없이 코드 적용 금지

**모든 작업에서 가장 먼저, 가장 우선적으로 적용되는 규칙이다.**

코드를 한 줄이라도 변경하기 전에 반드시 아래를 완료해야 한다:

1. `get_screenshot` / `batch_get`으로 해당 Pencil 보드를 읽는다.
2. 레이아웃, 텍스트 크기, 폰트, 색상, 간격, 정렬 등 모든 시각 요소를 Pencil 디자인과 대조한다.
3. 코드 적용 후 Playwright로 스크린샷을 찍어 Pencil과 나란히 비교한다.
4. **Pencil 디자인과 완전히 동일하다고 확인된 경우에만 커밋한다.**

이 규칙은 예외 없이 적용된다. Pencil 확인을 건너뛰고 코드를 변경하는 것은 허용되지 않는다.

# Desktop Layout — FROZEN (절대 수정 금지)

**데스크탑 레이아웃은 커밋 `d933990` 기준으로 완성되어 있다. 어떤 이유로도 손대지 않는다.**

- 데스크탑(≥768px)에 영향을 주는 CSS 값(px, %, font-size, padding, position, gap 등)을 변경하지 않는다.
- 모바일 반응형 작업 시 반드시 `md:` prefix 또는 `isMobile` 조건 분기로만 추가한다. 기존 데스크탑 값을 덮어쓰거나 삭제하면 안 된다.
- 모바일 코드를 추가할 때 데스크탑 코드가 변경되었는지 반드시 확인한다. 변경되었으면 즉시 `git checkout d933990 -- <파일>`로 원복하고 다시 작업한다.
- 이 규칙은 사용자가 명시적으로 "데스크탑 수정"을 지시할 때만 예외로 한다.

# Design System

All UI development must reference `DESIGN.md` for design tokens. Do not hardcode color values, font sizes, spacing, or border radii — always resolve them from the tokens defined in that file.

## Token Usage Rules

- **Colors**: Use tokens from `colors.*` (e.g. `colors.primary`, `colors.canvas`, `colors.ink`). Never write raw hex values in code.
- **Typography**: Apply `typography.*` tokens for all text styles. Match font family, size, weight, line-height, and letter-spacing exactly as specified.
- **Spacing**: Use `spacing.*` tokens for all margins, paddings, and gaps.
- **Border radius**: Use `rounded.none` (0px) for all interactive elements (buttons, inputs, cards). Use `rounded.full` only for circular icon containers.
- **Components**: When building a component that maps to one defined in `components.*`, inherit its token values as the starting point.

## Font Substitution

The design uses proprietary fonts (`WiredDisplay`, `BreveText`, `Apercu`). If these are not available, use the open-source substitutes listed in `DESIGN.md` under "Open-Source Substitutes".

## Elevation

No drop-shadows. Use 1px `colors.hairline` borders for separation, and 2px `colors.ink` borders for emphasis only.

## Design-First Workflow (MANDATORY)

**모든 UI 수정은 반드시 아래 순서를 지켜야 한다:**

1. **Pencil 확인** — 수정 대상 노드를 `batch_get` / `get_screenshot`으로 읽어 현재 디자인 상태를 파악한다.
2. **Pencil 디자인 수정** — `batch_design`으로 `.pen` 파일을 먼저 변경하고, `get_screenshot`으로 결과를 검수한다.
3. **코드 적용** — Pencil 검수가 완료된 뒤에만 해당 내용을 코드에 반영한다.
4. **코드 검증** — 코드 적용 후 반드시 Playwright로 스크린샷을 찍어 Pencil 디자인과 나란히 비교한다. 동일하다고 확인된 뒤에만 커밋한다.

이 순서를 건너뛰거나 코드부터 먼저 수정해서는 안 된다. **Pencil 디자인과 동일하다고 검증되지 않은 코드는 절대 커밋하지 않는다.**

## Design ↔ Code Parity (ALWAYS)

The implemented site (code) and the Pencil design (`masterartisan.pen`) must stay in sync. Whenever you change copy, typography, layout, or visible UI in code — or notice the design lacks something the code has — reflect the same change in the corresponding `.pen` board (and vice versa). Every visible text/typography/element present on the live site must also exist, with matching content and style (font family, size, weight, line-height, letter-spacing, color, alignment), on the matching Pencil board. This applies to all pages (desktop boards + the `M · …` mobile boards). Behavioral/data-only features (CMS, filters, animations) are exempt — only visible design must match.

@DESIGN.md