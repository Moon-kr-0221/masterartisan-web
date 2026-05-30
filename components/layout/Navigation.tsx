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

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mouseNearTop = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const goingDown = current > lastScrollY.current;
      setScrolled(current > 80);
      if (!mouseNearTop.current) {
        setVisible(!goingDown || current <= 80);
      }
      lastScrollY.current = current;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 72) {
        mouseNearTop.current = true;
        setVisible(true);
      } else {
        mouseNearTop.current = false;
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
