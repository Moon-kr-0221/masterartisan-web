'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── constants ─────────────────────────────────────────────── */
const YEARS  = [1936, 1958, 1972, 1984, 1995, 2005, 2011, 2016];
const N      = YEARS.length;
const BOX    = 1000;         // SVG viewBox side
const CX     = BOX / 2;
const CY     = BOX / 2;
const R_RING = 340;          // main clock ring radius
const R_IN   = 265;          // inner faint ring
const R_LBL  = 388;          // year-label radius (just outside ring)
const R_TICK = 372;          // year tick: a short mark straddling the ring
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
const yearDeg = (i: number) => (i / N) * 360 - 90; // -90 = 12 o'clock

/* ─── component ─────────────────────────────────────────────── */
export default function ClockIntro() {
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
  const copyRef    = useRef<HTMLDivElement>(null);

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
      gsap.set(copyRef.current,  { opacity: 0, y: 16 });
      // markers begin as a tiny cluster at centre, then spiral out doing a FULL turn
      gsap.set(orbitRef.current, { opacity: 0, scale: 0.07, rotation: -420, svgOrigin: `${CX} ${CY}` });
      labelRefs.current.forEach((el) => gsap.set(el, { opacity: 0 }));

      /* ── master scroll timeline ─────────────────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     '+=8400',
          scrub:   1.6,
          pin:     pinRef.current,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0 → 1.5): the line draws from the top of the screen to the centre
      tl.to(lineRef.current, { scaleY: 1, ease: 'none', duration: 1.5 }, 0)
        .to(dotRef.current,  { opacity: 1, scale: 1, ease: 'back.out(2.5)', duration: 0.5 }, 1.1)
        .to(hintRef.current, { opacity: 0, ease: 'none', duration: 0.7 }, 0.3);

      // Phase 2 (1.3 → 2.3): line fades; the tilted dial + ring fade in, lying flat
      tl.to(lineRef.current, { opacity: 0, ease: 'none', duration: 0.6 }, 1.3)
        .to(dotRef.current,  { opacity: 0, ease: 'none', duration: 0.4 }, 1.5)
        .to(dialRef.current, { opacity: 1, ease: 'none', duration: 0.9 }, 1.5)
        .to(ringRef.current, { opacity: 1, ease: 'none', duration: 1.0 }, 1.9);

      // Phase 3 (2.6 → 5.6): ON THE FLOOR — markers spiral out from a tiny rotating
      //   circle and grow to fill the screen. Layered eases give speed dynamics (강약):
      //   a fast burst out of the centre, a hard decelerate, and a radius "pop".
      tl.to(orbitRef.current, { opacity: 1, ease: 'power1.in',     duration: 0.4 }, 2.6)
        .to(orbitRef.current, { rotation: 0, ease: 'expo.out',     duration: 1.9 }, 2.6)
        .to(orbitRef.current, { scale: 1,    ease: 'back.out(1.2)', duration: 2.3 }, 2.7);

      // Labels fade up, staggered, as the orbit settles into place (uniform opacity)
      labelRefs.current.forEach((el, i) => {
        tl.to(el, { opacity: 0.72, ease: 'none', duration: 0.6 }, 4.0 + i * 0.1);
      });

      // Minute ticks + centre pivot fill in — clock now COMPLETE, still flat
      tl.to(pivotRef.current, { opacity: 1, ease: 'none', duration: 0.5 }, 5.2)
        .to(minorRef.current, { opacity: 1, ease: 'power1.inOut', duration: 1.0 }, 5.4);

      // ── HOLD beat: the finished dial rests flat on the floor ──

      // Phase 4 (6.4 → 9.8): the completed dial stands up — rotateX 72° → 0°
      //                       (3D → 2D), 1936 settling at 12:00
      tl.to(dialRef.current, { rotationX: 0, ease: 'power2.inOut', duration: 3.4 }, 6.4);

      // Phase 5 (10.0 → 13.8): the gold hand appears at 12:00 and sweeps a full 360°
      //   clockwise across the whole screen, then fades out before the copy
      tl.to(handRef.current,  { opacity: 1, ease: 'none', duration: 0.4 }, 10.0)
        .to(handRef.current,  { rotation: 360, svgOrigin: `${CX} ${CY}`, ease: 'power1.inOut', duration: 3.4 }, 10.4)
        .to(handRef.current,  { opacity: 0, ease: 'none', duration: 0.6 }, 13.8)
        .to(pivotRef.current, { opacity: 0, ease: 'none', duration: 0.6 }, 13.8);

      // Phase 6 (14.4 → 15.9): centre copy fades up only after the hand has gone
      tl.to(copyRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: 1.5 }, 14.4);

      // Phase 7: fade out → blend into the archive
      tl.to(pinRef.current,     { opacity: 0, ease: 'none', duration: 0.9 }, 16.4)
        .to(sectionRef.current, { backgroundColor: IVORY, ease: 'none', duration: 1.1 }, 16.2);
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
            width: 1, height: '50vh', marginLeft: -0.5,
            backgroundColor: 'rgba(245,240,232,0.7)',
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
              width: 'min(900px, 92vmin)',
              height: 'min(900px, 92vmin)',
              willChange: 'transform',
            }}
          >
            <svg
              viewBox={`0 0 ${BOX} ${BOX}`}
              width="100%" height="100%"
              style={{ overflow: 'visible', display: 'block' }}
            >
              {/* Concentric rings */}
              <g ref={(el) => { ringRef.current = el; }}>
                <circle cx={CX} cy={CY} r={R_RING} fill="none"
                  stroke="rgba(245,240,232,0.34)" strokeWidth={1.2} />
                <circle cx={CX} cy={CY} r={R_IN} fill="none"
                  stroke="rgba(245,240,232,0.16)" strokeWidth={0.9} />
              </g>

              {/* Minute ticks */}
              <g ref={(el) => { minorRef.current = el; }}>
                {Array.from({ length: MINOR }).map((_, i) => {
                  const deg   = (i / MINOR) * 360 - 90;
                  const major = i % 5 === 0;
                  const p0    = polar(deg, R_RING - (major ? 15 : 8));
                  const p1    = polar(deg, R_RING);
                  return (
                    <line key={i}
                      x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y}
                      stroke={major ? 'rgba(245,240,232,0.62)' : 'rgba(245,240,232,0.32)'}
                      strokeWidth={major ? 1.1 : 0.7} />
                  );
                })}
              </g>

              {/* ── Year markers: screen-spanning radial lines + radial labels ── */}
              <g ref={(el) => { orbitRef.current = el; }}>
                {YEARS.map((year, i) => {
                  const deg    = yearDeg(i);
                  const t0     = polar(deg, R_RING - 8);
                  const t1     = polar(deg, R_TICK);    // short tick at the ring
                  const lp     = polar(deg, R_LBL);
                  // radial orientation: text baseline faces the centre
                  const labelRot = (i / N) * 360;
                  return (
                    <g key={year}>
                      {/* all year ticks identical: thick + clearly visible */}
                      <line
                        x1={t0.x} y1={t0.y} x2={t1.x} y2={t1.y}
                        stroke="rgba(245,240,232,0.7)"
                        strokeWidth={2}
                      />
                      <text
                        ref={(el) => { labelRefs.current[i] = el; }}
                        x={lp.x} y={lp.y}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={19}
                        fontFamily="'Noto Serif KR', serif"
                        fontWeight={400}
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
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 14, textAlign: 'center', pointerEvents: 'none', zIndex: 5,
          }}
        >
          <span style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 10, letterSpacing: '0.32em', color: 'rgba(245,240,232,0.5)',
          }}>
            SINCE 1936
          </span>
          <span style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: 27, fontWeight: 300, lineHeight: 1.45, color: CREAM,
          }}>
            70여 년,<br />전통의 토대를 쌓다
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
