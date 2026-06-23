'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import MobileGNB from './MobileGNB';
import MobileMenuOverlay from './MobileMenuOverlay';
import { SANS, LOGO_FONT, C } from '@/lib/tokens';

const desktopLinks = [
  { href: '/masterartisan', label: 'MASTERARTISAN' },
  { href: '/history',       label: 'HISTORY' },
  { href: '/works',         label: 'WORKS' },
  { href: '/contact',       label: 'CONTACT' },
];

const REVEAL_ZONE = 124;

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [visible,   setVisible]   = useState(true);
  const mouseNearTop = useRef(false);

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
    const isMobileView = window.innerWidth < 768;
    if (isMobileView) {
      document.documentElement.style.setProperty('--nav-h', '56px');
    } else {
      const shown = visible || menuOpen;
      document.documentElement.style.setProperty('--nav-h', shown ? '72px' : '0px');
    }
  }, [visible, menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ── 데스크탑 스타일 (d933990 완전 동일) ──
  const bg = !isHome
    ? 'rgba(250,250,248,0.97)'
    : scrolled || menuOpen ? 'rgba(10,9,8,0.92)' : 'transparent';
  const border    = !isHome ? C.hairline : scrolled || menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent';
  const logoColor = !isHome ? C.ink : C.canvas;
  const linkColor = (active: boolean) =>
    !isHome ? (active ? C.ink : C.darkMuted) : (active ? C.canvas : 'rgba(255,255,255,0.55)');
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
          <Link
            href="/"
            className="font-bold transition-colors duration-300"
            style={{ fontFamily: LOGO_FONT, fontSize: '28px', color: logoColor }}
          >
            KCHI
          </Link>
          <nav className="flex items-center gap-[44px]">
            {desktopLinks.map((link) => (
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

      {/* ── 모바일 GNB (MaOi1) + 메뉴 오버레이 (C1p67R) ── */}
      <MobileGNB onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
