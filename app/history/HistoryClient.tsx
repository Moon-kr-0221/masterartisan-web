'use client';

import {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import Image from 'next/image';
import type { HistoryEraGroup, HistoryWorkItem } from '@/lib/data/types';
import { milestoneYears } from '@/lib/data/era';
import ClockIntro from '@/components/history/ClockIntro';
import MobileDialIntro from '@/components/history/MobileDialIntro';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// 펜슬 ztlMd HeaderImg(y43ExV)와 동일한 전통 목조 건축 이미지 (밝은 처마·살창)
const HISTORY_HEADER_IMG = '/images/history/header.jpg';

const C = {
  bg:       '#F8F5F0',
  ink:      '#1A1714',
  inkSoft:  '#3D3A36',
  muted:    '#A09890',
  hairline: '#E2DDD6',
  accent:   '#C4A882',
  surface:  '#F0EBE3',
} as const;

// ─── helpers ────────────────────────────────────────────────────────────────
function BlurReveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div style={style}
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}>
      {children}
    </motion.div>
  );
}

function FadeUp({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div style={style}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.75, ease: EASE_OUT, delay }}>
      {children}
    </motion.div>
  );
}

// ≤767px 여부 (반응형 인라인 스타일용 — Tailwind 임의값 미생성 이슈 회피)
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return isMobile;
}

// 펜슬 ztlMd HeaderImg — 로딩 시 블러업+페이드인+살짝 줌아웃 이펙트
function HeaderImage({ src, alt, isMobile }: { src: string; alt: string; isMobile: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // 캐시/즉시 로드 시 onLoad가 핸들러 부착 전에 발화하는 레이스 방지
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);
  return (
    <div style={{
      position: 'relative',
      width: isMobile ? '100%' : 460,
      height: isMobile ? 'auto' : 440,
      aspectRatio: isMobile ? '460 / 440' : undefined,
      maxWidth: '100%', flexShrink: 0,
      overflow: 'hidden', backgroundColor: C.surface,
    }}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        onLoad={() => setLoaded(true)}
        sizes="(max-width: 768px) 100vw, 460px"
        className="object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'scale(1)' : 'scale(1.08)',
          filter: loaded ? 'blur(0px)' : 'blur(16px)',
          transition: 'opacity 1.2s ease, transform 1.6s cubic-bezier(0.16,1,0.3,1), filter 1.2s ease',
        }}
      />
    </div>
  );
}

// ─── SVG Dial ───────────────────────────────────────────────────────────────
// 📍 Pencil Node: HTqA9 (RotatingRing) + SWJ7y (FixedLayer)
interface DialProps {
  eras: HistoryEraGroup[];
  activeIdx: number;
  // GSAP will animate these refs directly — no React state per frame
  groupRef:  React.RefObject<SVGGElement | null>;
  labelRefs: React.MutableRefObject<(SVGTextElement | null)[]>;
}

