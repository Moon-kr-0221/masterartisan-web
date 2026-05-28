---
version: alpha

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  ink: "#000000"
  ink-soft: "#1a1a1a"
  body: "#757575"
  hairline: "#e0e0e0"
  canvas: "#ffffff"
  canvas-soft: "#f5f5f5"
  link: "#057dbc"

typography:
  display-hero:
    fontFamily: WiredDisplay, "Times New Roman", Georgia, serif
    fontSize: 64px
    fontWeight: 400
    lineHeight: 59.52px
    letterSpacing: -0.5px
  display-lg:
    fontFamily: WiredDisplay, "Times New Roman", Georgia, serif
    fontSize: 48px
    fontWeight: 400
    lineHeight: 50.4px
    letterSpacing: -0.4px
  display-md:
    fontFamily: WiredDisplay, "Times New Roman", Georgia, serif
    fontSize: 32px
    fontWeight: 400
    lineHeight: 35.2px
    letterSpacing: -0.3px
  display-sm:
    fontFamily: WiredDisplay, "Times New Roman", Georgia, serif
    fontSize: 26px
    fontWeight: 400
    lineHeight: 28.08px
  display-xs:
    fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 20px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: -0.28px
  body-serif-lg:
    fontFamily: BreveText, Georgia, "Times New Roman", serif
    fontSize: 19px
    fontWeight: 400
    lineHeight: 27.93px
    letterSpacing: 0.108px
  body-serif-md:
    fontFamily: BreveText, Georgia, "Times New Roman", serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0.09px
  body-md:
    fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 20px
  body-md-strong:
    fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 17px
    fontWeight: 700
    lineHeight: 22px
    letterSpacing: -0.144px
  body-sm:
    fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0.4px
  body-sm-strong:
    fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 14px
    fontWeight: 700
    lineHeight: 18px
    letterSpacing: 0.4px
  byline:
    fontFamily: BreveText, Georgia, "Times New Roman", serif
    fontSize: 12.73px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0.108px
  caption:
    fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  button-md:
    fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0.3px

rounded:
  none: 0px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 48px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.md} {spacing.xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.xl}"
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.xl}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.lg}"
  story-card-large:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.lg}"
  story-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xs}"
    padding: "{spacing.md}"
  story-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md-strong}"
    padding: "{spacing.lg} 0"
  category-eyebrow:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
  byline-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.byline}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-hero}"
    padding: "{spacing.4xl} {spacing.xl}"
  masthead-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    padding: "{spacing.md} {spacing.xl}"
  hairline-divider:
    borderColor: "{colors.hairline}"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-product-selector:
    description: "What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.none}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#000000`): Used for headlines, CTAs, and footer fill.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default page background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#f5f5f5`): Tint used for secondary backgrounds and hover states.
- **Hairline** (`{colors.hairline}` — `#e0e0e0`): 1 px dividers between rows.

### Text
- **Ink** (`{colors.ink}` — `#000000`): Headlines and body paragraphs.
- **Ink Soft** (`{colors.ink-soft}` — `#1a1a1a`): Near-black variant used for caption-strong / footer link emphasis.
- **Body** (`{colors.body}` — `#757575`): Secondary metadata — bylines, timestamps, supporting body lines.

### Semantic
- **Link** (`{colors.link}` — `#057dbc`): Inline body-link blue. Used only inside long-form article body copy, never on UI buttons or navigation.

## Typography

