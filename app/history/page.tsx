'use client';

import {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { historyEras } from '@/data/history';
import ClockIntro from '@/components/history/ClockIntro';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ERAS = [...historyEras].reverse(); // oldest → newest
const TOTAL = ERAS.length; // 7

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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

// ─── SVG Dial ───────────────────────────────────────────────────────────────
interface DialProps {
  activeIdx: number;
  // GSAP will animate these refs directly — no React state per frame
  groupRef:  React.RefObject<SVGGElement | null>;
  labelRefs: React.MutableRefObject<(SVGTextElement | null)[]>;
}

function HistoryDial({ activeIdx, groupRef, labelRefs }: DialProps) {
  const CX = 240, CY = 240;
  const R = { outer: 210, track: 168, inner: 122, center: 68, label: 186 };

  const polar = (deg: number, r: number) => ({
    x: Math.round((CX + r * Math.cos((deg * Math.PI) / 180)) * 100) / 100,
    y: Math.round((CY + r * Math.sin((deg * Math.PI) / 180)) * 100) / 100,
  });

  // Era i at angle starting from 12 o'clock, clockwise
  const eraAngle = (i: number) => -90 + (i / TOTAL) * 360;

  return (
    <svg viewBox="0 0 480 480" width="100%" height="100%"
      style={{ overflow: 'hidden' }}>

      {/* ── ROTATING RING (GSAP controls transform directly) ── */}
      <g ref={groupRef} style={{ transformOrigin: `${CX}px ${CY}px` }}>

        {/* Concentric orbits */}
        {[R.outer, R.track, R.inner].map((r, i) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none"
            stroke={i === 0 ? '#C8C3BA' : C.hairline}
            strokeWidth={i === 0 ? 0.8 : 0.5} />
        ))}

        {/* Fine tick marks */}
        {Array.from({ length: 42 }).map((_, i) => {
          const a = -90 + (i / 42) * 360;
          const p0 = polar(a, R.inner - 3);
          const p1 = polar(a, R.inner + 5);
          const major = i % 6 === 0;
          return (
            <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y}
              stroke={major ? '#B8B3AA' : C.hairline}
              strokeWidth={major ? 0.7 : 0.35} />
          );
        })}

        {/* Era ticks + labels — labels counter-rotated by GSAP */}
        {ERAS.map((era, i) => {
          const a = eraAngle(i);
          const t0 = polar(a, R.inner - 6);
          const t1 = polar(a, R.track + 8);
          const lp = polar(a, R.label);
          const isActive = i === activeIdx;
          return (
            <g key={era.era}>
              <line x1={t0.x} y1={t0.y} x2={t1.x} y2={t1.y}
                stroke={isActive ? C.ink : '#C8C3BA'}
                strokeWidth={isActive ? 1.0 : 0.5} />
              {/*
                Label: GSAP will set `transform: rotate(Xdeg)` on this element
                to counter-rotate it back to upright as the dial rotates.
                transformBox + transformOrigin make it rotate around its own center.
              */}
              <text
                ref={(el) => { labelRefs.current[i] = el; }}
                x={lp.x} y={lp.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={isActive ? 9.5 : 8.5}
                fontFamily="'Noto Sans KR', sans-serif"
                fontWeight={isActive ? '600' : '300'}
                fill={isActive ? C.ink : C.muted}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center center',
                  transition: 'fill 0.5s, font-size 0.4s',
                }}
              >
                {era.era}
              </text>
            </g>
          );
        })}

        {/* Center dot on pivot */}
        <circle cx={CX} cy={CY} r={2.2} fill={C.ink} />
      </g>

      {/* ══ FIXED ELEMENTS — never rotate ══════════════════════════════ */}

      {/* Fixed clock hand: always points straight UP (12 o'clock) */}
      <line
        x1={CX} y1={CY - R.center + 1}
        x2={CX} y2={CY - R.track + 2}
        stroke={C.ink} strokeWidth={0.7}
      />
      {/* Hand tip dot */}
      <circle cx={CX} cy={CY - R.track + 2} r={2.6} fill={C.ink} />

      {/* Fixed 12 o'clock top marker */}
      <line x1={CX} y1={CY - R.outer - 8} x2={CX} y2={CY - R.outer}
        stroke={C.ink} strokeWidth={1.4} />
      <circle cx={CX} cy={CY - R.outer - 11} r={2} fill={C.ink} />

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
            {ERAS[activeIdx].era}
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
function EraSection({ era, eraIdx, isActive, sectionRef }: {
  era: (typeof ERAS)[number];
  eraIdx: number;
  isActive: boolean;
  sectionRef: React.RefCallback<HTMLElement>;
}) {
  const byYear: Record<string, typeof era.works> = {};
  era.works.forEach((w) => {
    const k = String(w.year);
    (byYear[k] ??= []).push(w);
  });
  const years = Object.keys(byYear).sort((a, b) => Number(a) - Number(b));

  return (
    <section ref={sectionRef} id={`era-${eraIdx}`}
      style={{ padding: '96px 64px 80px', borderBottom: `1px solid ${C.hairline}` }}>

      <FadeUp>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '20px', height: '1px', backgroundColor: C.accent }} />
          <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '9px',
            letterSpacing: '0.4em', color: C.accent, textTransform: 'uppercase' }}>
            {String(eraIdx + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
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
            {byYear[year].map((work, wi) => (
              <FadeUp key={wi} delay={yi * 0.04 + wi * 0.03 + 0.06}>
                <div style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '11px 0',
                  borderBottom: `1px solid ${C.hairline}` }}>
                  <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '13px',
                    lineHeight: 1.65, color: C.inkSoft, fontWeight: 300 }}>
                    {work.title}
                  </span>
                  {work.hasMedia && (
                    <span style={{ fontFamily: "'Noto Sans KR'", fontSize: '8px',
                      letterSpacing: '0.2em', color: C.muted,
                      border: `1px solid ${C.hairline}`, padding: '2px 8px',
                      marginLeft: '16px', flexShrink: 0 }}>
                      MEDIA
                    </span>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const [activeIdx, setActiveIdx] = useState(0);

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

      // 1. Continuous scrub: rotate entire ring 0 → -360° as page scrolls
      //    GSAP directly animates the SVG <g> — zero React re-renders per frame
      gsap.to(dialGroupRef.current, {
        rotation: -360,
        ease: 'none',
        transformOrigin: '50% 50%',   // relative to the element's bbox
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.6,                 // 1.6 s lag = cinematic inertia
          onUpdate(self) {
            // Counter-rotate each label so it always reads upright
            const currentDeg = -(self.progress * 360);
            labelRefs.current.forEach((el) => {
              if (el) gsap.set(el, { rotation: -currentDeg });
            });
          },
        },
      });

      // 2. Track which era is in view (only activeIdx, no rotation logic here)
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

      // 3. Fade-up for every work row
      gsap.utils.toArray<HTMLElement>('.work-row').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Tab scroll-to ─────────────────────────────────────────────────────────
  const scrollToEra = useCallback((i: number) => {
    const el = i < 0 ? sectionRefs.current[0] : sectionRefs.current[i];
    if (el) lenisRef.current?.scrollTo(el, { offset: -120, duration: 1.8 });
  }, []);

  const tabs = ['ALL', ...ERAS.map((e) => e.era)];

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, minHeight: '100vh' }}>

      {/* ══ STORY HEADER ════════════════════════════════════════════════════ */}
      <section style={{
        padding: '120px 80px 100px',
        backgroundColor: C.bg,
        borderBottom: `1px solid ${C.hairline}`,
      }}>
        <p style={{
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: 10, letterSpacing: '0.38em',
          color: C.accent, marginBottom: 28,
          textTransform: 'uppercase',
        }}>
          HISTORY · 장인 이야기
        </p>
        <h1 style={{
          fontFamily: "'Noto Serif KR', serif",
          fontSize: 'clamp(48px, 6vw, 86px)',
          fontWeight: 300,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: C.ink,
          marginBottom: 36,
          maxWidth: 780,
        }}>
          천년의 기술,<br />
          삼대로 이어온 90년의 여정
        </h1>
        <p style={{
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: 14, lineHeight: 1.9,
          color: C.muted, fontWeight: 300,
          maxWidth: 440,
        }}>
          1936년부터 3대에 걸쳐 이어온 전통 목구조 건축 기법의 발자취를 따라갑니다.
        </p>
      </section>

      {/* ══ CLOCK INTRO ANIMATION ════════════════════════════════════════════ */}
      <ClockIntro />

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

        {/* ── LEFT: scrollable (58%) ─────────────────────────────────────── */}
        <div ref={leftRef} style={{ width: '58%', borderRight: `1px solid ${C.hairline}` }}>

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
                70여 년의<br />장인 이야기
              </h1>
            </BlurReveal>
            <BlurReveal delay={0.16}>
              <p style={{ fontFamily: "'Noto Sans KR'", fontSize: '13px',
                color: C.muted, lineHeight: 1.9, maxWidth: '380px', fontWeight: 300 }}>
                전통 한옥 건축의 길을 묵묵히 걸어온 70년의 기록.<br />
                한 땀 한 땀 새긴 시간들이 오늘의 마스터아티잔을 만들었습니다.
              </p>
            </BlurReveal>
            <BlurReveal delay={0.24}>
              <div style={{ display: 'flex', gap: '48px', marginTop: '48px' }}>
                {[['70+', '년간 활동'], ['90+', '완공 프로젝트'], ['3', '대를 이은 기술']].map(([n, l]) => (
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
              isActive={i === activeIdx}
              sectionRef={(el: HTMLElement | null) => { sectionRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* ── RIGHT: sticky dial (42%) ────────────────────────────────────── */}
        <div style={{
          width: '42%',
          position: 'sticky',
          top: 'calc(var(--nav-h, 72px) + 49px)',
          height: 'calc(100vh - var(--nav-h, 72px) - 49px)',
          transition: 'top 0.3s ease, height 0.3s ease',
          display: 'flex',
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
                {ERAS[activeIdx].era}
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
    </div>
  );
}