function HistoryDial({ eras, activeIdx, groupRef, labelRefs }: DialProps) {
  const TOTAL = eras.length;
  const CX = 240, CY = 240;
  const R = { outer: 210, track: 168, inner: 122, center: 68, label: 204 };

  const polar = (deg: number, r: number) => ({
    x: Math.round((CX + r * Math.cos((deg * Math.PI) / 180)) * 100) / 100,
    y: Math.round((CY + r * Math.sin((deg * Math.PI) / 180)) * 100) / 100,
  });

  // Era i at angle starting from 12 o'clock, clockwise
  const eraAngle = (i: number) => -90 + (i / TOTAL) * 360;

  return (
    <svg viewBox="0 0 480 480" width="100%" height="100%"
      style={{ overflow: 'hidden' }}>

      {/* ── Static concentric rings ── */}
      {[R.track, R.inner].map((r) => (
        <circle key={r} cx={CX} cy={CY} r={r} fill="none"
          stroke={C.hairline} strokeWidth={0.5} />
      ))}

      {/* ── ROTATING MARKERS (scroll-linked) — 눈금만 회전, 년도 라벨은 제자리 고정 ── */}
      {/* 📍 Pencil: HTqA9 (RotatingRing) */}
      <g ref={groupRef} style={{ transformOrigin: `${CX}px ${CY}px` }}>
        {/* Fine tick marks — 시대(TOTAL)의 배수로 두어 major 눈금이 시 마커와 정확히 겹치게 */}
        {Array.from({ length: TOTAL * 6 }).map((_, i) => {
          const a = -90 + (i / (TOTAL * 6)) * 360;
          const p0 = polar(a, R.inner);
          const p1 = polar(a, R.inner + 8);
          const major = i % 6 === 0;
          return (
            <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y}
              stroke={major ? '#B8B3AA' : C.hairline}
              strokeWidth={major ? 0.7 : 0.35} />
          );
        })}

        {/* Era tick lines (markers) — 분 마커와 동일 기준에서 뻗어 함께 회전 */}
        {eras.map((era, i) => {
          const a = eraAngle(i);
          const t0 = polar(a, R.inner);
          const t1 = polar(a, R.track + 8);
          return (
            <line key={era.era} x1={t0.x} y1={t0.y} x2={t1.x} y2={t1.y}
              stroke="#B8B3AA" strokeWidth={0.7} />
          );
        })}

        {/* Center dot on pivot */}
        <circle cx={CX} cy={CY} r={2.2} fill={C.ink} />
      </g>

      {/* ── STATIC era labels — 제자리 고정(똑바로), 활성 시대만 강조 ── */}
      {eras.map((era, i) => {
        const a = eraAngle(i);
        const lp = polar(a, R.label);
        const isActive = i === activeIdx;
        return (
          <text key={era.era}
            ref={(el) => { labelRefs.current[i] = el; }}
            x={lp.x} y={lp.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={isActive ? 9.5 : 8.5}
            fontFamily="'Noto Sans KR', sans-serif"
            fontWeight={isActive ? '600' : '300'}
            fill={isActive ? C.ink : C.muted}
            opacity={isActive ? 1 : 0.4}
            style={{ transition: 'fill 0.5s, font-size 0.4s, opacity 0.5s' }}
          >
            {era.era}
          </text>
        );
      })}

      {/* ══ FIXED ELEMENTS — never rotate ══════════════════════════════ */}
      {/* 📍 Pencil: SWJ7y (FixedLayer) */}

      {/* Fixed clock hand: always points straight UP (12 o'clock) */}
      <line
        x1={CX} y1={CY - R.center + 1}
        x2={CX} y2={CY - R.track + 2}
        stroke={C.ink} strokeWidth={0.7}
      />
      {/* Hand tip dot */}
      <circle cx={CX} cy={CY - R.track + 2} r={2.6} fill={C.ink} />

      {/* Center disc */}
      <circle cx={CX} cy={CY} r={R.center}
        fill={C.surface} stroke={C.hairline} strokeWidth={0.7} />

      {/* Active era label — crossfade */}
      <AnimatePresence mode="wait">
        <motion.g key={activeIdx}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}>
          <text x={CX} y={CY - 9} textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fontFamily="'Noto Serif KR', serif"
            fontWeight="400" fill={C.ink}>
            {eras[activeIdx]?.era}
          </text>
          <text x={CX} y={CY + 9} textAnchor="middle" dominantBaseline="middle"
            fontSize={7.5} fontFamily="'Noto Sans KR', sans-serif"
            fill={C.muted} letterSpacing={2}>
            HISTORY
          </text>
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

// ─── Photo lightbox — 스와이프 이미지 슬라이더 (여러 장일 때) ────────────────
function PhotoLightbox({ photos, index, isMobile, onClose, onChangeIndex }: {
  photos: { url: string; caption: string | null }[];
  index: number;
  isMobile: boolean;
  onClose: () => void;
  onChangeIndex: (i: number) => void;
}) {
  const total = photos.length;
  const current = photos[index];
  const touchStartX = useRef<number | null>(null);

  const goPrev = () => onChangeIndex((index - 1 + total) % total);
  const goNext = () => onChangeIndex((index + 1) % total);

  useEffect(() => {
    window.dispatchEvent(new Event('history-scroll-lock'));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (total > 1 && e.key === 'ArrowLeft') goPrev();
      if (total > 1 && e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.dispatchEvent(new Event('history-scroll-unlock'));
    };
    // goNext/goPrev/onClose는 매 렌더 재생성되는 핸들러라 의존성에 넣으면 리스너만 불필요하게 재등록됨.
    // 최신 index/total로만 재구성하면 충분하므로 의도적으로 제외.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  function handleTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (total <= 1 || Math.abs(diff) < 50) return;
    if (diff < 0) goNext(); else goPrev();
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10"
      style={{ backgroundColor: 'rgba(13,11,8,0.96)' }}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      {/* 라이트박스: CMS 이미지의 실제 비율대로 뷰포트에 맞춰 축소(가변 width/height). next/Image는 고정 치수나 fill이 필요해 이 "원본 비율 자동 축소" 동작에 부적합 — 의도적으로 img 유지. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.url}
        alt={current.caption ?? ''}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '92vw', maxHeight: '88vh', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', userSelect: 'none' }}
      />
      {current.caption && (
        <figcaption style={{
          position: 'absolute', bottom: isMobile ? 24 : 32, left: 0, right: 0,
          textAlign: 'center', fontFamily: "'Noto Sans KR'", fontSize: 12,
          color: '#E2DDD6', padding: '0 24px',
        }}>
          {current.caption}
        </figcaption>
      )}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            style={{
              position: 'absolute', left: isMobile ? 8 : 24, top: '50%', transform: 'translateY(-50%)',
              fontSize: 28, color: '#E2DDD6', background: 'none', border: 'none', cursor: 'pointer',
              padding: 12, lineHeight: 1,
            }}>
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            style={{
              position: 'absolute', right: isMobile ? 8 : 24, top: '50%', transform: 'translateY(-50%)',
              fontSize: 28, color: '#E2DDD6', background: 'none', border: 'none', cursor: 'pointer',
              padding: 12, lineHeight: 1,
            }}>
            ›
          </button>
          <div style={{
            position: 'absolute', bottom: isMobile ? 56 : 64, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 6,
          }}>
            {photos.map((_, i) => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: i === index ? '#E2DDD6' : 'rgba(226,221,214,0.35)',
              }} />
            ))}
          </div>
        </>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute', top: isMobile ? 16 : 24, right: isMobile ? 16 : 24,
          fontFamily: "'Noto Sans KR'", fontSize: 11, letterSpacing: '0.1em',
          color: '#E2DDD6', cursor: 'pointer', background: 'none', border: 'none',
        }}>
        닫기 ✕
      </button>
    </div>
  );
}

// ─── Era section ─────────────────────────────────────────────────────────────
function EraSection({ era, eraIdx, total, isActive, sectionRef, onOpenMedia, isMobile = false }: {
  era: HistoryEraGroup;
  eraIdx: number;
  total: number;
  isActive: boolean;
  sectionRef: React.RefCallback<HTMLElement>;
  onOpenMedia: (work: HistoryWorkItem) => void;
  isMobile?: boolean;
}) {
  const [expandedWorks, setExpandedWorks] = useState<Set<string>>(new Set());
  const [gallery, setGallery] = useState<{ photos: { url: string; caption: string | null }[]; index: number } | null>(null);

  const byYear: Record<string, HistoryWorkItem[]> = {};
  era.works.forEach((w) => {
    const k = String(w.year);
    (byYear[k] ??= []).push(w);
  });
  const years = Object.keys(byYear).sort((a, b) => Number(a) - Number(b));

  return (
    <section ref={sectionRef} id={`era-${eraIdx}`}
      style={{ padding: isMobile ? '56px 24px' : '96px 64px 80px', borderBottom: `1px solid ${C.hairline}` }}>

      <FadeUp>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '20px', height: '1px', backgroundColor: C.accent }} />
          <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '9px',
            letterSpacing: '0.4em', color: C.accent, textTransform: 'uppercase' }}>
            {String(eraIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </FadeUp>

      <BlurReveal delay={0.05} style={{ marginBottom: '56px' }}>
        <h2 style={{
          fontFamily: "'Noto Serif KR', serif",
          fontSize: 'clamp(64px, 8vw, 108px)',
          fontWeight: 300, lineHeight: 1.0, letterSpacing: '-0.04em',
          color: isActive ? C.ink : '#9A9590',
          transition: 'color 0.9s ease',
        }}>
          {era.era}
        </h2>
      </BlurReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {years.map((year, yi) => (
          <div key={year}>
            <FadeUp delay={yi * 0.04}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '12px' }}>
                <span style={{ fontFamily: "'Noto Serif KR', serif",
                  fontSize: '28px', fontWeight: 300, letterSpacing: '-0.02em',
                  color: C.ink, minWidth: '72px' }}>
                  {year}
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: C.hairline }} />
              </div>
            </FadeUp>
            {byYear[year].map((work, wi) => {
              const photos = work.media.filter((m) => m.image_url);
              const isExpanded = expandedWorks.has(work.id ?? String(wi));
              const initialCount = isMobile ? 2 : 3;
              const visiblePhotos = isExpanded ? photos : photos.slice(0, initialCount);
              const hasMore = photos.length > visiblePhotos.length;
              const photoW = isMobile ? 163 : 220;
              const photoH = isMobile ? 110 : 148;
              return (
                <FadeUp key={work.id ?? wi} delay={yi * 0.04 + wi * 0.03 + 0.06}>
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    padding: visiblePhotos.length > 0 ? '11px 0 14px' : '11px 0',
                    borderBottom: `1px solid ${C.hairline}`,
                  }}>
                    <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '13px',
                      lineHeight: 1.65, color: C.inkSoft, fontWeight: 300 }}>
                      {work.title}
                    </span>
                    {visiblePhotos.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {visiblePhotos.map((m, idx) => (
                            <div key={idx}
                              onClick={() => setGallery({
                                photos: photos.map((p) => ({ url: p.image_url, caption: p.caption })),
                                index: idx,
                              })}
                              style={{
                                position: 'relative',
                                width: photoW, height: photoH,
                                flexShrink: 0, overflow: 'hidden',
                                backgroundColor: C.surface, cursor: 'zoom-in',
                              }}>
                              <Image
                                src={m.image_url}
                                alt={m.caption ?? work.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 460px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        {hasMore && !isExpanded && (
                          <button
                            onClick={() => setExpandedWorks(new Set([...expandedWorks, work.id ?? String(wi)]))}
                            style={{
                              alignSelf: 'flex-start',
                              padding: '8px 16px',
                              backgroundColor: C.accent,
                              color: '#fff',
                              border: 'none',
                              fontSize: '12px',
                              fontFamily: "'Noto Sans KR'",
                              letterSpacing: '0.04em',
                              cursor: 'pointer',
                              marginTop: '4px',
                            }}>
                            사진 더보기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        ))}
      </div>
      {gallery && (
        <PhotoLightbox
          photos={gallery.photos}
          index={gallery.index}
          isMobile={isMobile}
          onClose={() => setGallery(null)}
          onChangeIndex={(i) => setGallery((g) => (g ? { ...g, index: i } : g))}
        />
      )}
    </section>
  );
}

// ─── Media gallery lightbox ──────────────────────────────────────────────────
function MediaGallery({ work, onClose }: { work: HistoryWorkItem; onClose: () => void }) {
  const isMobile = useIsMobile();
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);

  useEffect(() => {
    window.dispatchEvent(new Event('history-scroll-lock'));
    return () => { window.dispatchEvent(new Event('history-scroll-unlock')); };
  }, []);

  const galleryPhotos = work.media.map((m) => ({ url: m.image_url, caption: m.caption }));

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 overflow-y-auto"
      style={{ backgroundColor: 'rgba(13,11,8,0.95)' }}
      onClick={onClose}>
      <div
        className="max-w-3xl w-full"
        style={{ backgroundColor: C.bg }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '28px 32px', borderBottom: `1px solid ${C.hairline}`,
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontFamily: "'Noto Sans KR'", fontSize: 9, letterSpacing: '0.3em',
              color: C.accent, marginBottom: 8 }}>
              {work.year} · MEDIA
            </p>
            <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 22, fontWeight: 300, color: C.ink }}>
              {work.title}
            </h3>
          </div>
          <button onClick={onClose}
            style={{ fontFamily: "'Noto Sans KR'", fontSize: 11, letterSpacing: '0.1em',
              color: C.muted, cursor: 'pointer', flexShrink: 0 }}>
            닫기 ✕
          </button>
        </div>
        <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {work.media.map((m, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <div
                onClick={() => setPhotoIdx(i)}
                style={{ width: '100%', backgroundColor: C.surface, overflow: 'hidden', cursor: 'zoom-in' }}>
                {/* 본문 상세 이미지: 너비 100% + 원본 비율대로 높이 자동(고정 height 없음). CMS 이미지라 실제 치수를 알 수 없어 next/Image의 width/height·fill에 부적합 — 의도적으로 img 유지. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.image_url} alt={m.caption ?? work.title}
                  className="w-full object-cover" style={{ display: 'block' }} />
              </div>
              {m.caption && (
                <figcaption style={{ fontFamily: "'Noto Sans KR'", fontSize: 12,
                  lineHeight: 1.8, color: C.muted, marginTop: 10 }}>
                  {m.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
      {photoIdx !== null && (
        <PhotoLightbox
          photos={galleryPhotos}
          index={photoIdx}
          isMobile={isMobile}
          onClose={() => setPhotoIdx(null)}
          onChangeIndex={setPhotoIdx}
        />
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HistoryClient({ eras, header }: {
  eras: HistoryEraGroup[];
  header?: { eyebrow: string; title: string; desc: string; image: string };
}) {
  const headerCopy = header ?? {
    eyebrow: 'HISTORY · 장인 이야기',
    title: '천년의 기술,\n삼대로 이어온\n90년의 여정',
    desc: '1936년부터 3대에 걸쳐 이어온 전통 목구조 건축 기법의 발자취를 따라갑니다.',
    image: HISTORY_HEADER_IMG,
  };
  const headerTitleLines = headerCopy.title.split('\n');
  const ERAS = [...eras].reverse(); // oldest → newest
  const TOTAL = ERAS.length;
  // Intro-clock years follow the actual archive range (oldest → newest).
  const clockYears = milestoneYears(eras.flatMap((e) => e.works.map((w) => w.year)));

  const [activeIdx, setActiveIdx] = useState(0);
  const [mediaWork, setMediaWork] = useState<HistoryWorkItem | null>(null);
  const isMobile = useIsMobile();

  const leftRef    = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const lenisRef   = useRef<Lenis | null>(null);

  // Dial GSAP refs — no React state updates per frame
  const dialGroupRef = useRef<SVGGElement>(null);
  const labelRefs    = useRef<(SVGTextElement | null)[]>([]);

  // Tab bar scroll-sync refs
  const tabBarRef     = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabTouch      = useRef<{ x: number; left: number; lastX: number; lastT: number; vx: number } | null>(null);
  const tabMomentum   = useRef<number | null>(null);

  // ── Lenis (데스크탑) + 네이티브 스크롤 리스너 (iOS 터치) ────────────────
  useEffect(() => {
    ScrollTrigger.normalizeScroll(true); // iOS 터치 스크롤 정규화 — 브라우저 전용
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // normalizeScroll()이 스크롤 좌표계를 바꾸므로, 이미 생성된 자식 ScrollTrigger(모바일 다이얼 등)의
    // start/end를 새 좌표계로 다시 계산하도록 강제 refresh — 안 하면 좌표가 틀어져 트리거가 동작하지 않음.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    // iOS 터치 스크롤은 Lenis를 거치지 않으므로 네이티브 scroll 이벤트도 연결
    const onNativeScroll = () => ScrollTrigger.update();
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', onNativeScroll);
    };
  }, []);

  // ── 사진 상세 팝업이 열려 있는 동안 배경 스크롤 잠금 (중첩 팝업 대비 카운트) ──
  useEffect(() => {
    let lockCount = 0;
    const lock = () => {
      lockCount += 1;
      lenisRef.current?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    };
    const unlock = () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount > 0) return;
      lenisRef.current?.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
    window.addEventListener('history-scroll-lock', lock);
    window.addEventListener('history-scroll-unlock', unlock);
    return () => {
      window.removeEventListener('history-scroll-lock', lock);
      window.removeEventListener('history-scroll-unlock', unlock);
      lockCount = 0;
      lenisRef.current?.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // ── GSAP: dial rotation (scrub) + section tracking ───────────────────────
  useEffect(() => {
    if (!leftRef.current || !dialGroupRef.current) return;
    const ctx = gsap.context(() => {

      // 하단 다이얼: 마커(눈금)만 스크롤에 연동해 회전 — 년도 라벨은 별도 정적 레이어라 회전 안 함.
      gsap.to(dialGroupRef.current, {
        rotation: -360,
        ease: 'none',
        transformOrigin: '50% 50%',
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.6,
        },
      });

      ERAS.forEach((_, i) => {
        const el = sectionRefs.current[i];
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end:   'bottom 55%',
          onEnter:     () => setActiveIdx(i),
          onEnterBack: () => setActiveIdx(i),
        });
      });

      gsap.utils.toArray<HTMLElement>('.work-row').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
        );
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TOTAL]);

  // ── Tab bar auto-scroll — 활성 시대 탭이 항상 화면 중앙에 오도록 ───────────
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    // tabs[0] = 'ALL', tabs[i+1] = ERAS[i] → 활성 시대 버튼은 activeIdx+1
    const btn = tabButtonRefs.current[activeIdx + 1];
    if (!btn) return;
    const scrollTarget = btn.offsetLeft - bar.clientWidth / 2 + btn.offsetWidth / 2;
    bar.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
  }, [activeIdx]);

  // ── Tab scroll-to ─────────────────────────────────────────────────────────
  const scrollToEra = useCallback((i: number) => {
    const el = i < 0 ? sectionRefs.current[0] : sectionRefs.current[i];
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -120, duration: 1.8 });
    } else {
      // iOS 터치 환경 폴백: 네이티브 scrollIntoView
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const tabs = ['ALL', ...ERAS.map((e) => e.era)];

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, minHeight: '100vh' }}>

      {/* ══ STORY HEADER ════════════════════════════════════════════════════ */}
      {/* 펜슬 ztlMd: 텍스트 좌(TextCol, gap 28) + 이미지 우(HeaderImg 460×440), space-between */}
      <section style={{
        backgroundColor: C.bg,
        borderBottom: `1px solid ${C.hairline}`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 24 : 64,
        padding: isMobile ? '104px 24px 56px' : '120px 80px 100px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: '0 1 auto', minWidth: 0 }}>
          <p style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 10, letterSpacing: '0.38em',
            color: C.accent,
            textTransform: 'uppercase',
          }}>
            {headerCopy.eyebrow}
          </p>
          <h1 style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: isMobile ? 34 : 80,
            fontWeight: 300,
            lineHeight: isMobile ? 1.15 : 1.12,
            letterSpacing: isMobile ? '-0.03em' : '-0.04em',
            color: C.ink,
            maxWidth: isMobile ? '100%' : 600,
          }}>
            {headerTitleLines.map((line, i) => (
              <span key={i}>{line}{i < headerTitleLines.length - 1 && <br />}</span>
            ))}
          </h1>
          <p style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 14, lineHeight: isMobile ? 1.8 : 1.9,
            color: C.muted, fontWeight: 300,
            maxWidth: isMobile ? '100%' : 452,
          }}>
            {headerCopy.desc}
          </p>
        </div>

        <HeaderImage src={headerCopy.image} alt="전통 목조 건축 처마와 살창" isMobile={isMobile} />
      </section>

      {/* ══ CLOCK INTRO ANIMATION ════════════════════════════════════════════ */}
      {/* 데스크탑: 기존 ClockIntro / 모바일: d933990 time_sect 다이얼 모션 */}
      <div className="hidden md:block"><ClockIntro years={clockYears} /></div>
      <div className="md:hidden"><MobileDialIntro years={clockYears} /></div>

      {/* ══ STICKY TAB BAR — 고정 네비(pE4bF) 바로 아래에 붙어 함께 이동 ════════ */}
      {/* data-lenis-prevent + 수동 터치 드래그: 이 페이지의 ScrollTrigger.normalizeScroll가
          모바일 터치를 가로채(preventDefault) 네이티브 가로 스크롤을 막으므로, 탭바 가로 스크롤을
          JS로 직접 구현해 네이티브 스크롤에 의존하지 않도록 함 */}
      <div
        ref={tabBarRef}
        data-lenis-prevent
        onTouchStart={(e) => {
          const bar = tabBarRef.current;
          if (!bar) return;
          if (tabMomentum.current) cancelAnimationFrame(tabMomentum.current); // 진행 중인 관성 중단
          const now = performance.now();
          tabTouch.current = { x: e.touches[0].clientX, left: bar.scrollLeft, lastX: e.touches[0].clientX, lastT: now, vx: 0 };
        }}
        onTouchMove={(e) => {
          const bar = tabBarRef.current;
          if (!bar || !tabTouch.current) return;
          e.stopPropagation();
          const x = e.touches[0].clientX;
          const now = performance.now();
          const dt = now - tabTouch.current.lastT;
          if (dt > 0) tabTouch.current.vx = (x - tabTouch.current.lastX) / dt; // px/ms
          tabTouch.current.lastX = x;
          tabTouch.current.lastT = now;
          bar.scrollLeft = tabTouch.current.left - (x - tabTouch.current.x);
        }}
        onTouchEnd={() => {
          const bar = tabBarRef.current;
          const t = tabTouch.current;
          tabTouch.current = null;
          if (!bar || !t) return;
          // 손을 뗀 순간의 속도로 미끄러지듯 감속 (관성 스크롤)
          let v = -t.vx * 16; // px/frame(≈16ms) 환산, 드래그 방향과 반대로 scrollLeft 이동
          const friction = 0.94;
          const step = () => {
            v *= friction;
            bar.scrollLeft += v;
            if (Math.abs(v) > 0.4) tabMomentum.current = requestAnimationFrame(step);
            else tabMomentum.current = null;
          };
          if (Math.abs(v) > 0.4) tabMomentum.current = requestAnimationFrame(step);
        }}
        style={{
        position: 'sticky',
        top: 'var(--nav-h, 72px)',
        zIndex: 40,
        transition: 'top 0.3s ease',
        backgroundColor: `${C.surface}F2`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.hairline}`,
        display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch', touchAction: 'pan-x',
      }}>
        {tabs.map((tab, i) => {
          const active = i === 0
            ? activeIdx === 0
            : ERAS[i - 1]?.era === ERAS[activeIdx]?.era;
          return (
            <button key={tab}
              ref={(el) => { tabButtonRefs.current[i] = el; }}
              onClick={() => scrollToEra(i - 1)}
              style={{
                flexShrink: 0, padding: '14px 20px',
                border: 'none',
                borderBottom: active
                  ? `1.5px solid ${C.ink}`
                  : '1.5px solid transparent',
                background: 'none', cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: '10px', letterSpacing: '0.14em',
                color: active ? C.ink : C.muted,
                fontWeight: active ? 600 : 400,
                transition: 'color 0.3s, border-color 0.3s',
                whiteSpace: 'nowrap',
              }}>
              {tab}
            </button>
          );
        })}
      </div>

      {/* ══ MAIN SPLIT LAYOUT ═══════════════════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'start' }}>

        {/* ── LEFT: scrollable — 모바일 100%, 데스크탑 58% ─────────────────── */}
        <div ref={leftRef} style={{ width: isMobile ? '100%' : '58%', borderRight: isMobile ? 'none' : `1px solid ${C.hairline}` }}>


          {/* Era sections */}
          {ERAS.map((era, i) => (
            <EraSection
              key={era.era}
              era={era}
              eraIdx={i}
              total={TOTAL}
              isActive={i === activeIdx}
              sectionRef={(el: HTMLElement | null) => { sectionRefs.current[i] = el; }}
              onOpenMedia={setMediaWork}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* ── RIGHT: sticky dial — 모바일 숨김, 데스크탑 42% ─────────────── */}
        <div style={{
          width: '42%',
          position: 'sticky',
          top: 'calc(var(--nav-h, 72px) + 49px)',
          height: 'calc(100vh - var(--nav-h, 72px) - 49px)',
          transition: 'top 0.3s ease, height 0.3s ease',
          display: isMobile ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          gap: '28px',
          backgroundColor: C.bg,
        }}>
          {/* Era counter */}
          <div style={{ position: 'absolute', top: '28px', right: '32px',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <AnimatePresence mode="wait">
              <motion.span key={activeIdx}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}
                style={{ fontFamily: "'Noto Serif KR', serif",
                  fontSize: '32px', fontWeight: 300,
                  letterSpacing: '-0.02em', color: C.ink, lineHeight: 1 }}>
                {String(activeIdx + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '9px',
              letterSpacing: '0.2em', color: C.muted }}>
              / {String(TOTAL).padStart(2, '0')}
            </span>
          </div>

          {/* Dial SVG */}
          <motion.div
            style={{ width: 'min(440px, 78%)', aspectRatio: '1' }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.3 }}>
            <HistoryDial
              eras={ERAS}
              activeIdx={activeIdx}
              groupRef={dialGroupRef}
              labelRefs={labelRefs}
            />
          </motion.div>

          {/* Active era name */}
          <AnimatePresence mode="wait">
            <motion.div key={activeIdx}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Noto Sans KR'", fontSize: '9px',
                letterSpacing: '0.3em', color: C.muted, marginBottom: '6px' }}>
                CURRENT ERA
              </p>
              <p style={{ fontFamily: "'Noto Serif KR', serif",
                fontSize: '22px', fontWeight: 300,
                letterSpacing: '-0.01em', color: C.ink }}>
                {ERAS[activeIdx]?.era}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {ERAS.map((_, i) => (
              <motion.button key={i}
                onClick={() => scrollToEra(i)}
                animate={{
                  width: i === activeIdx ? 20 : 5,
                  backgroundColor: i === activeIdx ? C.ink : C.hairline,
                }}
                style={{ height: '5px', borderRadius: '9999px',
                  border: 'none', cursor: 'pointer', padding: 0 }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══ MEDIA GALLERY ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mediaWork && (
          <MediaGallery work={mediaWork} onClose={() => setMediaWork(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
