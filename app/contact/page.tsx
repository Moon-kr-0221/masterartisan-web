import ScrollReveal from '@/components/ui/ScrollReveal';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

// Banner mirrors the Pencil CONTACT PageHero (height 360 + image + light scrim)
const BANNER_IMG = 'https://images.unsplash.com/photo-1772331274809-4a6ad75c9947?auto=format&fit=crop&w=1600&q=80';
const BANNER_SCRIM = 'linear-gradient(180deg, rgba(247,246,243,0.55) 0%, rgba(247,246,243,0.3) 45%, rgba(247,246,243,0.95) 100%)';

const LEFT_ITEMS = [
  { label: '전화', value: '031-000-0000', href: 'tel:031-000-0000' },
  { label: '이메일', value: 'info@masterartisan.co.kr', href: 'mailto:info@masterartisan.co.kr' },
  { label: '주소', value: '경기도 ○○시 ○○구 ○○로 000', href: null },
];

const LOCATIONS = [
  { type: '사무실', typeEn: 'Office', address: '경기도 ○○시 ○○구 ○○로 000', detail: '○○빌딩 3층' },
  { type: '공장', typeEn: 'Workshop', address: '경기도 ○○시 ○○구 ○○로 000', detail: '전통건축 목공장' },
];

function InfoRow({ label, value, href }: { label: string; value: string; href: string | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 22, borderBottom: '1px solid #EAE7E1' }}>
      <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', color: '#AAAAAA' }}>{label}</span>
      {href ? (
        <a href={href} className="transition-opacity hover:opacity-70"
          style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: '#1A1A1A' }}>
          {value}
        </a>
      ) : (
        <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: '#1A1A1A', whiteSpace: 'pre-line' }}>
          {value}
        </span>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingTop: 72 }}>
      {/* ── Page Hero (generous padding under the nav) ── */}
      <section style={{ position: 'relative', height: 360, overflow: 'hidden', borderBottom: '1px solid #E8E8E8' }}>
        <img src={BANNER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: BANNER_SCRIM }} />
        <div className="absolute inset-0 flex flex-col justify-end gap-3" style={{ padding: '72px 80px' }}>
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: '#AAAAAA' }}>GET IN TOUCH</span>
          <h1 style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.1, color: '#1A1A1A' }}>찾아오시는 길</h1>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: '#888888' }}>
            전통건축에 관한 문의나 방문을 환영합니다.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFORMATION — centred 50:50 two-column ── */}
      <section style={{ padding: '80px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.3em', color: '#AAAAAA' }}>
            CONTACT INFORMATION
          </span>

          <div
            className="grid grid-cols-1 md:grid-cols-2 items-stretch"
            style={{ gap: 64, marginTop: 36 }}
          >
            {/* Left: 전화 / 이메일 / 주소 */}
            <ScrollReveal direction="left" className="flex flex-col" style={{ gap: 22 }}>
              {LEFT_ITEMS.map((it) => (
                <InfoRow key={it.label} {...it} />
              ))}
            </ScrollReveal>

            {/* Right: 운영시간 + cert box */}
            <ScrollReveal direction="right" className="flex flex-col" style={{ gap: 22 }}>
              <InfoRow label="운영시간" value={'평일 09:00 – 18:00\n토요일 09:00 – 13:00 (일·공휴일 휴무)'} href={null} />
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#F4EFE7',
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#1A1A1A' }}>
                  경기무형문화재 제36호
                </span>
                <span style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.8, color: '#666666', whiteSpace: 'pre-line' }}>
                  {'전통건축 유지보수·수리·제작에 관한 모든 문의를 환영합니다.\n방문 전 사전 연락을 부탁드립니다.'}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── LOCATIONS — 50:50 cards, wide 2:1 map areas ── */}
      <section style={{ padding: '0 80px 88px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.3em', color: '#8C6D3F' }}>LOCATIONS</span>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 32, marginTop: 28 }}>
            {LOCATIONS.map((loc) => (
              <div key={loc.type} style={{ border: '1px solid #ECE9E3' }}>
                <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4, borderBottom: '1px solid #ECE9E3' }}>
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <span style={{ fontFamily: SERIF, fontSize: 20, color: '#1A1A1A' }}>{loc.type}</span>
                    <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', color: '#AAAAAA' }}>{loc.typeEn}</span>
                  </div>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: '#555555' }}>{loc.address}</span>
                  <span style={{ fontFamily: SANS, fontSize: 10, color: '#AAAAAA' }}>{loc.detail}</span>
                </div>

                {/* Map placeholder — wide 2:1 rectangle, centred pin + text */}
                <div
                  style={{
                    aspectRatio: '2 / 1',
                    backgroundColor: '#E0E0E0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span style={{ fontFamily: SANS, fontSize: 11, lineHeight: 1.7, color: '#999999', textAlign: 'center' }}>
                    네이버 지도 embed<br />(주소 확정 후 교체)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