### Font Family
Three families ladder the system:
1. **WiredDisplay** — tall-narrow high-contrast serif used exclusively for display headlines (64 px hero, scaling down to 26 px sub-display).
2. **BreveText** — humanist serif used for long-form body, bylines, and editorial captions. Used at 16–19 px, line-height 1.45–1.50.
3. **Apercu** — humanist sans used for nav, button labels, category eyebrows, metadata, and captions. Weights 400 / 700.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-hero}` | 64px | 400 | 59.5px | -0.5px | Cover-story headline. |
| `{typography.display-lg}` | 48px | 400 | 50.4px | -0.4px | Major section / feature headlines. |
| `{typography.display-md}` | 32px | 400 | 35.2px | -0.3px | Story-card large variant. |
| `{typography.display-sm}` | 26px | 400 | 28px | 0 | Sub-display headings inside long-form articles. |
| `{typography.display-xs}` | 20px | 700 | 24px | -0.28px | Sans display micro-headings for category callouts. |
| `{typography.body-serif-lg}` | 19px | 400 | 27.93px | 0.108px | Lead paragraph of an article (BreveText). |
| `{typography.body-serif-md}` | 16px | 400 | 24px | 0.09px | Default article body (BreveText). |
| `{typography.body-md}` | 17px | 400 | 20px | 0 | Sans body for nav / metadata. |
| `{typography.body-md-strong}` | 17px | 700 | 22px | -0.144px | Bold sans body. |
| `{typography.body-sm}` | 14px | 400 | 18px | 0.4px | Secondary sans body. |
| `{typography.body-sm-strong}` | 14px | 700 | 18px | 0.4px | Bold caption / nav-link. |
| `{typography.byline}` | 12.73px | 700 | 28px | 0.108px | Article byline (BreveText). |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Fine print, image captions. |
| `{typography.button-md}` | 16px | 700 | 20px | 0.3px | Button label. |

### Principles
- **Serif for narrative, sans for structure.** The serif faces never carry button labels or nav text; the sans face never carries article body.
- **Display weight 400** — reads as elegant by virtue of its thin-tall-narrow design at default weight, not via weight 700+.
- **Bylines use BreveText weight 700 with relaxed line-height 2.2.**

### Open-Source Substitutes
- **WiredDisplay** — *Playfair Display* weight 400 at large display sizes.
- **BreveText** — *Lora* or *Source Serif Pro* at 16–19 px.
- **Apercu** — *Inter* or *Manrope* weights 400 / 700.

## Layout

### Spacing System
- **Base unit**: 4 px.
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px · `{spacing.4xl}` 48 px.
- **Section padding**: hero / story grid use `{spacing.4xl}` 48 px top/bottom on desktop.
- **Story row padding**: `{spacing.lg}` 16 px vertical between bylined story rows.

### Grid & Container
- Wide container (~1400 px max).
- Cover-story grid: 1 large hero + 2-up secondary stories + vertical stack.
- Story-row stack: full-width single column with hairline dividers.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Cover hero 64→40 px; all grids 1-up; hamburger nav. |
| Tablet | 768–1023px | 2-up secondary story grid. |
| Desktop | ≥ 1024px | Full magazine grid. |

#### Touch Targets
Button-primary renders ~44 px tall (12 vertical padding + 20 line). WCAG AAA at all widths.

#### Collapsing Strategy
- Nav: full link row + Subscribe CTA at desktop. Hamburger at mobile.
- Magazine grid: hero stays full-width; 2-up secondary drops to 1-up at mobile.
- Story rows: stay single-column at all viewports.

#### Image Behavior
- Cover images: full-bleed 16:9 hero / 4:3 secondary.
- Article body images: full-width inside the article column.
- Author avatars: small inline circular crops next to bylines.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default — almost every surface lives at this level. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border. | Story-row dividers, input borders. |
| Level 2 — Heavy Black Border | 2 px solid `{colors.ink}` border. | Subscribe CTA on certain campaign moments. |

No drop-shadows. Surface contrast and hairline borders carry all visual hierarchy.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Every interactive shape — buttons, inputs, cards. |
| `{rounded.full}` | 9999px | Circular icon containers only (social-share, account avatar). |

### Photography Geometry
- Cover stories: 16:9 hero, edge-to-edge.
- Secondary story cards: 4:3 thumbnails.
- Article body images: native aspect, full column width.
- Bylines / avatars: circular `{rounded.full}` 28 px crops.

## Components

### Buttons

**`button-primary`** — the square black CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.button-md}` (Apercu 16 px / 700 / 0.3 px tracking), padding `{spacing.md} {spacing.xl}`, shape `{rounded.none}` 0 px.

**`button-outline`** — the white outline CTA.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, same typography / padding / shape.

**`button-icon-circular`** — the circular share-icon button.
- Background `{colors.canvas}`, ink icon, shape `{rounded.full}`.

### Cards & Containers

**`story-card-large`** — the cover-story card with `{typography.display-md}` headline.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}`.

**`story-card`** — the secondary story card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md}`. Photo at top, sans display heading + body lead below.

**`story-row`** — the bylined story list row.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` bottom border, body in `{typography.body-md-strong}`, padding `{spacing.lg}` 0.

### Inputs & Forms

**`text-input`** — the standard text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, body in `{typography.body-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.none}`.

### Navigation

**`nav-bar`** — the top nav, light by default.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.xl}`. Layout: hamburger left, masthead centre, Subscribe right.

**`nav-link`** — link items inside nav.
- Text `{colors.ink}`, set in `{typography.body-sm-strong}` (Apercu 14 / 700).

**`footer`** — the black footer band.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.4xl} {spacing.xl}`. Body in `{typography.body-sm}` (Apercu 14 / 400). Footer column eyebrows in `{typography.body-sm-strong}`.

### Signature Components

**`hero-band`** — the white hero band hosting the cover-story.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.4xl} {spacing.xl}`. Cover headline in `{typography.display-hero}` (WiredDisplay 64 px).

**`masthead-band`** — the thin top band with the wordmark.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.xl}`.

**`category-eyebrow`** — the small uppercase category label above story headlines.
- Text `{colors.ink}`, set in `{typography.body-sm-strong}` (Apercu 14 / 700).

**`byline-row`** — the article byline strip.
- Background `{colors.canvas}`, text `{colors.body}`, body in `{typography.byline}` (BreveText 12.73 / 700 / line-height 2.2). Includes an author avatar + name + date.

**`hairline-divider`** — the 1 px line between story rows.
- 1 px solid `{colors.hairline}`.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses primary color as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do's and Don'ts

### Do
- Reserve `{colors.primary}` black for the wordmark, every CTA, and the footer fill.
- Set hero headlines in `{typography.display-hero}` (WiredDisplay 64 px weight 400).
- Use `{rounded.none}` 0 px on every button and form input. Square corners are consistent with the editorial design language.
- Pair WiredDisplay (serif display) with BreveText (serif body) and Apercu (sans labels). Three faces, three roles.
- Render story rows with `{colors.hairline}` 1 px dividers.

### Don't
- Don't introduce a chromatic accent color. The link blue is reserved for inline body links inside articles only.
- Don't round button corners.
- Don't add soft drop-shadows on cards. Surface contrast and hairlines carry elevation.
- Don't substitute the serif faces with a generic sans for display.
- Don't promote display weight beyond 400.
