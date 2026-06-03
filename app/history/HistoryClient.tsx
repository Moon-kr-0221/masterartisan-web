'use client';

import {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import type { HistoryEraGroup, HistoryWorkItem } from '@/lib/data/types';
import { milestoneYears } from '@/lib/data/era';
import ClockIntro from '@/components/history/ClockIntro';

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
      width: isMobile ? '100%' : 460,
      height: isMobile ? 'auto' : 440,
      aspectRatio: isMobile ? '460 / 440' : undefined,
      maxWidth: '100%', flexShrink: 0,
      overflow: 'hidden', backgroundColor: C.surface,
    }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
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

// ─── Era section ─────────────────────────────────────────────────────────────
function EraSection({ era, eraIdx, total, isActive, sectionRef, onOpenMedia }: {
  era: HistoryEraGroup;
  eraIdx: number;
  total: number;
  isActive: boolean;
  sectionRef: React.RefCallback<HTMLElement>;
  onOpenMedia: (work: HistoryWorkItem) => void;
}) {
  const byYear: Record<string, HistoryWorkItem[]> = {};
  era.works.forEach((w) => {
    const k = String(w.year);
    (byYear[k] ??= []).push(w);
  });
  const years = Object.keys(byYear).sort((a, b) => Number(a) - Number(b));

  return (
    <section ref={sectionRef} id={`era-${eraIdx}`}
      className="px-6 py-14 md:px-16 md:pt-24 md:pb-20"
      style={{ borderBottom: `1px solid ${C.hairline}` }}>

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
              const hasGallery = work.media.length > 0;
              return (
                <FadeUp key={work.id ?? wi} delay={yi * 0.04 + wi * 0.03 + 0.06}>
                  <div style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '11px 0',
                    borderBottom: `1px solid ${C.hairline}` }}>
                    <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '13px',
                      lineHeight: 1.65, color: C.inkSoft, fontWeight: 300 }}>
                      {work.title}
                    </span>
                    {hasGallery ? (
                      <button
                        type="button"
                        onClick={() => onOpenMedia(work)}
                        style={{ fontFamily: "'Noto Sans KR'", fontSize: '8px',
                          letterSpacing: '0.2em', color: C.ink, backgroundColor: 'transparent',
                          border: `1px solid ${C.ink}`, padding: '3px 9px',
                          marginLeft: '16px', flexShrink: 0, cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          transition: 'background-color 0.25s, color 0.25s' }}
                        className="hover:bg-[#1A1714] hover:text-white">
                        MEDIA <span style={{ opacity: 0.7 }}>· {work.media.length}</span>
                      </button>
                    ) : work.hasMedia ? (
                      <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '8px',
                        letterSpacing: '0.2em', color: C.muted,
                        border: `1px solid ${C.hairline}`, padding: '2px 8px',
                        marginLeft: '16px', flexShrink: 0 }}>
                        MEDIA
                      </span>
                    ) : null}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Media gallery lightbox ──────────────────────────────────────────────────
