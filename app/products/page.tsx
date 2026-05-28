import { productsData } from '@/data/products';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';

export default function ProductsPage() {
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
          en="Our Products"
          kr="제품 소개"
          description="전통 목구조 기법과 재료를 사용하여 제작된 대표 제품들입니다."
          centered
        />
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
            {productsData.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1}>
                <div
                  className="group flex flex-col"
                  style={{ backgroundColor: 'var(--color-bg-base)' }}
                >
                  {/* 이미지 */}
                  <div
                    className="aspect-video w-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                  >
                    <p
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-kr-serif)',
                        fontSize: '1.5rem',
                      }}
                    >
                      {product.name}
                    </p>
                  </div>

                  {/* 텍스트 */}
                  <div className="p-8 flex flex-col gap-4 flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3
                        className="text-2xl font-bold"
                        style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
                      >
                        {product.name}
                      </h3>
                      <span
                        className="text-sm"
                        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-en-serif)' }}
                      >
                        {product.nameHanja}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.materials.map((m) => (
                        <span
                          key={m}
                          className="px-3 py-1 text-xs"
                          style={{
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/contact"
                      className="mt-4 self-start text-xs tracking-[0.2em] pb-px transition-colors duration-300"
                      style={{
                        color: 'var(--color-accent)',
                        borderBottom: '1px solid var(--color-timber-400)',
                      }}
                    >
                      문의하기 →
                    </Link>
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