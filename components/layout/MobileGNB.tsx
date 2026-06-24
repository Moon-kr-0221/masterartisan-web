'use client';

import Link from 'next/link';
import { LOGO_FONT, C } from '@/lib/tokens';

interface Props {
  onMenuOpen: () => void;
}

/** Pencil MaOi1 — 390×56, #FFFFFF, padding [0,24], bottom border hairline */
export default function MobileGNB({ onMenuOpen }: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between"
      style={{
        height: 56,
        backgroundColor: C.canvas,
        borderBottom: `1px solid ${C.hairline}`,
        padding: '0 24px',
      }}
    >
      <Link
        href="/"
        style={{ fontFamily: LOGO_FONT, fontSize: 24, fontWeight: 700, color: C.ink }}
      >
        KCHI
      </Link>

      <button
        onClick={onMenuOpen}
        aria-label="메뉴"
        style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>
  );
}