function MediaGallery({ work, onClose }: { work: HistoryWorkItem; onClose: () => void }) {
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
              <div style={{ width: '100%', backgroundColor: C.surface, overflow: 'hidden' }}>
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
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HistoryClient({ eras }: { eras: HistoryEraGroup[] }) {
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

  // ── Lenis ────────────────────────────────────────────────────────────────
  useEffect(() => {
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
    return () => { lenis.destroy(); };
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

  // ── Tab scroll-to ─────────────────────────────────────────────────────────
  const scrollToEra = useCallback((i: number) => {
    const el = i < 0 ? sectionRefs.current[0] : sectionRefs.current[i];
    if (el) lenisRef.current?.scrollTo(el, { offset: -120, duration: 1.8 });
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
        padding: isMobile ? '104px 24px 48px' : '120px 80px 100px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: '0 1 auto', minWidth: 0 }}>
          <p style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 10, letterSpacing: '0.38em',
            color: C.accent,
            textTransform: 'uppercase',
          }}>
            HISTORY · 장인 이야기
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
            천년의 기술,<br />
            삼대로 이어온<br />
            90년의 여정
          </h1>
          <p style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 14, lineHeight: isMobile ? 1.8 : 1.9,
            color: C.muted, fontWeight: 300,
            maxWidth: isMobile ? '100%' : 452,
          }}>
            1936년부터 3대에 걸쳐 이어온 전통 목구조 건축 기법의 발자취를 따라갑니다.
          </p>
        </div>

        <HeaderImage src={HISTORY_HEADER_IMG} alt="전통 목조 건축 처마와 살창" isMobile={isMobile} />
      </section>

      {/* ══ CLOCK INTRO ANIMATION ════════════════════════════════════════════ */}
      <ClockIntro years={clockYears} />

      {/* ══ STICKY TAB BAR — 고정 네비(pE4bF) 바로 아래에 붙어 함께 이동 ════════ */}
      <div style={{
        position: 'sticky',
        top: 'var(--nav-h, 72px)',
        zIndex: 40,
        transition: 'top 0.3s ease',
        backgroundColor: `${C.bg}F2`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.hairline}`,
        display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {tabs.map((tab, i) => {
          const active = i === 0
            ? activeIdx === 0
            : ERAS[i - 1]?.era === ERAS[activeIdx]?.era;
          return (
            <button key={tab}
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

        {/* ── LEFT: scrollable — 모바일 100%, 데스크탑 58% ──────────────────── */}
        <div ref={leftRef} style={{ width: isMobile ? '100%' : '58%', borderRight: isMobile ? 'none' : `1px solid ${C.hairline}` }}>

          {/* Hero */}
          <div style={{ padding: '88px 64px 72px', borderBottom: `1px solid ${C.hairline}` }}>
            <BlurReveal>
              <p style={{ fontFamily: "'Noto Sans KR'", fontSize: '9px',
                letterSpacing: '0.4em', color: C.accent, marginBottom: '28px' }}>
                HISTORY
              </p>
            </BlurReveal>
            <BlurReveal delay={0.08}>
              <h1 style={{ fontFamily: "'Noto Serif KR', serif",
                fontSize: 'clamp(48px, 6vw, 88px)',
                fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.04em',
                color: C.ink, marginBottom: '32px' }}>
                90여 년의<br />장인 이야기
              </h1>
            </BlurReveal>
            <BlurReveal delay={0.16}>
              <p style={{ fontFamily: "'Noto Sans KR'", fontSize: '13px',
                color: C.muted, lineHeight: 1.9, maxWidth: '380px', fontWeight: 300 }}>
                전통 한옥 건축의 길을 묵묵히 걸어온 90년의 기록.<br />
                한 땀 한 땀 새긴 시간들이 오늘의 마스터아티잔을 만들었습니다.
              </p>
            </BlurReveal>
            <BlurReveal delay={0.24}>
              <div style={{ display: 'flex', gap: '48px', marginTop: '48px' }}>
                {[['90+', '년간 활동'], ['70+', '완공 프로젝트'], ['3', '대를 이은 기술']].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Noto Serif KR', serif",
                      fontSize: '36px', fontWeight: 300,
                      letterSpacing: '-0.02em', color: C.ink, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: "'Noto Sans KR'", fontSize: '9px',
                      letterSpacing: '0.12em', color: C.muted, marginTop: '6px' }}>{l}</div>
                  </div>
                ))}
              </div>
            </BlurReveal>
          </div>

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
            />
          ))}
        </div>

        {/* ── RIGHT: sticky dial — 모바일 숨김, 데스크탑 42% ────────────── */}
        <div style={{
          display: isMobile ? 'none' : 'flex',
          width: '42%',
          position: 'sticky',
          top: 'calc(var(--nav-h, 72px) + 49px)',
          height: 'calc(100vh - var(--nav-h, 72px) - 49px)',
          transition: 'top 0.3s ease, height 0.3s ease',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
