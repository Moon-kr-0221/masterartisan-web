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

// 네비 표시를 유지하는 상단 감지 영역.
// 네비(72px) + 히스토리 TabBar(약 48px)를 포함해야 연도 탭을 클릭할 수 있다.
const REVEAL_ZONE = 124;

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

      // 페이지 바닥(또는 근처)에 도달하면 더 내려갈 곳이 없으므로 네비를 항상 표시
      const atBottom =
        current + window.innerHeight >= document.documentElement.scrollHeight - 8;

      // 네비는 최상단 / 마우스 상단 / 페이지 바닥에서만 표시.
      // 스크롤만으로는 자동으로 다시 내려오지 않는다 (마우스를 상단으로 올려야 함).
      if (current <= 80 || mouseNearTop.current || atBottom) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      // 감지 영역(네비 + TabBar) 안에 있으면 네비·TabBar를 함께 표시 유지 → 연도 탭 클릭 가능
      if (e.clientY < REVEAL_ZONE) {
        mouseNearTop.current = true;
        setVisible(true);
      } else {
        mouseNearTop.current = false;
        // 감지 영역을 벗어났고 이미 스크롤된 상태면 다시 숨긴다
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

  // 네비의 표시 높이를 CSS 변수로 노출 → 히스토리 TabBar가 네비와 묶여 함께 이동
  useEffect(() => {
    const shown = visible || menuOpen;
    document.documentElement.style.setProperty('--nav-h', shown ? '72px' : '0px');
  }, [visible, menuOpen]);

  const bg = !isHome
    ? 'rgba(250,250,248,0.97)'
    : scrolled || menuOpen ? 'rgba(10,9,8,0.92)' : 'transparent';

  const border = !isHome ? '#E8E8E8' : scrolled || menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent';
  const logoColor = !isHome ? '#1A1A1A' : '#FFFFFF';
  const linkColor = (active: boolean) =>
    !isHome ? (active ? '#1A1A1A' : '#888888') : (active ? '#FFFFFF' : 'rgba(255,255,255,0.55)');

  const show = visible || menuOpen;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
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
          style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', letterSpacing: '2px', color: logoColor }}
        >
          MASTERARTISAN
        </Link>

        <nav className="hidden md:flex items-center gap-[44px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 hover:opacity-70"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '1.5px', color: linkColor(pathname === link.href) }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="메뉴"
        >
          {[0, 1, 2].map(i => (
            <span key={i} className="block w-5 h-px transition-all duration-300" style={{
              backgroundColor: logoColor,
              opacity: i === 1 && menuOpen ? 0 : 1,
              transform: i === 0 && menuOpen ? 'translateY(6px) rotate(45deg)' : i === 2 && menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }} />
          ))}
        </button>
      </div>

      <div className="md:hidden overflow-hidden transition-all duration-500" style={{ maxHeight: menuOpen ? '320px' : '0' }}>
        <nav className="flex flex-col px-12 pb-8 gap-5" style={{ borderTop: `1px solid ${border}` }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="py-1 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '1.5px', color: linkColor(pathname === link.href) }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
