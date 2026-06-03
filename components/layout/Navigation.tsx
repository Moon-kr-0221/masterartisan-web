'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { href: '/',              label: 'HOME',          num: '01' },
  { href: '/masterartisan', label: 'MASTERARTISAN', num: '02' },
  { href: '/history',       label: 'HISTORY',       num: '03' },
  { href: '/works',         label: 'WORKS',         num: '04' },
  { href: '/contact',       label: 'CONTACT',       num: '05' },
];

const desktopLinks = navLinks.slice(1); // 데스크탑은 HOME 제외 (d933990 동일)

const REVEAL_ZONE = 124;
const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [visible, setVisible]     = useState(true);
  const mouseNearTop               = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 80);
      const atBottom = current + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (current <= 80 || mouseNearTop.current || atBottom) setVisible(true);
      else setVisible(false);
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
    window.addEventListener('scroll',    onScroll,    { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const shown = visible || menuOpen;
    document.documentElement.style.setProperty('--nav-h', shown ? '72px' : '0px');
  }, [visible, menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ── 데스크탑 스타일 (d933990 완전 동일) ──
  const bg = !isHome
    ? 'rgba(250,250,248,0.97)'
    : scrolled || menuOpen ? 'rgba(10,9,8,0.92)' : 'transparent';
  const border     = !isHome ? '#E8E8E8' : scrolled || menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent';
  const logoColor  = !isHome ? '#1A1A1A' : '#FFFFFF';
  const linkColor  = (active: boolean) =>
    !isHome ? (active ? '#1A1A1A' : '#888888') : (active ? '#FFFFFF' : 'rgba(255,255,255,0.55)');
  const show = visible || menuOpen;

  return (
    <>
      {/* ── 데스크탑 NAV — d933990 완전 동일 ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
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
          <Link href="/" className="font-bold transition-colors duration-300"
            style={{ fontFamily: SANS, fontSize: '16px', letterSpacing: '2px', color: logoColor }}>
            MASTERARTISAN
          </Link>
          <nav className="flex items-center gap-[44px]">
            {desktopLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="transition-colors duration-300 hover:opacity-70"
                style={{ fontFamily: SANS, fontSize: '11px', letterSpacing: '1.5px', color: linkColor(pathname === link.href) }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ── 모바일 GNB — Pencil MaOi1 (56px, #FFFFFF) ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{ height: 56, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}
      >
        <Link href="/" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#1A1A1A' }}>
          MASTERARTISAN
        </Link>
        <button onClick={() => setMenuOpen(v => !v)} aria-label="메뉴"
          style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </header>

      {/* ── 모바일 메뉴 오버레이 — Pencil C1p67R / d933990 mobile/home.html ── */}
      {/* 배경: #0D0C0A, 아래서 위로 슬라이드, ease-[cubic-bezier(0.22,1,0.36,1)] */}
      <div
        className="fixed inset-0 z-[60] md:hidden flex flex-col overflow-y-auto"
        style={{
          backgroundColor: '#0D0C0A',
          color: '#FFFFFF',
          transform: menuOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* TopBar */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>MASTERARTISAN</span>
          <button onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기"
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
            </svg>
          </button>
        </div>

        {/* NavLinks */}
        <ul style={{ flex: 1, listStyle: 'none', margin: 0, padding: '16px 24px 0' }}>
          {navLinks.map((link, i) => (
            <li key={link.href} style={{ borderBottom: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <Link href={link.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '24px 0', textDecoration: 'none' }}>
                <span style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 300, color: '#FFFFFF' }}>
                  {link.label}
                </span>
                <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, color: '#C4A882' }}>
                  {link.num}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* 하단 설명 */}
        <p style={{ padding: '16px 24px 48px', fontFamily: SANS, fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.4)' }}>
          전통건축에 관한 문의나 방문을 환영합니다.<br />경기무형문화재 제36호.
        </p>
      </div>
    </>
  );
}
