@AGENTS.md

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

이 순서를 건너뛰거나 코드부터 먼저 수정해서는 안 된다. 디자인 확인·수정 없이 코드만 바꾸는 것은 허용되지 않는다.

## Design ↔ Code Parity (ALWAYS)

The implemented site (code) and the Pencil design (`masterartisan.pen`) must stay in sync. Whenever you change copy, typography, layout, or visible UI in code — or notice the design lacks something the code has — reflect the same change in the corresponding `.pen` board (and vice versa). Every visible text/typography/element present on the live site must also exist, with matching content and style (font family, size, weight, line-height, letter-spacing, color, alignment), on the matching Pencil board. This applies to all pages (desktop boards + the `M · …` mobile boards). Behavioral/data-only features (CMS, filters, animations) are exempt — only visible design must match.

@DESIGN.md