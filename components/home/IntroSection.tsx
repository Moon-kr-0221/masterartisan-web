import Link from 'next/link';
import ScrollReveal from '../ui/ScrollReveal';

const features = [
  { label: '유지보수', desc: '전통 건축물의 정기적 점검과 보수로 원형을 보전합니다.' },
  { label: '수리', desc: '손상된 전통 건축물을 원형에 충실하게 복원합니다.' },
  { label: '제작', desc: '전통 목구조 기법으로 새로운 건축물과 부재를 제작합니다.' },
];

export default function IntroSection() {
  return (
    <section
      className="py-32 px-6 md:px-12"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* 인증 배지 */}
        <ScrollReveal>
          <div className="flex justify-center mb-20">
            <div
              className="inline-flex flex-col items-center gap-3 px-10 py-6"
              style={{ border: '1px solid var(--color-timber-400)' }}
            >
              <p
                className="text-xs tracking-[0.4em] uppercase"
                style={{ color: 'var(--color-accent)' }}
              >
                Gyeonggi Intangible Cultural Heritage No.36
              </p>
              <p
                className="text-xl font-bold tracking-widest"
                style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
              >
                경기무형문화재 제36호
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 소개 텍스트 */}
        <ScrollReveal delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-24">
            <p
              className="text-2xl md:text-3xl leading-relaxed font-medium"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-kr-serif)' }}
            >
              "나무의 결을 읽고, 세월의 흔적을 존중하며,
              <br />
              전통의 기술로 미래를 짓습니다."
            </p>
          </div>
        </ScrollReveal>

        {/* 3가지 전문 분야 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
          {features.map((f, i) => (
            <ScrollReveal key={f.label} delay={i * 0.15}>
              <div
                className="p-10 flex flex-col gap-4"
                style={{ backgroundColor: 'var(--color-bg-base)' }}
              >
                <p
                  className="text-xs tracking-[0.3em] uppercase"
                  style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
                >
                  {f.label}
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {f.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.2}>
          <div className="text-center mt-20">
            <Link
              href="/history"
              className="inline-block text-sm tracking-[0.3em] pb-1 transition-all duration-300"
              style={{
                color: 'var(--color-timber-200)',
                borderBottom: '1px solid var(--color-timber-400)',
                fontFamily: 'var(--font-en-serif)',
              }}
            >
              VIEW OUR HISTORY →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}