'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/masterartisan', label: 'MASTERARTISAN' },
  { href: '/history',      label: 'HISTORY' },
  { href: '/works',        label: 'WORKS' },
  { href: '/products',     label: 'PRODUCT' },
  { href: '/contact',      label: 'CONTACT' },
];

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const bg = !isHome
    ? 'rgba(250,250,248,0.97)'
    : scrolled || menuOpen ? 'rgba(10,9,8,0.92)' : 'transparent';

  const border = !isHome ? '#E4E0D8' : scrolled || menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent';
  const logoColor = !isHome ? '#1A1A1A' : '#FFFFFF';
  const linkColor = (active: boolean) =>
    !isHome ? (active ? '#1A1A1A' : '#888888') : (active ? '#FFFFFF' : 'rgba(255,255,255,0.55)');

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ backgroundColor: bg, borderBottom: `1px solid ${border}`, backdropFilter: scrolled ? 'blur(12px)' : 'none' }}
    >
      <div className="flex items-center justify-between h-[72px] px-12">
        <Link
          href="/"
          className="text-[14px] font-bold tracking-[0.2em] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-sans)', color: logoColor }}
        >
          MASTERARTISAN
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.18em] transition-opacity duration-300 hover:opacity-100"
              style={{ fontFamily: 'var(--font-sans)', color: linkColor(pathname === link.href), opacity: pathname === link.href ? 1 : 0.7 }}
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
              className="text-[11px] tracking-[0.18em] py-1 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-sans)', color: linkColor(pathname === link.href) }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
