import { masterartisanData, masterartisanHeroImage } from '@/data/masterartisan';
import ScrollReveal from '@/components/ui/ScrollReveal';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

export default function MasterArtisanPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingTop: 72 }}>
      {/* ── Page Hero ── */}
      <section style={{ position: 'relative', height: 360, overflow: 'hidden' }}>
        <img src={masterartisanHeroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)',
          }}
        />
        <div
          className="absolute"
          style={{ left: 80, top: 220, display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '4px', color: 'rgba(255,255,255,0.6)' }}>
            THE ARTISANS
          </span>
          <h1 style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 300, lineHeight: 1.2, color: '#FFFFFF' }}>
            장인을 소개합니다
          </h1>
        </div>
      </section>

      {/* ── Generation sections ── */}
      {masterartisanData.map((artisan, idx) => {
        const reversed = idx % 2 === 1;
        const bg = idx % 2 === 0 ? '#FFFFFF' : '#F7F6F3';
        return (
          <section key={artisan.generation} style={{ backgroundColor: bg }}>
            <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              {/* Image */}
              <div
                className="w-full md:w-[600px] md:flex-shrink-0 overflow-hidden"
                style={{ height: 520, backgroundColor: '#EDEAE4' }}
              >
                <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
              </div>

              {/* Text */}
              <ScrollReveal
                direction={reversed ? 'left' : 'right'}
                className="flex-1 flex flex-col"
                style={{ padding: '72px 80px' }}
              >
                <div className="flex flex-col gap-6">
                  <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '3px', color: '#AAAAAA' }}>
                    {artisan.generationEn}
                  </span>
                  <h2 style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 300, lineHeight: '63px', color: '#1A1A1A' }}>
                    {artisan.name} {artisan.title}
                  </h2>
                  <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '1px', color: '#AAAAAA' }}>
                    {artisan.role}
                  </span>
                  <div style={{ width: 32, height: 1, backgroundColor: '#CCCCCC' }} />
                  <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.9, color: '#555555', maxWidth: 680 }}>
                    {artisan.description}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </section>
        );
      })}

      {/* ── Certification ── */}
      <section
        style={{ backgroundColor: '#0d0c0a', padding: '80px 0' }}
        className="flex flex-col items-center text-center"
      >
        <ScrollReveal className="flex flex-col items-center" style={{ maxWidth: 600 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '4px', color: '#666666' }}>
            OFFICIAL CERTIFICATION
          </span>
          <h3 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 300, color: '#FFFFFF', marginTop: 24 }}>
            경기무형문화재 제36호
          </h3>
          <div style={{ width: 40, height: 1, backgroundColor: '#444444', margin: '24px 0' }} />
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.9, color: '#888888' }}>
            경기도가 지정한 무형문화재 제36호로서, 전통건축 기술의 공식 보유자로 인정받았습니다.
            <br />
            수백 년을 이어온 전통 목구조 건축 기법을 현대에 전승하는 책임을 다하고 있습니다.
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
