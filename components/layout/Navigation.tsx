'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/masterartisan', label: 'MASTERARTISAN' },
  { href: '/history', label: 'HISTORY' },
  { href: '/works', label: 'WORKS' },
  { href: '/products', label: 'PRODUCT' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
      style={{
        backgroundColor: scrolled || menuOpen ? 'rgba(13,11,8,0.95)' : 'transparent',
        borderBottom: scrolled || menuOpen ? '1px solid var(--color-border)' : 'none',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link
          href="/"
          className="text-xl font-bold tracking-widest transition-colors duration-300"
          style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-en-serif)' }}
        >
          MASTERARTISAN
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.2em] transition-colors duration-300"
              style={{
                color: pathname === link.href ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-kr-sans)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              backgroundColor: 'var(--color-timber-100)',
              transform: menuOpen ? 'translateY(5px) rotate(45deg)' : '',
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              backgroundColor: 'var(--color-timber-100)',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              backgroundColor: 'var(--color-timber-100)',
              transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : '',
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden transition-all duration-500 overflow-hidden"
        style={{ maxHeight: menuOpen ? '400px' : '0' }}
      >
        <nav
          className="flex flex-col px-6 pb-8 gap-6"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-[0.2em] py-2 transition-colors duration-300"
              style={{
                color: pathname === link.href ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-kr-sans)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}