'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { href: '/masterartisan', label: 'MASTERARTISAN' },
  { href: '/history',      label: 'HISTORY' },
  { href: '/works',        label: 'WORKS' },
  { href: '/contact',      label: 'CONTACT' },
];

const REVEAL_ZONE = 124;

const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const mouseNearTop = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 80);
      const atBottom =
        current + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (current <= 80 || mouseNearTop.current || atBottom) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < REVEAL_ZONE) {
        mouseNearTop.current = true;
        setVisible(true);
      } else {
        mouseNearTop.current = false;
        if (window.scrollY > 80) setVisible(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const shown = visible || menuOpen;
    document.documentElement.style.setProperty('--nav-h', shown ? '72px' : '0px');
  }, [visible, menuOpen]);

  // 메뉴 오픈 시 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const bg = !isHome
    ? 'rgba(250,250,248,0.97)'
    : scrolled || menuOpen ? 'rgba(10,9,8,0.92)' : 'transparent';
  const border = !isHome ? '#E8E8E8' : scrolled || menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent';
  const logoColor = !isHome ? '#1A1A1A' : '#FFFFFF';
  const linkColor = (active: boolean) =>
    !isHome ? (active ? '#1A1A1A' : '#888888') : (active ? '#FFFFFF' : 'rgba(255,255,255,0.55)');
  const show = visible || menuOpen;

  return (
    <>
      {/* ── 데스크탑 NAV — d933990 완전 동일 ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 hidden md:block"
        style={{
          backgroundColor: bg,
          borderBottom: `1px solid ${border}`,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transform: show ? 'translateY(0)' : 'translateY(-100%)',
          transition: show
            ? 'transform 0.15s ease, background-color 0.5s, border-color 0.5s'
            : 'transform 0.3s ease, background-color 0.5s, border-color 0.5s',
        }}
      >
        <div className="flex items-center justify-between h-[72px]" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
          <Link
            href="/"
            className="font-bold transition-colors duration-300"
            style={{ fontFamily: SANS, fontSize: '16px', letterSpacing: '2px', color: logoColor }}
          >
            MASTERARTISAN
          </Link>
          <nav className="flex items-center gap-[44px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:opacity-70"
                style={{ fontFamily: SANS, fontSize: '11px', letterSpacing: '1.5px', color: linkColor(pathname === link.href) }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ── 모바일 GNB — Pencil MaOi1 (56px, #FFFFFF) ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{
          height: 56,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Link
          href="/"
          style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#1A1A1A' }}
        >
          MASTERARTISAN
        </Link>
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="메뉴"
          style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {/* Lucide menu icon (SVG inline) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── 모바일 메뉴 오버레이 — Pencil M/GNB Menu Open (Uo56a) ── */}
      <div
        className="fixed inset-0 z-[60] md:hidden flex flex-col"
        style={{
          backgroundColor: '#FFFFFF',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* TopBar */}
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            borderBottom: '1px solid #E8E8E8',
            flexShrink: 0,
          }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#1A1A1A' }}
          >
            MASTERARTISAN
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="닫기"
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/* Lucide X icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* NavLinks */}
        <nav style={{ flex: 1, padding: '40px 24px 0', display: 'flex', flexDirection: 'column' }}>
          {navLinks.map((link, i) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '20px 0' }}
              >
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 32,
                    fontWeight: 300,
                    letterSpacing: 1,
                    color: pathname === link.href ? '#1A1A1A' : '#AAAAAA',
                    lineHeight: 1,
                  }}
                >
                  {link.label}
                </span>
              </Link>
              {i < navLinks.length - 1 && (
                <div style={{ height: 1, backgroundColor: '#E8E8E8' }} />
              )}
            </div>
          ))}
        </nav>

        {/* BottomArea */}
        <div style={{ padding: '0 24px 48px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: '#AAAAAA' }}>
            MASTERARTISAN
          </span>
          <span style={{ fontFamily: SANS, fontSize: 10, color: '#CCCCCC' }}>
            © {new Date().getFullYear()} MasterArtisan. All rights reserved.
          </span>
        </div>
      </div>
    </>
  );
}
