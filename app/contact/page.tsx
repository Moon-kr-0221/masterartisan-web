import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-base)' }} className="pt-20">
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

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* 연락처 정보 */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-10">
              <div>
                <p
                  className="text-xs tracking-[0.3em] uppercase mb-6"
                  style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
                >
                  Contact Information
                </p>
                <div className="flex flex-col gap-8">
                  {[
                    {
                      label: '전화',
                      value: '031-000-0000',
                      href: 'tel:031-000-0000',
                    },
                    {
                      label: '이메일',
                      value: 'info@masterartisan.co.kr',
                      href: 'mailto:info@masterartisan.co.kr',
                    },
                    {
                      label: '주소',
                      value: '경기도 ○○시 ○○구 ○○로 000',
                      href: null,
                    },
                    {
                      label: '운영시간',
                      value: '평일 09:00 – 18:00\n토요일 09:00 – 13:00 (일/공휴일 휴무)',
                      href: null,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p
                        className="text-xs tracking-widest mb-2"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-lg transition-colors duration-300 hover:opacity-80"
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

              {/* 인증 안내 */}
              <div
                className="p-6"
                style={{
                  border: '1px solid var(--color-timber-400)',
                  backgroundColor: 'var(--color-bg-elevated)',
                }}
              >
                <p
                  className="text-sm font-bold mb-2"
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

          {/* 지도 */}
          <ScrollReveal direction="right">
            <div
              className="w-full h-96 md:h-full min-h-80 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* 카카오맵 iframe — 실제 주소로 교체 필요 */}
              <p style={{ color: 'var(--color-text-muted)' }}>지도 (실제 주소 입력 후 카카오맵 embed)</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}