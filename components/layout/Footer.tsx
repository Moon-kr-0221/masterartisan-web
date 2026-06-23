import { SANS, BC_CARD_FONT, C } from '@/lib/tokens';

const year = new Date().getFullYear();

/**
 * 데스크탑: d933990 완전 동일
 * 모바일:   Pencil uNs3e — layout vertical, padding [40,24], gap 8, bg #1A1A1A, center
 */
export default function Footer() {
  return (
    <footer style={{ backgroundColor: C.ink }}>

      {/* ── 데스크탑 (d933990 완전 동일) ── */}
      <div
        className="hidden md:flex items-center justify-between w-full"
        style={{ borderTop: '1px solid #2A2A2A', height: '74px', padding: '0 80px' }}
      >
        <span className="font-bold" style={{ fontFamily: BC_CARD_FONT, fontSize: '16px', color: 'rgba(255,255,255,0.45)' }}>
          고려문화재기술원
        </span>
        <span className="text-[10px]" style={{ fontFamily: SANS, color: C.inkSoft }}>
          © {year} Korea Cultural Heritage Institute Inc. All rights reserved.
        </span>
      </div>

      {/* ── 모바일 — Pencil uNs3e ── */}
      <div
        className="md:hidden flex flex-col items-center"
        style={{ padding: '40px 24px', gap: 8 }}
      >
        <span style={{ fontFamily: BC_CARD_FONT, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
          고려문화재기술원
        </span>
        <span style={{ fontFamily: SANS, fontSize: 10, color: C.inkSoft }}>
          © {year} Korea Cultural Heritage Institute Inc. All rights reserved.
        </span>
      </div>

    </footer>
  );
}
