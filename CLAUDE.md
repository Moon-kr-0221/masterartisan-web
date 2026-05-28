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
