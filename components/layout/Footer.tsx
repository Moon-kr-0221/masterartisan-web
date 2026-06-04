import { SANS, C } from '@/lib/tokens';

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
        <span className="text-[13px] font-bold" style={{ fontFamily: SANS, color: C.canvas, letterSpacing: '2px' }}>
          MASTERARTISAN
        </span>
        <span className="text-[10px]" style={{ fontFamily: SANS, color: C.inkSoft }}>
          © {year} MasterArtisan. All rights reserved.
        </span>
      </div>

      {/* ── 모바일 — Pencil uNs3e ── */}
      <div
        className="md:hidden flex flex-col items-center"
        style={{ padding: '40px 24px', gap: 8 }}
      >
        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: C.canvas }}>
          MASTERARTISAN
        </span>
        <span style={{ fontFamily: SANS, fontSize: 10, color: C.inkSoft }}>
          © {year} MasterArtisan. All rights reserved.
        </span>
      </div>

    </footer>
  );
}
