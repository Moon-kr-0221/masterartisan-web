'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryLabels, type WorkCategory } from '@/data/works';
import type { Work } from '@/lib/data/types';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { SERIF, SANS, C } from '@/lib/tokens';

const categories: WorkCategory[] = ['all', 'maintenance', 'repair', 'fabrication', 'drawing'];
const PAGE_SIZE = 6;

const BANNER_IMG        = 'https://images.unsplash.com/photo-1761452776106-78710d4fada9?auto=format&fit=crop&w=1600&q=80';
const BANNER_IMG_MOBILE = 'https://images.unsplash.com/photo-1650476524542-c5cc53306700?auto=format&fit=crop&w=1080&q=80';
const BANNER_SCRIM      = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%)';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WorksClient({ works, initialWork, heroImage, heroImageMobile, orderMode = 'fixed' }: {
  works: Work[]; initialWork?: string; heroImage?: string; heroImageMobile?: string; orderMode?: 'fixed' | 'random';
}) {
  const bannerImg = (heroImage && heroImage !== '') ? heroImage : BANNER_IMG;
  const bannerImgMobile = (heroImageMobile && heroImageMobile !== '') ? heroImageMobile : BANNER_IMG_MOBILE;
  // SSR/CSR 하이드레이션 불일치 방지: 서버는 항상 결정적 순서(works)로 렌더하고,
  // 무작위 정렬은 마운트 후 클라이언트에서만 적용한다.
  const [orderedWorks, setOrderedWorks] = useState<Work[]>(works);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (orderMode === 'random') setOrderedWorks(shuffle(works));
  }, [orderMode, works]);
  const [active,  setActive]  = useState<WorkCategory>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<null | Work>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [captionHeight, setCaptionHeight] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  function openLightbox(w: Work) { setLightbox(w); setPhotoIdx(0); setCaptionExpanded(false); }
  function closeLightbox() { setLightbox(null); setPhotoIdx(0); setCaptionExpanded(false); }

  useEffect(() => {
    if (!initialWork) return;
    const w = works.find((x) => x.title === initialWork);
    // URL 파라미터(?work=)에 따라 마운트 시 라이트박스를 여는 의도적 동기화
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (w) openLightbox(w);
  }, [initialWork, works]);

  // 캡션 시트 실제 높이 측정 — Dots를 항상 내용 위 16pt 지점에 고정
  useEffect(() => {
    if (!lightbox || !captionRef.current) return;
    const measure = () => setCaptionHeight(captionRef.current?.offsetHeight ?? 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(captionRef.current);
    return () => ro.disconnect();
  }, [lightbox, captionExpanded]);

  // 라이트박스가 열려 있는 동안 배경 스크롤 잠금
  // iOS Safari는 body의 overflow:hidden을 무시하므로 position:fixed로 잠그고
  // 스크롤 위치를 저장했다가 닫을 때 복원한다.
  useEffect(() => {
    if (!lightbox) return;
    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    return () => {
      html.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [lightbox]);

  // 키보드 좌우 화살표 지원
  useEffect(() => {
    if (!lightbox) return;
    const total = lightbox.images.length;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  setPhotoIdx((i) => (i - 1 + total) % total);
      if (e.key === 'ArrowRight') setPhotoIdx((i) => (i + 1) % total);
      if (e.key === 'Escape') closeLightbox();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const filtered = active === 'all' ? orderedWorks : orderedWorks.filter((w) => w.category === active);
  const shown    = filtered.slice(0, visible);
  const hasMore  = visible < filtered.length;

  const handleCategory = (cat: WorkCategory) => { setActive(cat); setVisible(PAGE_SIZE); };

  return (
    <>
      {/* ════════════ 데스크탑 — d933990 완전 동일 ════════════ */}
      <div className="hidden md:block" style={{ backgroundColor: C.canvas, paddingTop: 72 }}>
        <section style={{ position: 'relative', height: 360, overflow: 'hidden', borderBottom: `1px solid ${C.hairline}` }}>
          <Image src={bannerImg} alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: BANNER_SCRIM }} />
          <div className="absolute inset-0 flex flex-col gap-8 md:flex-row md:items-end md:justify-between" style={{ padding: '72px 80px' }}>
            <div className="flex flex-col gap-[10px]">
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.6)' }}>OUR WORKS</span>
              <h1 style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.1, color: C.canvas }}>작업 사례</h1>
              <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>전통건축 유지보수·수리·제작에 걸친 대표 작업물을 소개합니다.</p>
            </div>
            <div className="flex flex-wrap gap-1 flex-shrink-0">
              {categories.map((cat) => {
                const on = active === cat;
                return (
                  <button key={cat} onClick={() => handleCategory(cat)} style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', padding: '8px 18px', backgroundColor: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)', color: on ? C.ink : 'rgba(255,255,255,0.65)', border: on ? 'none' : '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s', cursor: 'pointer' }}>
                    {categoryLabels[cat]}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        <section style={{ padding: '72px 80px 80px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ columnGap: 16, rowGap: 48 }}>
            {shown.map((work, i) => (
              <ScrollReveal key={work.id} delay={(i % 3) * 0.06}>
                <div className="group cursor-pointer" onClick={() => openLightbox(work)}>
                  <div style={{ position: 'relative', height: 280, overflow: 'hidden', backgroundColor: C.imageBg }}>
                    <Image src={work.image} alt={work.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    {work.images.length > 1 && (
                      <span style={{ position: 'absolute', bottom: 10, right: 10,
                        backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF',
                        fontFamily: SANS, fontSize: 13, letterSpacing: '0.06em',
                        padding: '5px 10px', pointerEvents: 'none',
                        display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 10 }}>●</span>{work.images.length}
                      </span>
                    )}
                  </div>
                  <div style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.08em', color: C.muted }}>{categoryLabels[work.category]} · {work.year}</span>
                    <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 300, color: C.ink }}>{work.title}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          {shown.length === 0 && (
            <p className="text-center" style={{ padding: '96px 0', fontFamily: SANS, color: C.muted }}>해당 카테고리의 작업이 없습니다.</p>
          )}
          {hasMore && (
            <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ width: '100%', fontFamily: SANS, fontSize: 11, letterSpacing: '0.3em', padding: '12px 48px', backgroundColor: C.canvas, color: C.darkMuted, border: `1px solid ${C.hairline}`, transition: 'opacity 0.3s', cursor: 'pointer' }} className="hover:opacity-70">
                더 보기
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ════════════ 모바일 — Pencil iGTp2 / d933990 mobile ════════════ */}
      <div className="md:hidden" style={{ backgroundColor: C.canvas, paddingTop: 56 }}>

        {/* Page Hero — 300px, 이미지+스크림, 텍스트 하단 */}
        <section className="relative overflow-hidden" style={{ height: 300, backgroundColor: C.dark }}>
          <Image src={bannerImgMobile} alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: BANNER_SCRIM }} />
          <div className="absolute" style={{ top: 150, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.6)' }}>OUR WORKS</span>
            <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, lineHeight: 1.2, color: C.canvas }}>작업 사례</h1>
            <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>전통건축 유지보수·수리·제작에 걸친 대표 작업물을 소개합니다.</p>
          </div>
        </section>

        {/* Filter row — sticky top 56px, 가로 스크롤 */}
        <div
          className="sticky z-30 flex overflow-x-auto"
          style={{ top: 56, backgroundColor: C.canvas, borderBottom: `1px solid ${C.hairline}`, padding: '16px 24px', gap: 8, scrollbarWidth: 'none' }}
        >
          {categories.map((cat) => {
            const on = active === cat;
            return (
              <button key={cat} onClick={() => handleCategory(cat)}
                style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', padding: '8px 18px', whiteSpace: 'nowrap', flexShrink: 0, backgroundColor: on ? C.ink : 'transparent', color: on ? C.canvas : C.muted, border: on ? 'none' : `1px solid ${C.hairline}`, transition: 'all 0.25s', cursor: 'pointer' }}>
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>

        {/* Works grid — 1열 세로 목록, padding [48,24,64,24] */}
        <section style={{ padding: '48px 24px 64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {shown.map((work) => (
              <div key={work.id} className="cursor-pointer" onClick={() => openLightbox(work)}>
                <div style={{ position: 'relative', height: 220, overflow: 'hidden', backgroundColor: C.imageBg }}>
                  <Image src={work.image} alt={work.title} fill className="object-cover" sizes="100vw" />
                  {work.images.length > 1 && (
                    <span style={{ position: 'absolute', bottom: 10, right: 10,
                      backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF',
                      fontFamily: SANS, fontSize: 13, letterSpacing: '0.06em',
                      padding: '5px 10px', pointerEvents: 'none',
                      display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10 }}>●</span>{work.images.length}
                    </span>
                  )}
                </div>
                <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.08em', color: C.muted }}>{categoryLabels[work.category]} · {work.year}</span>
                  <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 300, color: C.ink }}>{work.title}</span>
                </div>
              </div>
            ))}
          </div>

          {shown.length === 0 && (
            <p className="text-center" style={{ padding: '64px 0', fontFamily: SANS, color: C.muted }}>해당 카테고리의 작업이 없습니다.</p>
          )}

          {hasMore && (
            <div style={{ paddingTop: 32, display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)}
                style={{ width: '100%', fontFamily: SANS, fontSize: 11, letterSpacing: '0.3em', padding: '12px 0', backgroundColor: C.canvas, color: C.darkMuted, border: `1px solid ${C.hairline}`, cursor: 'pointer' }}>
                더 보기
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Lightbox — 모바일/데스크탑 공통 */}
      {lightbox && (() => {
        const imgs = lightbox.images.length > 0 ? lightbox.images : [lightbox.image];
        const total = imgs.length;
        const cur = photoIdx % total;
        return (
          <div className="fixed inset-0 z-[60] hidden md:flex items-center justify-center p-4 md:p-6"
            style={{ backgroundColor: 'rgba(13,11,8,0.95)' }}
            onClick={closeLightbox}>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>

              {/* 이미지 — 풀블리드, 캡션 오버레이 + 좌우 버튼 + 닫기 */}
              <div style={{ position: 'relative', aspectRatio: '5/3', overflow: 'hidden', backgroundColor: C.imageBg }}>
                <Image src={imgs[cur]} alt={`${lightbox.title} ${cur + 1}`} fill
                  className="object-cover" sizes="100vw" />

                {/* 닫기 — 큰 × , 우상단 30px inset */}
                <button onClick={closeLightbox}
                  style={{ position: 'absolute', top: 30, right: 30,
                    fontFamily: SANS, fontSize: 36, fontWeight: 400, color: C.muted,
                    background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
                  ✕
                </button>

                {total > 1 && (
                  <>
                    {/* 이전 버튼 — 원형, 이미지 좌측 30px inset, 수직 중앙 */}
                    <button onClick={(e) => { e.stopPropagation(); setPhotoIdx((i) => (i - 1 + total) % total); }}
                      style={{ position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)',
                        width: 52, height: 52, borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.28)',
                        border: 'none',
                        cursor: 'pointer', color: '#FFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background-color 0.2s',
                        backdropFilter: 'blur(4px)', padding: 0 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.72)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.28)'; }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    {/* 다음 버튼 — 원형, 이미지 우측 30px inset, 수직 중앙 */}
                    <button onClick={(e) => { e.stopPropagation(); setPhotoIdx((i) => (i + 1) % total); }}
                      style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)',
                        width: 52, height: 52, borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.28)',
                        border: 'none',
                        cursor: 'pointer', color: '#FFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background-color 0.2s',
                        backdropFilter: 'blur(4px)', padding: 0 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.72)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.28)'; }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </>
                )}

                {/* 도트 + 캡션 — flex-column 오버레이로 캡션 바로 위 26px 고정 간격 유지 */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
                  <div style={{ flex: 1 }} />

                  {total > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 30, marginBottom: 26, gap: 8, pointerEvents: 'auto' }}>
                      {imgs.map((_, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }}
                          style={{ width: 8, height: 8, borderRadius: '50%', border: 'none',
                            cursor: 'pointer', padding: 0,
                            backgroundColor: i === cur ? '#FFF' : 'rgba(255,255,255,0.4)',
                            transition: 'background-color 0.2s' }} />
                      ))}
                    </div>
                  )}

                  {/* 캡션 오버레이 — 반투명 블랙, 하단 전체폭 */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: '12px 24px',
                    display: 'flex', alignItems: 'flex-end', gap: 24, pointerEvents: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.05em', color: C.muted }}>
                        {categoryLabels[lightbox.category]} · {lightbox.year}
                      </span>
                      <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#FFFFFF' }}>
                        {lightbox.title}
                      </span>
                    </div>
                    <p style={{ flex: 1, fontFamily: SANS, fontSize: 11, lineHeight: 1.6, color: '#E3E3E3' }}>
                      {lightbox.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Lightbox — 모바일 전용, 인스타그램 스타일 (풀블리드 스와이프 + 업다운 캡션 시트) */}
      {lightbox && (() => {
        const imgs = lightbox.images.length > 0 ? lightbox.images : [lightbox.image];
        const total = imgs.length;
        const cur = photoIdx % total;
        const goPrev = () => setPhotoIdx((i) => (i - 1 + total) % total);
        const goNext = () => setPhotoIdx((i) => (i + 1) % total);
        return (
          <div className="md:hidden fixed inset-0 z-[60]" style={{ backgroundColor: C.dark }}>
            {/* 이미지 — 화면 전체 풀블리드 스와이프 영역 */}
            <div
              style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: C.imageBg, touchAction: 'pan-y', zIndex: 0 }}
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const delta = e.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(delta) < 40) return;
                if (delta < 0) goNext(); else goPrev();
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={cur}
                  src={imgs[cur]}
                  alt={`${lightbox.title} ${cur + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </div>

            {/* 닫기 — 원형 버튼, 이미지보다 위 z-index */}
            <button onClick={closeLightbox}
              style={{ position: 'absolute', top: 20, right: 14, zIndex: 30,
                width: 30, height: 30, borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.4)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>

            {total > 1 && (
              <>
                <button onClick={goPrev}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 30,
                    width: 30, height: 30, borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.28)', border: 'none',
                    cursor: 'pointer', color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={goNext}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 30,
                    width: 30, height: 30, borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.28)', border: 'none',
                    cursor: 'pointer', color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                <div style={{ position: 'absolute', left: 0, right: 0, bottom: captionHeight + 16, zIndex: 25, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {imgs.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)}
                      style={{ width: 8, height: 8, borderRadius: '50%', border: 'none',
                        cursor: 'pointer', padding: 0,
                        backgroundColor: i === cur ? '#FFF' : 'rgba(255,255,255,0.4)',
                        transition: 'background-color 0.2s' }} />
                  ))}
                </div>
              </>
            )}

            {/* 캡션 — 하단에 밀착, z-index로 이미지 위에 업다운 (인스타그램 더보기 모션) */}
            <motion.div
              ref={captionRef}
              layout
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
                backgroundColor: '#0D0C0AF5',
                borderTopLeftRadius: captionExpanded ? 20 : 0,
                borderTopRightRadius: captionExpanded ? 20 : 0,
                padding: captionExpanded ? '16px 24px 32px' : '14px 24px 16px',
                display: 'flex', flexDirection: 'column', gap: 8 }}
              onClick={() => setCaptionExpanded((v) => !v)}
            >
              {captionExpanded && (
                <div style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.4)' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1, color: C.muted }}>
                  {categoryLabels[lightbox.category]} · {lightbox.year}
                </span>
                <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#FFFFFF' }}>
                  {lightbox.title}
                </span>
              </div>
              {captionExpanded ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontFamily: SANS, fontSize: 11, lineHeight: 1.6, color: '#E3E3E3' }}>
                    {lightbox.description}
                  </p>
                  <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, lineHeight: 1.6, color: '#E3E3E3' }}>
                    접기 ▴
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                  <p style={{ flex: 1, fontFamily: SANS, fontSize: 11, lineHeight: 1.6, color: '#E3E3E3',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lightbox.description}
                  </p>
                  <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, lineHeight: 1.6, color: '#E3E3E3', flexShrink: 0 }}>
                    더보기 ▾
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        );
      })()}
    </>
  );
}
