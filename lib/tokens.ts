// Single source of truth for design tokens shared across all pages.
// Font variables resolve to CSS custom properties defined in globals.css.
export const SERIF = 'var(--font-serif)';
export const SANS  = 'var(--font-sans)';
export const LOGO_FONT = 'var(--font-kchi)';
export const BC_CARD_FONT = 'var(--font-bc-card)';

export const C = {
  // text
  ink:         '#1A1A1A',   // primary text
  inkSoft:     '#555555',   // secondary / body text
  muted:       '#AAAAAA',   // eyebrow labels, category text
  // surfaces
  canvas:      '#FFFFFF',   // white background
  surface:     '#F7F6F3',   // off-white secondary surface (alternating cards)
  dark:        '#0D0C0A',   // deep dark background (hero overlays, dark sections)
  // dividers
  hairline:    '#E8E8E8',   // 1 px light separator (nav, section edges, row dividers)
  rule:        '#CCCCCC',   // decorative content rule line
  // on-dark colors
  darkMuted:   '#888888',   // secondary text on dark bg
  darkDivider: '#444444',   // divider on dark bg
  // utility
  imageBg:     '#EDEAE4',   // image placeholder / loading background
  // accent
  accent:      '#8C6D3F',   // warm brown (map links, certification labels)
  gold:        '#C4A882',   // gold (menu overlay item numbers)
} as const;
