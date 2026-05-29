import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/ui/ScrollReveal';

const LOCATIONS = [
  {
    type: '사무실',
    typeEn: 'Office',
    address: '경기도 ○○시 ○○구 ○○로 000',
    detail: '○○빌딩 3층',
    // 네이버 지도 → 해당 장소 검색 → 공유 → 지도 퍼가기 → iframe src 복붙
    mapSrc: '',
  },
  {
    type: '공장',
    typeEn: 'Workshop',
    address: '경기도 ○○시 ○○구 ○○로 000',
    detail: '전통건축 목공장',
    mapSrc: '',
  },
];

const CONTACTS = [
  { label: '전화', value: '031-000-0000', href: 'tel:031-000-0000' },
  { label: '이메일', value: 'info@masterartisan.co.kr', href: 'mailto:info@masterartisan.co.kr' },
  { label: '운영시간', value: '평일 09:00 – 18:00\n토요일 09:00 – 13:00 (일·공휴일 휴무)', href: null },
];

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-base)' }} className="pt-20">

      {/* ── 히어로 ── */}
      <section
        className="py-24 px-6 md:px-12 text-center"
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: 'linear-gradient(to bottom, var(--color-bg-elevated), var(--color-bg-base))',
        }}
      >
        <SectionTitle
          en="Contact"
          kr="찾아오시는 길"
          description="전통건축에 관한 문의나 방문을 환영합니다."
          centered
        />
      </section>

      {/* ── 공유 연락처 ── */}
      <section className="py-20 px-6 md:px-12" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* 연락처 정보 */}
          <ScrollReveal direction="left">
            <div>
              <p
                className="text-xs tracking-[0.3em] uppercase mb-6"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
              >
                Contact Information
              </p>
              <div className="flex flex-col gap-8">
                {CONTACTS.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-lg transition-opacity duration-300 hover:opacity-70"
                        style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-kr-serif)' }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        className="text-base leading-relaxed whitespace-pre-line"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* 인증 안내 */}
          <ScrollReveal direction="right">
            <div className="flex items-center h-full">
              <div
                className="p-8 w-full"
                style={{
                  border: '1px solid var(--color-timber-400)',
                  backgroundColor: 'var(--color-bg-elevated)',
                }}
              >
                <p
                  className="text-xs tracking-[0.25em] uppercase mb-4"
                  style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
                >
                  Certification
                </p>
                <p
                  className="text-xl mb-3"
                  style={{ color: 'var(--color-timber-200)', fontFamily: 'var(--font-kr-serif)' }}
                >
                  경기무형문화재 제36호
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  전통건축 유지보수·수리·제작에 관한 모든 문의를 환영합니다.
                  <br />
                  방문 전 사전 연락을 부탁드립니다.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 사업장 지도 2개 ── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          <ScrollReveal>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-12"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
            >
              Locations
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {LOCATIONS.map((loc, i) => (
              <ScrollReveal key={loc.type} direction={i === 0 ? 'left' : 'right'}>
                <div className="flex flex-col gap-5">

                  {/* 사업장 헤더 */}
                  <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span
                        className="text-2xl"
                        style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-kr-serif)' }}
                      >
                        {loc.type}
                      </span>
                      <span
                        className="text-xs tracking-[0.2em] uppercase"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {loc.typeEn}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {loc.address}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      {loc.detail}
                    </p>
                  </div>

                  {/* 지도 */}
                  <div
                    className="w-full overflow-hidden"
                    style={{
                      height: '340px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-elevated)',
                    }}
                  >
                    {loc.mapSrc ? (
                      <iframe
                        src={loc.mapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                        title={`${loc.type} 지도`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      /* 주소 확정 전 placeholder */
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                          stroke="var(--color-text-muted)" strokeWidth="1.2">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        <p className="text-xs text-center leading-relaxed"
                          style={{ color: 'var(--color-text-muted)' }}>
                          네이버 지도 embed<br />
                          (실제 주소 확정 후 교체)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
