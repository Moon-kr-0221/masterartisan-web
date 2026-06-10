'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/admin/actions';
import { ADMIN } from '@/components/admin/ui';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

const links = [
  { href: '/admin', label: '대시보드', exact: true },
  { href: '/admin/artisans', label: '장인 소개' },
  { href: '/admin/works', label: '작업 사례' },
  { href: '/admin/history', label: '연혁' },
  { href: '/admin/contact', label: '연락처' },
  { href: '/admin/hero', label: '이미지 관리' },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside style={{ width: 220, flexShrink: 0, minHeight: '100vh',
      borderRight: `1px solid ${ADMIN.hairline}`, backgroundColor: '#FFFFFF',
      position: 'sticky', top: 0, alignSelf: 'flex-start',
      display: 'flex', flexDirection: 'column', padding: '32px 0' }}>
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{ fontFamily: SANS, fontSize: 9, letterSpacing: '0.3em',
          color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 8 }}>
          MASTERARTISAN
        </p>
        <p style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: ADMIN.ink }}>
          관리자
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname?.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href}
              style={{ fontFamily: SANS, fontSize: 13, padding: '12px 24px',
                color: active ? ADMIN.ink : ADMIN.inkSoft,
                fontWeight: active ? 600 : 400,
                borderLeft: active ? `2px solid ${ADMIN.ink}` : '2px solid transparent',
                backgroundColor: active ? ADMIN.surface : 'transparent',
                textDecoration: 'none', transition: 'background-color 0.2s' }}>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '20px 24px 0', borderTop: `1px solid ${ADMIN.hairline}`, marginTop: 20 }}>
        <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, marginBottom: 12,
          wordBreak: 'break-all', lineHeight: 1.5 }}>
          {email}
        </p>
        <form action={signOut}>
          <button type="submit" style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.06em',
            color: ADMIN.inkSoft, border: `1px solid ${ADMIN.hairline}`, borderRadius: 0,
            padding: '8px 16px', backgroundColor: '#FFFFFF', cursor: 'pointer', width: '100%' }}>
            로그아웃
          </button>
        </form>
        <Link href="/" style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted,
          textDecoration: 'none', display: 'block', marginTop: 12 }}>
          ← 사이트로 돌아가기
        </Link>
      </div>
    </aside>
  );
}
