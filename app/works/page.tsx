'use client';

import { useState } from 'react';
import { worksData, categoryLabels, type WorkCategory } from '@/data/works';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/ui/ScrollReveal';

const categories: WorkCategory[] = ['all', 'maintenance', 'repair', 'fabrication'];

const PAGE_SIZE = 9;

export default function WorksPage() {
  const [active, setActive] = useState<WorkCategory>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<null | (typeof worksData)[0]>(null);

  const filtered = active === 'all' ? worksData : worksData.filter((w) => w.category === active);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  // 카테고리 바뀌면 visible 초기화
  const handleCategory = (cat: WorkCategory) => {
    setActive(cat);
    setVisible(PAGE_SIZE);
  };

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
          en="Our Works"
          kr="작업 사례"
          description="전통건축 유지보수·수리·제작에 걸친 대표 작업물을 소개합니다."
          centered
        />
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* 필터 */}
          <div className="flex flex-wrap gap-3 mb-16 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="px-6 py-2 text-xs tracking-[0.2em] transition-all duration-300"
                style={{
                  backgroundColor: active === cat ? 'var(--color-accent)' : 'transparent',
                  color: active === cat ? '#0D0B08' : 'var(--color-text-secondary)',
                  border: `1px solid ${active === cat ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  fontWeight: active === cat ? 700 : 400,
                }}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* 갤러리 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
            {shown.map((work, i) => (
              <ScrollReveal key={work.id} delay={i * 0.05}>
                <div
                  className="group relative aspect-square cursor-pointer overflow-hidden"
                  style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                  onClick={() => setLightbox(work)}
                >
                  {/* 플레이스홀더 이미지 */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-bg-subtle)' }}
                  >
                    <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-kr-serif)', fontSize: '1.5rem' }}>
                      {work.title}
                    </p>
                  </div>

                  {/* 호버 오버레이 */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(to top, rgba(13,11,8,0.95) 0%, transparent 60%)' }}
                  >
                    <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
                      {categoryLabels[work.category]} · {work.year}
                    </p>
                    <p
                      className="text-lg font-semibold"
                      style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
                    >
                      {work.title}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 더 보기 / 카운터 */}
          <div className="flex flex-col items-center gap-6 mt-16">
            <p className="text-xs tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              {shown.length} / {filtered.length}
            </p>
            {hasMore && (
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-12 py-3 text-xs tracking-[0.3em] transition-all duration-300 hover:opacity-70"
                style={{
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'transparent',
                }}
              >
                더 보기
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(13,11,8,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-2xl w-full p-10"
            style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="aspect-video w-full mb-8 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-bg-subtle)' }}
            >
              <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-kr-serif)', fontSize: '1.5rem' }}>
                {lightbox.title}
              </p>
            </div>
            <p className="text-xs tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>
              {categoryLabels[lightbox.category]} · {lightbox.year}
            </p>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
            >
              {lightbox.title}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>{lightbox.description}</p>
            <button
              className="mt-8 text-xs tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
              onClick={() => setLightbox(null)}
            >
              닫기 ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}