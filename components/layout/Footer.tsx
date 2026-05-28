import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="py-16 px-6 md:px-12"
      style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <p
              className="text-2xl font-bold tracking-widest mb-3"
              style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-en-serif)' }}
            >
              MASTERARTISAN
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              경기무형문화재 제36호
              <br />
              3대를 이은 전통건축의 장인
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
              NAVIGATION
            </p>
            {[
              { href: '/masterartisan', label: 'MASTERARTISAN' },
              { href: '/history', label: 'HISTORY' },
              { href: '/works', label: 'WORKS' },
              { href: '/products', label: 'PRODUCT' },
              { href: '/contact', label: 'CONTACT' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest transition-colors duration-300 hover:opacity-100"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
              CONTACT
            </p>
            <a
              href="tel:031-000-0000"
              className="text-sm transition-colors duration-300"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              031-000-0000
            </a>
            <a
              href="mailto:info@masterartisan.co.kr"
              className="text-sm transition-colors duration-300"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              info@masterartisan.co.kr
            </a>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} MasterArtisan. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            경기도 | 사업자등록번호: 000-00-00000
          </p>
        </div>
      </div>
    </footer>
  );
}