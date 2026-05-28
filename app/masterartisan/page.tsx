import { masterartisanData } from '@/data/masterartisan';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function MasterArtisanPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-base)' }} className="pt-20">
      {/* 페이지 헤더 */}
      <section
        className="py-24 px-6 md:px-12 text-center"
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: 'linear-gradient(to bottom, var(--color-bg-elevated), var(--color-bg-base))',
        }}
      >
        <SectionTitle
          en="The Artisans"
          kr="장인을 소개합니다"
          description="3대에 걸쳐 전통건축의 기술과 혼을 이어온 장인 가문의 이야기입니다."
          centered
        />
      </section>

      {/* 장인 소개 */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
          {masterartisanData.map((artisan, idx) => (
            <ScrollReveal key={artisan.generation} direction={idx % 2 === 0 ? 'left' : 'right'}>
              <div
                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
              >
                {/* 이미지 */}
                <div className="flex-shrink-0 w-full md:w-80">
                  <div
                    className="w-full aspect-square"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-kr-serif)', fontSize: '4rem' }}>
                      {artisan.generationKr}
                    </p>
                  </div>
                </div>

                {/* 텍스트 */}
                <div className="flex flex-col gap-6 flex-1">
                  <p
                    className="text-xs tracking-[0.4em] uppercase"
                    style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
                  >
                    {artisan.generationEn}
                  </p>
                  <h2
                    className="text-4xl md:text-5xl font-bold"
                    style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
                  >
                    {artisan.name}
                  </h2>
                  <p
                    className="text-sm tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {artisan.period}
                  </p>
                  <div
                    className="w-12 h-px"
                    style={{ backgroundColor: 'var(--color-timber-400)' }}
                  />
                  <p
                    className="text-lg leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {artisan.description}
                  </p>
                  <ul className="flex flex-col gap-3 mt-2">
                    {artisan.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-3">
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 인증 섹션 */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ backgroundColor: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p
              className="text-xs tracking-[0.4em] uppercase mb-6"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
            >
              Official Certification
            </p>
            <h3
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
            >
              경기무형문화재 제36호
            </h3>
            <div
              className="w-16 h-px mx-auto mb-8"
              style={{ backgroundColor: 'var(--color-timber-400)' }}
            />
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              경기도가 지정한 무형문화재 제36호로서, 전통건축 기술의 공식 보유자로 인정받았습니다.
              <br />
              수백 년을 이어온 전통 목구조 건축 기법을 현대에 전승하는 책임을 다하고 있습니다.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}