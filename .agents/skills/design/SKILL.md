---
name: design
description: Design and edit UI in .pen files using the Pencil MCP tool. Use this skill whenever the user asks to design UI, create mockups, edit or update a design, add or modify components, build a layout, or work with .pen design files. Also trigger for "design a page", "create a UI", "mockup a component", "make it look like X", "add a section to the design", or any request that involves visually composing an interface — even if the user doesn't say "Pencil" or ".pen" explicitly. Always use this skill when visual design work is needed.
---

# Design Skill

Use Pencil MCP tools to create, edit, and iterate on UI designs in .pen files, applying the design tokens defined in `DESIGN.md`.

## Before You Start

Always do these two things before touching any design:

1. **Load the schema** — call `get_editor_state(include_schema: true)`. The .pen schema can differ between file versions; without it, every other Pencil tool call will fail or produce wrong results.

2. **Load the design tokens** — read `DESIGN.md`. All colors, font stacks, spacing, and radii come from there. Never hardcode a value that has a token.

## Core Workflow

```
1. get_editor_state(include_schema: true)   ← always first
2. get_guidelines()                          ← pick up any project constraints
3. batch_design(...)                         ← create or edit nodes
4. get_screenshot()                          ← verify visually
5. iterate if needed
```

Repeat steps 3–4 until the screenshot matches the intent.

## Design Token Reference

Resolve these token names to their values when calling `batch_design`:

### Colors
| Token | Value |
|---|---|
| `colors.primary` | `#000000` |
| `colors.on-primary` | `#ffffff` |
| `colors.ink` | `#000000` |
| `colors.ink-soft` | `#1a1a1a` |
| `colors.body` | `#757575` |
| `colors.hairline` | `#e0e0e0` |
| `colors.canvas` | `#ffffff` |
| `colors.canvas-soft` | `#f5f5f5` |
| `colors.link` | `#057dbc` |

### Typography font stacks
| Role | Font stack |
|---|---|
| Display serif (headlines) | `WiredDisplay, "Times New Roman", Georgia, serif` — substitute: *Playfair Display* |
| Body serif (articles, bylines) | `BreveText, Georgia, "Times New Roman", serif` — substitute: *Lora* |
| Sans (nav, buttons, labels) | `Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif` — substitute: *Inter* |

### Spacing (base unit 4 px)
`xxs`=2 · `xs`=4 · `sm`=8 · `md`=12 · `lg`=16 · `xl`=20 · `2xl`=24 · `3xl`=32 · `4xl`=48

### Border radius
- **All interactive elements** (buttons, inputs, cards): `0px`
- **Circular icon containers only**: `9999px`

## Component Quick Reference

| Component | Background | Text color | Border | Padding |
|---|---|---|---|---|
| `button-primary` | `#000000` | `#ffffff` | none | 12px 20px |
| `button-outline` | `#ffffff` | `#000000` | 1px solid `#000000` | 12px 20px |
| `nav-bar` | `#ffffff` | `#000000` | none | 12px 20px |
| `footer` | `#000000` | `#ffffff` | none | 48px 20px |
| `text-input` | `#ffffff` | `#000000` | 1px solid `#000000` | 12px 16px |
| `story-card` | `#ffffff` | `#000000` | none | 12px |
| `story-card-large` | `#ffffff` | `#000000` | none | 16px |
| `hero-band` | `#ffffff` | `#000000` | none | 48px 20px |
| `masthead-band` | `#ffffff` | `#000000` | none | 12px 20px |

For the full list of components and their token references, see `DESIGN.md` → Components section.

## Design Rules

These are non-negotiable — they define the visual identity of this design system:

- **No drop-shadows.** Use `colors.hairline` (1px solid `#e0e0e0`) for separation. Use `colors.ink` (2px solid `#000000`) for emphasis.
- **No rounded corners on interactive elements.** Every button, input, and card uses `border-radius: 0px`.
- **No chromatic accent except the link blue.** `#057dbc` is only for inline body links — never for buttons, nav, or UI chrome.
- **Serif for content, sans for structure.** Display and body serif fonts carry headlines and article text. Apercu (sans) carries nav links, button labels, captions, and metadata. Never swap these.
- **Display weight stays at 400.** The elegance of the display serif comes from its letterform, not bold weight.
- **Black-and-white core palette.** The design reads as a printed editorial surface. Only introduce `colors.canvas-soft` for secondary backgrounds.

## Pencil Tool Cheatsheet

| Tool | When to use |
|---|---|
| `get_editor_state(include_schema: true)` | Always first; also re-run if tool calls start failing |
| `get_guidelines()` | Before starting work on an existing file |
| `batch_design(...)` | Create or modify design nodes |
| `get_screenshot()` | Verify after every significant change |
| `batch_get(...)` | Inspect existing nodes before modifying |
| `snapshot_layout()` | Checkpoint before large structural changes |
| `get_variables()` / `set_variables()` | Read or write design tokens stored in the .pen file |
| `export_nodes(...)` | Extract assets from the design |

## Troubleshooting

- **Tool call fails with schema error** → re-run `get_editor_state(include_schema: true)` and try again.
- **Screenshot looks wrong** → read `batch_get` on the affected nodes to see what was actually set, then correct with `batch_design`.
- **Font not rendering** → fall back to the open-source substitutes listed in the Typography section above.
