import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111111' }}>
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 px-12 py-16">
        <div className="flex flex-col gap-4">
          <p className="text-[14px] font-bold tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-sans)', color: '#FFFFFF' }}>
            MASTERARTISAN
          </p>
          <p className="text-[12px] leading-[1.8]"
            style={{ fontFamily: 'var(--font-sans)', color: '#555555', maxWidth: '200px' }}>
            경기무형문화재 제36호<br />3대를 이은 전통건축의 장인
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[9px] tracking-[0.35em] mb-1"
            style={{ fontFamily: 'var(--font-sans)', color: '#555555' }}>
            NAVIGATION
          </p>
          {[
            { href: '/masterartisan', label: 'MASTERARTISAN' },
            { href: '/history',      label: 'HISTORY' },
            { href: '/works',        label: 'WORKS' },
            { href: '/contact',      label: 'CONTACT' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="text-[11px] tracking-[0.1em] transition-opacity duration-300 hover:opacity-100"
              style={{ fontFamily: 'var(--font-sans)', color: '#777777', opacity: 0.8 }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[9px] tracking-[0.35em] mb-1"
            style={{ fontFamily: 'var(--font-sans)', color: '#555555' }}>
            CONTACT
          </p>
          <a href="tel:031-000-0000"
            className="text-[13px] transition-opacity hover:opacity-100"
            style={{ fontFamily: 'var(--font-sans)', color: '#888888' }}>
            031-000-0000
          </a>
          <a href="mailto:info@masterartisan.co.kr"
            className="text-[13px] transition-opacity hover:opacity-100"
            style={{ fontFamily: 'var(--font-sans)', color: '#888888' }}>
            info@masterartisan.co.kr
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-12 py-6"
        style={{ borderTop: '1px solid #222222' }}>
        <p className="text-[10px]" style={{ fontFamily: 'var(--font-sans)', color: '#444444' }}>
          © {new Date().getFullYear()} MasterArtisan. All rights reserved.
        </p>
        <p className="text-[10px]" style={{ fontFamily: 'var(--font-sans)', color: '#444444' }}>
          경기도 | 사업자등록번호: 000-00-00000
        </p>
      </div>
    </footer>
  );
}
