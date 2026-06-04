'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SANS, SERIF, C } from '@/lib/tokens';

const NAV_LINKS = [
  { href: '/',              label: 'HOME',          num: '01' },
  { href: '/masterartisan', label: 'MASTERARTISAN', num: '02' },
  { href: '/history',       label: 'HISTORY',       num: '03' },
  { href: '/works',         label: 'WORKS',         num: '04' },
  { href: '/contact',       label: 'CONTACT',       num: '05' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Pencil C1p67R — M/GNB Menu Open
 * 배경 #0D0C0A, 아래서 위로 슬라이드, Noto Serif KR 30px 300, 번호 #C4A882
 * d933990 mobile/home.html 디자인 기준
 */
export default function MobileMenuOverlay({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <div
      className="fixed inset-0 z-[60] md:hidden flex flex-col overflow-y-auto"
      style={{
        backgroundColor: C.dark,
        color: C.canvas,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* TopBar — logo + X */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>
          MASTERARTISAN
        </span>
        <button
          onClick={onClose}
          aria-label="메뉴 닫기"
          style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.canvas} strokeWidth="1.5" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>
      </div>

      {/* NavLinks */}
      <ul style={{ flex: 1, listStyle: 'none', margin: 0, padding: '16px 24px 0' }}>
        {NAV_LINKS.map((link, i) => (
          <li
            key={link.href}
            style={{ borderBottom: i < NAV_LINKS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
          >
            <Link
              href={link.href}
              onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '24px 0', textDecoration: 'none' }}
            >
              <span style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 300, color: C.canvas }}>
                {link.label}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, color: C.gold }}>
                {link.num}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* 하단 설명 */}
      <p style={{ padding: '16px 24px 48px', fontFamily: SANS, fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
        전통건축에 관한 문의나 방문을 환영합니다.<br />경기무형문화재 제36호.
      </p>
    </div>
  );
}
