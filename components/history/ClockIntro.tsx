'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── constants ─────────────────────────────────────────────── */
// Fallback milestone years used when no history data is supplied.
const DEFAULT_YEARS = [1936, 1958, 1972, 1984, 1995, 2005, 2015, 2026];
const BOX    = 1000;         // SVG viewBox side
const CX     = BOX / 2;
const CY     = BOX / 2;
const R_RING = 340;          // main clock tick-circle radius
const R_LBL  = 365;          // year-label radius — 시 마커 끝(R_RING)에서 1920 기준 16px 간격
const R_HAND = 950;          // sweeping hand reaches across the whole screen
const MINOR  = 60;           // minute-tick count
const TILT   = 72;           // floor tilt — rotateX 72° (per design spec)

const GREEN = '#16261C';
const IVORY = '#F8F5F0';
const GOLD  = '#C4A882';
const CREAM = '#F5F0E8';

const round = (n: number) => Math.round(n * 100) / 100; // stable SSR/CSR serialization
const polar = (deg: number, r: number) => ({
  x: round(CX + r * Math.cos((deg * Math.PI) / 180)),
  y: round(CY + r * Math.sin((deg * Math.PI) / 180)),
});

/* ─── component ─────────────────────────────────────────────── */
export default function ClockIntro({ years }: { years?: number[] }) {
  // Marker years are data-driven (from the history archive); fall back to defaults.
  const YEARS = years && years.length >= 2 ? years : DEFAULT_YEARS;
  const N = YEARS.length;
  const yearDeg = (i: number) => (i / N) * 360 - 90; // -90 = 12 o'clock

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const dotRef     = useRef<HTMLDivElement>(null);
  const hintRef    = useRef<HTMLDivElement>(null);
  const dialRef    = useRef<HTMLDivElement>(null);   // 3-D rotating wrapper
  const orbitRef   = useRef<SVGGElement | null>(null); // year-marker orbit
  const ringRef    = useRef<SVGGElement | null>(null);
  const minorRef   = useRef<SVGGElement | null>(null);
  const handRef    = useRef<SVGGElement | null>(null); // sweeping clock hand
  const pivotRef   = useRef<SVGCircleElement | null>(null);
  const labelRefs  = useRef<(SVGTextElement | null)[]>([]);
  const copyRef         = useRef<HTMLDivElement>(null);
  const copy2Ref        = useRef<HTMLDivElement>(null);
  const copy2KickerRef  = useRef<HTMLSpanElement>(null);
  const copy2TitleRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── initial states ─────────────────────────────────────── */
      gsap.set(lineRef.current,  { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(dotRef.current,   { opacity: 0, scale: 0 });
      // dial begins tilted 72° — lying down on the floor (per spec)
      gsap.set(dialRef.current,  { opacity: 0, rotationX: TILT });
      gsap.set(ringRef.current,  { opacity: 0 });
      gsap.set(minorRef.current, { opacity: 0 });
      gsap.set(pivotRef.current, { opacity: 0 });
      gsap.set(handRef.current,  { opacity: 0, rotation: 0, svgOrigin: `${CX} ${CY}` });
      // kbdY0: 순수 opacity 페이드인 (y 이동 없음)
      gsap.set(copyRef.current,  { opacity: 0 });
      // JWTY5: 자식(eyebrow→title) 개별 시간차 페이드인 — 컨테이너는 항상 보임
      gsap.set(copy2Ref.current, { opacity: 1 });
      gsap.set(copy2KickerRef.current, { opacity: 0 });
      gsap.set(copy2TitleRef.current,  { opacity: 0 });
      // markers begin as a tiny cluster at centre, then spiral out doing a FULL turn
      gsap.set(orbitRef.current, { opacity: 0, scale: 0.07, rotation: -420, svgOrigin: `${CX} ${CY}` });
      labelRefs.current.forEach((el) => gsap.set(el, { opacity: 0 }));

      /* ── master scroll timeline ─────────────────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     '+=6500',
          scrub:   1.0,
          pin:     pinRef.current,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0 → 1.5): the line draws from the top of the screen to the centre
      tl.to(lineRef.current, { scaleY: 1, ease: 'none', duration: 1.5 }, 0)
        .to(dotRef.current,  { opacity: 1, scale: 1, ease: 'back.out(2.5)', duration: 0.5 }, 1.1)
        .to(hintRef.current, { opacity: 0, ease: 'none', duration: 0.7 }, 0.3);

      // Phase 2: line + centre dot STAY on screen; the tilted dial + ring fade in, lying flat
      tl.to(dialRef.current, { opacity: 1, ease: 'none', duration: 0.9 }, 1.5)
        .to(ringRef.current, { opacity: 1, ease: 'none', duration: 1.0 }, 1.9);

      // Phase 3 (2.6 → 5.6): ON THE FLOOR — markers spiral out from a tiny rotating
      //   circle and grow to fill the screen. Layered eases give speed dynamics (강약):
      //   a fast burst out of the centre, a hard decelerate, and a radius "pop".
      tl.to(orbitRef.current, { opacity: 1, ease: 'power1.in',     duration: 0.4 }, 2.6)
        .to(orbitRef.current, { rotation: 0, ease: 'expo.out',     duration: 1.9 }, 2.6)
        .to(orbitRef.current, { scale: 1,    ease: 'back.out(1.2)', duration: 2.3 }, 2.7);

      // Labels fade up, staggered, as the orbit settles into place (uniform opacity)
      labelRefs.current.forEach((el, i) => {
        tl.to(el, { opacity: 0.95, ease: 'none', duration: 0.6 }, 4.0 + i * 0.1);
      });

      // After year/hour markers settle, BEFORE the minute ticks: the dial gives a
      //   subtle scale "breath" — pops up slightly, then returns to 1.
      tl.to(dialRef.current, { scale: 1.05, ease: 'power2.out',   duration: 0.3 }, 5.0)
        .to(dialRef.current, { scale: 1,    ease: 'power2.inOut', duration: 0.5 }, 5.3);

      // Minute ticks fill in — clock now COMPLETE, still flat (centre dot already present from Phase 1)
      tl.to(minorRef.current, { opacity: 1, ease: 'power1.inOut', duration: 1.0 }, 5.9);

      // ── HOLD beat: the finished dial rests flat on the floor ──

      // Phase 4 (6.4 → 9.8): the completed dial stands up — rotateX 72° → 0°
      //                       (3D → 2D), 1936 settling at 12:00
      tl.to(dialRef.current, { rotationX: 0, ease: 'power2.inOut', duration: 3.4 }, 6.4);

      // Phase 5 (10.4 → 13.8): the SAME drawn line — kept on screen the whole time —
      //   sweeps a full 360° clockwise about the centre, then fades out before the copy.
      //   No separate hand: the line never disappears-and-reappears.
      //   It also lengthens (scaleY) as it turns so it spans the ENTIRE screen
      //   instead of being cut short.
      // 먼저 화면을 가로지를 길이로 늘린 뒤(11.0 완료) → 그 다음 "일정한 길이"로 360° 회전
      //   (길이와 회전을 동시에 하면 회전 초반 구간에서 선이 짧게 보이는 문제 방지)
      tl.to(lineRef.current,  { transformOrigin: 'center bottom', scaleY: 5, ease: 'power2.out', duration: 0.6 }, 10.4)
        .to(lineRef.current,  { rotation: 360, ease: 'power1.inOut', duration: 2.8 }, 11.0)
        // 마지막엔 페이드아웃이 아니라 화면 위로 슬라이드되어 사라짐 — 선(CZvIS)과 중심점(XvqxL)이 함께
        .to([lineRef.current, dotRef.current], { y: () => -(window.innerHeight * 1.4), ease: 'power2.in', duration: 1.6 }, 13.8);

      // Phase 6a (14.4 → 15.8): kbdY0 — 투명도만 올리면서 등장 (y 이동 없음)
      tl.to(copyRef.current, { opacity: 1, ease: 'power2.out', duration: 1.4 }, 14.4);

      // Phase 6b (16.6 → 17.6): kbdY0 페이드아웃
      tl.to(copyRef.current, { opacity: 0, ease: 'power2.in', duration: 1.0 }, 16.6);

      // Phase 6c: JWTY5 — eyebrow 먼저(17.8), 제목은 0.7s 시간차 두고(18.5) opacity 페이드인
      tl.to(copy2KickerRef.current, { opacity: 1, ease: 'power2.out', duration: 0.9 }, 17.8);
      tl.to(copy2TitleRef.current,  { opacity: 1, ease: 'power2.out', duration: 1.1 }, 18.5);

      // Phase 7: 두 번째 카피가 보인 뒤 → 화면 전환(아카이브로 블렌드)
      tl.to(pinRef.current,     { opacity: 0, ease: 'none', duration: 0.9 }, 20.4)
        .to(sectionRef.current, { backgroundColor: IVORY, ease: 'none', duration: 1.1 }, 20.2);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div ref={sectionRef} style={{ position: 'relative', backgroundColor: GREEN }}>
      <div
        ref={pinRef}
        style={{
          height: '100vh', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Phase 1: vertical line draws from top → centre */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute', top: 0, left: '50%',
            width: 2, height: '50vh', marginLeft: -1,
            backgroundColor: '#FFFFFF',
            pointerEvents: 'none', zIndex: 4,
          }}
        />
        <div
          ref={dotRef}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 10, height: 10, marginLeft: -5, marginTop: -5,
            borderRadius: '50%', backgroundColor: CREAM,
            zIndex: 6, pointerEvents: 'none',
          }}
        />

        {/* ── 3-D perspective stage — fills the viewport ──────────── */}
        <div style={{ perspective: '1600px', perspectiveOrigin: '50% 58%' }}>
          <div
            ref={dialRef}
            style={{
              position: 'relative',
              // 시계 원형(눈금원) 지름 = 0.68 × dial. 1920px 기준 790px → dial ≈ 1162px.
              width: 'min(1162px, 60.5vw)',
              height: 'min(1162px, 60.5vw)',
              willChange: 'transform',
            }}
          >
            <svg
              viewBox={`0 0 ${BOX} ${BOX}`}
              width="100%" height="100%"
              style={{ overflow: 'visible', display: 'block' }}
            >
              {/* 원형 링 라인 제거 — 눈금(ticks)과 연도만으로 시계를 표현 */}
              <g ref={(el) => { ringRef.current = el; }} />

              {/* Minute ticks */}
              <g ref={(el) => { minorRef.current = el; }}>
                {Array.from({ length: MINOR }).map((_, i) => {
                  const deg = (i / MINOR) * 360 - 90;
                  // 분 마커 — 5분 단위 구분 없이 전부 균일한 길이·색
                  const p0  = polar(deg, R_RING - 9);
                  const p1  = polar(deg, R_RING);
                  return (
                    <line key={i}
                      x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y}
                      stroke="rgba(245,240,232,0.4)"
                      strokeWidth={1} />
                  );
                })}
              </g>

              {/* ── Year markers: screen-spanning radial lines + radial labels ── */}
              <g ref={(el) => { orbitRef.current = el; }}>
                {YEARS.map((year, i) => {
                  const deg    = yearDeg(i);
                  // 시 마커: 1920 기준 길이 64px (= 55 × dial스케일 1.162), 원 안쪽으로만
                  const t0     = polar(deg, R_RING - 55);
                  const t1     = polar(deg, R_RING);   // ends at the rim — never crosses it
                  const lp     = polar(deg, R_LBL);
                  // radial orientation: text baseline faces the centre
                  const labelRot = (i / N) * 360;
                  return (
                    <g key={year}>
                      {/* hour markers (numbered positions only): 1920 기준 두께 2px (= 1.72 × 1.162) */}
                      <line
                        x1={t0.x} y1={t0.y} x2={t1.x} y2={t1.y}
                        stroke="rgba(245,240,232,0.9)"
                        strokeWidth={2}
                      />
                      <text
                        ref={(el) => { labelRefs.current[i] = el; }}
                        x={lp.x} y={lp.y + 5}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={30}
                        fontFamily="'Noto Serif KR', serif"
                        fontWeight={600}
                        fill={CREAM}
                        style={{
                          transformBox: 'fill-box',
                          transformOrigin: 'center',
                          transform: `rotate(${labelRot}deg)`,
                        }}
                      >
                        {year}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Sweeping hand — rotates one full turn clockwise, then fades before the copy */}
              <g ref={(el) => { handRef.current = el; }}>
                <line x1={CX} y1={CY} x2={CX} y2={CY - R_HAND} stroke={GOLD} strokeWidth={1.8} />
              </g>

              {/* Centre pivot */}
              <circle ref={(el) => { pivotRef.current = el; }}
                cx={CX} cy={CY} r={6} fill={GOLD} />
            </svg>
          </div>
        </div>

        {/* Centre copy — fades in once the dial is upright */}
        <div
          ref={copyRef}
          style={{
            position: 'absolute', top: 'calc(47.5%)', left: '50%',
            transform: 'translate(-50%,-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 20, textAlign: 'center', pointerEvents: 'none', zIndex: 5,
          }}
        >
          <span style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 14, letterSpacing: '0.34em', color: 'rgba(245,240,232,0.55)',
          }}>
            SINCE 1936
          </span>
          <span style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: 52, fontWeight: 300, lineHeight: 1.4, color: CREAM,
          }}>
            90여 년,<br />전통의 토대를 쌓다
          </span>
        </div>

        {/* Centre copy #2 — 첫 카피가 사라진 뒤 등장 (모바일 num2와 동일) */}
        <div
          ref={copy2Ref}
          style={{
            position: 'absolute', top: 'calc(47.5%)', left: '50%',
            transform: 'translate(-50%,-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 20, textAlign: 'center', pointerEvents: 'none', zIndex: 5,
          }}
        >
          <span ref={copy2KickerRef} style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 14, letterSpacing: '0.34em', color: 'rgba(245,240,232,0.55)',
          }}>
            三代 · THREE GENERATIONS
          </span>
          <span ref={copy2TitleRef} style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: 52, fontWeight: 300, lineHeight: 1.4, color: CREAM,
          }}>
            끊임없는 정진으로<br />미래를 잇다
          </span>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          style={{
            position: 'absolute', bottom: 40, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 10, pointerEvents: 'none', zIndex: 5,
          }}
        >
          <span style={{
            fontFamily: "'Noto Sans KR',sans-serif",
            fontSize: 8, letterSpacing: '0.35em',
            color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase',
          }}>
            SCROLL
          </span>
          <div style={{ width: 1, height: 36, backgroundColor: 'rgba(196,168,130,0.4)' }} />
        </div>
      </div>
    </div>
  );
}
