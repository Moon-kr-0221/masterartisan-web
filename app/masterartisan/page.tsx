import { masterartisanHeroImage, masterartisanHeroImageMobile } from '@/data/masterartisan';
import { getArtisans } from '@/lib/data/queries';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { SERIF, SANS, C } from '@/lib/tokens';

export default async function MasterArtisanPage() {
  const masterartisanData = await getArtisans();
  return (
    <div style={{ backgroundColor: C.canvas }}>

      {/* ══ 데스크탑 — d933990 완전 동일 ══ */}
      <div className="hidden md:block" style={{ paddingTop: 72 }}>
        {/* Page Hero */}
        <section className="relative overflow-hidden" style={{ height: 360 }}>
          <img src={masterartisanHeroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)' }} />
          <div className="absolute" style={{ left: 80, top: 152, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.6)' }}>THE ARTISANS</span>
            <h1 style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 300, lineHeight: 1.2, color: C.canvas }}>장인을 소개합니다</h1>
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>1936년부터 3대에 걸쳐 전통건축의 혼을 이어온 장인들을 소개합니다.</p>
          </div>
        </section>

        {/* Generation sections */}
        {masterartisanData.map((artisan, idx) => {
          const reversed = idx % 2 === 1;
          const bg = idx % 2 === 0 ? C.canvas : C.surface;
          return (
            <section key={artisan.generation} style={{ backgroundColor: bg }}>
              <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                <div className="w-full md:w-[600px] md:flex-shrink-0 overflow-hidden" style={{ height: 520, backgroundColor: C.imageBg }}>
                  <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                </div>
                <ScrollReveal direction={reversed ? 'left' : 'right'} className="flex-1 flex flex-col" style={{ padding: '72px 80px' }}>
                  <div className="flex flex-col gap-6">
                    <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '3px', color: C.muted }}>{artisan.generationEn}</span>
                    <h2 style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 300, lineHeight: '63px', color: C.ink }}>{artisan.name} {artisan.title}</h2>
                    <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '1px', color: C.muted }}>{artisan.role}</span>
                    <div style={{ width: 32, height: 1, backgroundColor: C.rule }} />
                    <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.9, color: C.inkSoft, maxWidth: 680 }}>{artisan.description}</p>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          );
        })}

        {/* Certification */}
        <section style={{ backgroundColor: C.dark, padding: '80px 0' }} className="flex flex-col items-center text-center">
          <ScrollReveal className="flex flex-col items-center" style={{ maxWidth: 600 }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '4px', color: C.darkMuted }}>OFFICIAL CERTIFICATION</span>
            <h3 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 300, color: C.canvas, marginTop: 24 }}>경기무형문화재 제36호</h3>
            <div style={{ width: 40, height: 1, backgroundColor: C.darkDivider, margin: '24px 0' }} />
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.9, color: C.darkMuted }}>
              경기도가 지정한 무형문화재 제36호로서, 전통건축 기술의 공식 보유자로 인정받았습니다.<br />
              수백 년을 이어온 전통 목구조 건축 기법을 현대에 전승하는 책임을 다하고 있습니다.
            </p>
          </ScrollReveal>
        </section>
      </div>

      {/* ══ 모바일 — Pencil AxVs1 / d933990 mobile ══ */}
      <div className="md:hidden" style={{ paddingTop: 56 }}>

        {/* Page Hero — 300px, 이미지+스크림, 텍스트 하단 */}
        <section className="relative overflow-hidden" style={{ height: 300, backgroundColor: C.dark }}>
          <img src={masterartisanHeroImageMobile} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute" style={{ top: 150, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.6)' }}>THE ARTISANS</span>
            <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, lineHeight: 1.2, color: C.canvas }}>삼대의 장인</h1>
            <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>1936년부터 3대에 걸쳐 전통건축의 혼을 이어온 장인들을 소개합니다.</p>
          </div>
        </section>

        {/* Generation sections — 이미지 상단 320px + 텍스트 하단 */}
        {masterartisanData.map((artisan, idx) => {
          const bg = idx % 2 === 0 ? C.canvas : C.surface;
          return (
            <section key={artisan.generation} style={{ backgroundColor: bg }}>
              <img src={artisan.image} alt={artisan.name} style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 3, color: C.muted }}>{artisan.generationEn}</span>
                <h2 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: C.ink }}>{artisan.name} {artisan.title}</h2>
                <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: 1, color: C.muted }}>{artisan.role}</span>
                <div style={{ width: 32, height: 1, backgroundColor: C.rule }} />
                <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: C.inkSoft }}>{artisan.description}</p>
              </div>
            </section>
          );
        })}

        {/* Certification — dark, padding [64,24], 중앙 정렬 */}
        <section className="flex flex-col items-center text-center" style={{ backgroundColor: C.dark, padding: '64px 24px', gap: 24 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 4, color: C.darkMuted }}>OFFICIAL CERTIFICATION</span>
          <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: C.canvas }}>경기무형문화재 제36호</h3>
          <div style={{ width: 40, height: 1, backgroundColor: C.darkDivider }} />
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.9, color: C.darkMuted }}>
            경기도가 지정한 무형문화재 제36호로서, 전통건축 기술의 공식 보유자로 인정받았습니다. 수백 년을 이어온 전통 목구조 건축 기법을 현대에 전승하는 책임을 다하고 있습니다.
          </p>
        </section>

      </div>
    </div>
  );
}
