'use client';

import { useEffect, useState } from 'react';
import { categoryLabels, type WorkCategory } from '@/data/works';
import type { Work } from '@/lib/data/types';
import ScrollReveal from '@/components/ui/ScrollReveal';

const categories: WorkCategory[] = ['all', 'maintenance', 'repair', 'fabrication', 'drawing'];
const PAGE_SIZE = 6;

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

const BANNER_IMG = 'https://images.unsplash.com/photo-1761452776106-78710d4fada9?auto=format&fit=crop&w=1600&q=80';
const BANNER_SCRIM = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%)';

function useIsMobile(bp = 768) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const up = () => setV(mq.matches);
    up();
    mq.addEventListener('change', up);
    return () => mq.removeEventListener('change', up);
  }, [bp]);
  return v;
}

export default function WorksClient({ works, initialWork }: { works: Work[]; initialWork?: string }) {
  const [active, setActive] = useState<WorkCategory>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<null | Work>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!initialWork) return;
    const w = works.find((x) => x.title === initialWork);
    if (w) setLightbox(w);
  }, [initialWork, works]);

  const filtered = active === 'all' ? works : works.filter((w) => w.category === active);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleCategory = (cat: WorkCategory) => {
    setActive(cat);
    setVisible(PAGE_SIZE);
  };

  const FilterTabs = ({ mobile }: { mobile?: boolean }) => (
    <div
      className={mobile ? 'flex gap-2 overflow-x-auto' : 'flex flex-wrap gap-1 flex-shrink-0'}
      style={mobile ? { scrollbarWidth: 'none' } : undefined}
    >
      {categories.map((cat) => {
        const on = active === cat;
        return (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={mobile ? {
              fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em',
              padding: '8px 18px', whiteSpace: 'nowrap', flexShrink: 0,
              backgroundColor: on ? '#1A1A1A' : 'transparent',
              color: on ? '#FFFFFF' : '#999999',
              border: on ? 'none' : '1px solid #D8D5CF',
              transition: 'all 0.25s', cursor: 'pointer',
            } : {
              fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em',
              padding: '8px 18px',
              backgroundColor: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)',
              color: on ? '#1A1A1A' : 'rgba(255,255,255,0.65)',
              border: on ? 'none' : '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s', cursor: 'pointer',
            }}
          >
            {categoryLabels[cat]}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingTop: 72 }}>

      {/* ── Page Hero ── */}
      <section style={{ position: 'relative', height: 360, overflow: 'hidden', borderBottom: '1px solid #E8E8E8' }}>
        <img src={BANNER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: BANNER_SCRIM }} />
        {/* 모바일: 세로 스택, 하단 정렬 */}
        <div className="absolute inset-0 flex flex-col justify-end gap-3 p-6 md:hidden">
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.6)' }}>OUR WORKS</span>
          <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, lineHeight: 1.1, color: '#FFFFFF' }}>작업 사례</h1>
        </div>
        {/* 데스크탑: d933990 — title 좌, filters 우, 행 배치 */}
        <div
          className="hidden md:flex md:flex-row md:items-end md:justify-between md:absolute md:inset-0"
          style={{ padding: '72px 80px' }}
        >
          <div className="flex flex-col gap-[10px]">
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.6)' }}>OUR WORKS</span>
            <h1 style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.1, color: '#FFFFFF' }}>작업 사례</h1>
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>전통건축 유지보수·수리·제작에 걸친 대표 작업물을 소개합니다.</p>
          </div>
          <FilterTabs />
        </div>
      </section>

      {/* 모바일 전용 — 히어로 아래 스티키 필터 바 */}
      {isMobile && (
        <div
          className="sticky z-30"
          style={{ top: 72, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E8E8', padding: '12px 24px' }}
        >
          <FilterTabs mobile />
        </div>
      )}

      {/* ── Grid ── */}
      <section className="px-6 py-12 md:px-[80px] md:py-[72px]">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ columnGap: 16, rowGap: isMobile ? 32 : 48 }}
        >
          {shown.map((work, i) => (
            <ScrollReveal key={work.id} delay={(i % 3) * 0.06}>
              <div className="group cursor-pointer" onClick={() => setLightbox(work)}>
                <div style={{ height: isMobile ? 220 : 280, overflow: 'hidden', backgroundColor: '#EDEAE4' }}>
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
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
          <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              style={{
                width: '100%', fontFamily: SANS, fontSize: 11, letterSpacing: '0.3em',
                padding: '12px 48px', backgroundColor: '#FFFFFF', color: '#888888',
                border: '1px solid #E8E8E8', transition: 'opacity 0.3s', cursor: 'pointer',
              }}
              className="hover:opacity-70"
            >
              더 보기
            </button>
          </div>
        )}
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(13,11,8,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.image} alt={lightbox.title} className="w-full aspect-video object-cover" />
            <div style={{ padding: isMobile ? 24 : 32 }}>
              <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.08em', color: '#AAAAAA', marginBottom: 8 }}>
                {categoryLabels[lightbox.category]} · {lightbox.year}
              </p>
              <h3 style={{ fontFamily: SERIF, fontSize: isMobile ? 20 : 24, fontWeight: 300, color: '#1A1A1A', marginBottom: 16 }}>
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
