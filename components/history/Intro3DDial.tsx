'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Representative milestone years from the real masterartisan archive (1936–2016).
// 1936 (수덕사 대웅전 — the oldest recorded work) is the foundation anchor → lands at 12 o'clock.
const YEARS = [1936, 1958, 1972, 1984, 1995, 2005, 2011, 2016];
const RADIUS = 200;
const BOX = RADIUS * 2 + 96;

const GREEN = '#16261C';
const IVORY = '#F8F5F0';
const CREAM = '#F5F0E8';
const GOLD  = '#C4A882';

export default function Intro3DDial() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const dialRef    = useRef<HTMLDivElement>(null);
  const centerRef  = useRef<HTMLDivElement>(null);
  const hintRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Initial states ──────────────────────────────────────────────
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(dialRef.current, {
        rotationX: 72,        // tilted backwards — lying on the floor
        rotationZ: 90,        // off-aligned; will rotate CCW to settle 1936 at top
        autoAlpha: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set(centerRef.current, { autoAlpha: 0, y: 12 });

      // ── Phase 1: entrance (on load, no scroll) ──────────────────────
      gsap.timeline({ delay: 0.25 })
        .to(lineRef.current, { scaleY: 1, duration: 1.1, ease: 'power3.inOut' })
        .to(dialRef.current, { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, '-=0.25');

      // ── Phase 2 + 3: scroll-scrubbed ────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3200',
          scrub: 1,
          pin: pinRef.current,
          anticipatePin: 1,
        },
      });

      // Flatten (3D → 2D) + rotate CCW so 1936 lands at 12 o'clock
      tl.to(dialRef.current, { rotationX: 0, rotationZ: 0, duration: 4, ease: 'none' }, 0)
        // Line + scroll hint retire as the dial stands up
        .to([lineRef.current, hintRef.current], { autoAlpha: 0, duration: 1, ease: 'none' }, 0.4)
        // Central copy fades in once the dial is essentially flat
        .to(centerRef.current, { autoAlpha: 1, y: 0, duration: 1.5, ease: 'none' }, 4.2)
        // ── HOLD (5.7 → 7.6): flat dial + readable copy, no change ──
        // Phase 3: whole dial retires, background blends into the list section
        .to(pinRef.current, { autoAlpha: 0, duration: 1.6, ease: 'none' }, 7.8)
        .to(sectionRef.current, { backgroundColor: IVORY, duration: 1.6, ease: 'none' }, 7.6);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} style={{ position: 'relative', backgroundColor: GREEN }}>
      <div
        ref={pinRef}
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ── Vertical line: top-center → middle ── */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '1px',
            height: '50vh',
            marginLeft: '-0.5px',
            backgroundColor: 'rgba(245,240,232,0.55)',
          }}
        />

        {/* ── Scaling wrapper (responsive) ── */}
        <div className="scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-center">
          {/* ── Perspective container ── */}
          <div style={{
            position: 'relative',
            width: BOX,
            height: BOX,
            perspective: '1100px',
            perspectiveOrigin: '50% 42%',
          }}>
            {/* ── The 3D dial ── */}
            <div
              ref={dialRef}
              style={{
                position: 'relative',
                width: BOX,
                height: BOX,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* Orbit rings */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
                border: '1px solid rgba(245,240,232,0.16)' }} />
              <div style={{ position: 'absolute', inset: 48, borderRadius: '50%',
                border: '1px solid rgba(245,240,232,0.09)' }} />

              {/* Indicator: center → 1936 (top) */}
              <div style={{
                position: 'absolute', left: '50%', top: '50%',
                width: '1px', height: RADIUS,
                backgroundColor: 'rgba(196,168,130,0.85)',
                transformOrigin: 'top center',
                transform: 'translate(-50%, -100%)',
              }} />
              {/* Center pivot dot */}
              <div style={{
                position: 'absolute', left: '50%', top: '50%',
                width: 6, height: 6, marginLeft: -3, marginTop: -3,
                borderRadius: '50%', backgroundColor: GOLD,
              }} />

              {/* Year markers */}
              {YEARS.map((y, i) => {
                const angle = (i / YEARS.length) * 360; // 0° = top = 1936
                const isAnchor = i === 0;
                return (
                  <div
                    key={y}
                    style={{
                      position: 'absolute', left: '50%', top: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${RADIUS}px)`,
                    }}
                  >
                    {/* radial tick */}
                    <div style={{
                      width: '1px',
                      height: isAnchor ? 14 : 9,
                      margin: '0 auto',
                      backgroundColor: isAnchor ? CREAM : 'rgba(245,240,232,0.4)',
                    }} />
                    {/* upright year text */}
                    <div style={{
                      transform: `rotate(${-angle}deg)`,
                      marginTop: 8,
                      fontFamily: "'Playfair Display','Noto Serif KR',serif",
                      fontSize: isAnchor ? 19 : 14,
                      fontWeight: 400,
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      color: isAnchor ? CREAM : 'rgba(245,240,232,0.42)',
                    }}>
                      {y}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Central copy (faces camera; fades in when flat) ── */}
            <div
              ref={centerRef}
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none', width: 280,
              }}
            >
              <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: 10,
                letterSpacing: '0.32em', color: 'rgba(245,240,232,0.5)', marginBottom: 14 }}>
                SINCE 1936
              </p>
              <p style={{ fontFamily: "'Noto Serif KR',serif", fontSize: 27, fontWeight: 300,
                color: CREAM, letterSpacing: '-0.01em', lineHeight: 1.45 }}>
                70여 년,<br />전통의 토대를 쌓다
              </p>
            </div>
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div
          ref={hintRef}
          style={{
            position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}
        >
          <span style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: 8,
            letterSpacing: '0.32em', color: 'rgba(245,240,232,0.4)' }}>
            SCROLL
          </span>
          <div style={{ width: '1px', height: 36, backgroundColor: 'rgba(196,168,130,0.4)' }} />
        </div>
      </div>
    </div>
  );
}
