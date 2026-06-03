const SANS = 'var(--font-sans)';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A1A' }}>

      {/* ── 데스크탑 — d933990 완전 동일 ── */}
      <div
        className="hidden md:flex items-center justify-between w-full"
        style={{ borderTop: '1px solid #2A2A2A', height: '74px', padding: '0 80px' }}
      >
        <span
          className="text-[13px] font-bold"
          style={{ fontFamily: SANS, color: '#FFFFFF', letterSpacing: '2px' }}
        >
          MASTERARTISAN
        </span>
        <span
          className="text-[10px]"
          style={{ fontFamily: SANS, color: '#555555' }}
        >
          © {new Date().getFullYear()} MasterArtisan. All rights reserved.
        </span>
      </div>

      {/* ── 모바일 — Pencil uNs3e (vertical, padding 40px 24px, gap 8) ── */}
      <div
        className="md:hidden flex flex-col items-center"
        style={{ padding: '40px 24px', gap: 8 }}
      >
        <span
          style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#FFFFFF' }}
        >
          MASTERARTISAN
        </span>
        <span
          style={{ fontFamily: SANS, fontSize: 10, color: '#555555' }}
        >
          © {new Date().getFullYear()} MasterArtisan. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
