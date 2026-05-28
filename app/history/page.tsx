import { historyData } from '@/data/history';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function HistoryPage() {
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
          en="Our History"
          kr="가문의 역사"
          description="1960년대 창업부터 현재까지, 3대에 걸쳐 이어온 전통건축의 발자취입니다."
          centered
        />
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* 중앙 세로선 */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{ backgroundColor: 'var(--color-border)', transform: 'translateX(-50%)' }}
            />

            <div className="flex flex-col gap-0">
              {historyData.map((item, idx) => (
                <ScrollReveal key={item.year} direction={idx % 2 === 0 ? 'left' : 'right'} delay={0.05}>
                  <div
                    className={`relative flex flex-col md:flex-row gap-8 pb-16 ${
                      idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* 콘텐츠 박스 */}
                    <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                      <div
                        className="inline-block p-6"
                        style={{
                          backgroundColor: item.highlight ? 'var(--color-bg-subtle)' : 'var(--color-bg-elevated)',
                          border: item.highlight
                            ? '1px solid var(--color-timber-400)'
                            : '1px solid var(--color-border)',
                        }}
                      >
                        <p
                          className="text-2xl font-bold mb-2"
                          style={{
                            color: item.highlight ? 'var(--color-timber-200)' : 'var(--color-accent)',
                            fontFamily: 'var(--font-en-serif)',
                          }}
                        >
                          {item.year}
                        </p>
                        <p
                          className="text-lg font-semibold mb-3"
                          style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
                        >
                          {item.title}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* 중앙 점 */}
                    <div className="hidden md:flex items-start justify-center flex-shrink-0 pt-6">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: item.highlight ? 'var(--color-timber-200)' : 'var(--color-timber-400)',
                          border: '2px solid var(--color-bg-base)',
                          outline: `2px solid ${item.highlight ? 'var(--color-timber-400)' : 'var(--color-border)'}`,
                        }}
                      />
                    </div>

                    {/* 반대편 공간 */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}