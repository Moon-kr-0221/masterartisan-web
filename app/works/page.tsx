'use client';

import { useState } from 'react';
import { worksData, categoryLabels, type WorkCategory } from '@/data/works';
import ScrollReveal from '@/components/ui/ScrollReveal';

const categories: WorkCategory[] = ['all', 'maintenance', 'repair', 'fabrication'];
const PAGE_SIZE = 6;

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

// Banner mirrors the Pencil WORKS PageHero (height 360 + image + light scrim)
const BANNER_IMG = 'https://images.unsplash.com/photo-1761452776106-78710d4fada9?auto=format&fit=crop&w=1600&q=80';
const BANNER_SCRIM = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%)';

export default function WorksPage() {
  const [active, setActive] = useState<WorkCategory>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<null | (typeof worksData)[0]>(null);

  const filtered = active === 'all' ? worksData : worksData.filter((w) => w.category === active);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleCategory = (cat: WorkCategory) => {
    setActive(cat);
    setVisible(PAGE_SIZE);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingTop: 72 }}>
      {/* ── Page Hero: title left, filters right ── */}
      <section style={{ position: 'relative', height: 360, overflow: 'hidden', borderBottom: '1px solid #E8E8E8' }}>
        <img src={BANNER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: BANNER_SCRIM }} />
        <div
          className="absolute inset-0 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          style={{ padding: '72px 80px' }}
        >
          <div className="flex flex-col gap-[10px]">
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.6)' }}>
              OUR WORKS
            </span>
            <h1 style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.1, color: '#FFFFFF' }}>
              작업 사례
            </h1>
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
              전통건축 유지보수·수리·제작에 걸친 대표 작업물을 소개합니다.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            {categories.map((cat) => {
              const on = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    padding: '8px 18px',
                    backgroundColor: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)',
                    color: on ? '#1A1A1A' : 'rgba(255,255,255,0.65)',
                    border: on ? 'none' : '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                >
                  {categoryLabels[cat]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section style={{ padding: '72px 80px 80px' }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ columnGap: 16, rowGap: 48 }}
        >
          {shown.map((work, i) => (
            <ScrollReveal key={work.id} delay={(i % 3) * 0.06}>
              <div className="group cursor-pointer" onClick={() => setLightbox(work)}>
                <div style={{ height: 280, overflow: 'hidden', backgroundColor: '#EDEAE4' }}>
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.08em', color: '#AAAAAA' }}>
                    {categoryLabels[work.category]} · {work.year}
                  </span>
                  <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 300, color: '#1A1A1A' }}>
                    {work.title}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="text-center" style={{ padding: '96px 0', fontFamily: SANS, color: '#AAAAAA' }}>
            해당 카테고리의 작업이 없습니다.
          </p>
        )}

        {hasMore && (
          <div className="flex justify-center" style={{ paddingTop: 40 }}>
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.3em',
                padding: '12px 48px',
                backgroundColor: '#FFFFFF',
                color: '#888888',
                border: '1px solid #E8E8E8',
                transition: 'opacity 0.3s',
                cursor: 'pointer',
              }}
              className="hover:opacity-70"
            >
              더 보기
            </button>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(13,11,8,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-2xl w-full"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.image} alt={lightbox.title} className="w-full aspect-video object-cover" />
            <div style={{ padding: 32 }}>
              <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.08em', color: '#AAAAAA', marginBottom: 8 }}>
                {categoryLabels[lightbox.category]} · {lightbox.year}
              </p>
              <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 300, color: '#1A1A1A', marginBottom: 16 }}>
                {lightbox.title}
              </h3>
              <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.9, color: '#555555' }}>
                {lightbox.description}
              </p>
              <button
                onClick={() => setLightbox(null)}
                style={{ marginTop: 32, fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: '#AAAAAA', cursor: 'pointer' }}
              >
                닫기 ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
