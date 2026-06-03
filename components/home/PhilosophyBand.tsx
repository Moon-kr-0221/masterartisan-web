'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

export default function PhilosophyBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  return (
    <>
      {/* ── 데스크탑 — d933990 완전 동일 ── */}
      <section ref={ref} className="relative overflow-hidden flex items-center hidden md:flex" style={{ backgroundColor: '#FFFFFF', height: '360px' }}>
        <motion.p
          className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-light select-none pointer-events-none"
          aria-hidden
          style={{ fontFamily: SERIF, fontSize: 'clamp(100px, 14vw, 180px)', color: '#F0EDE6', letterSpacing: '-0.04em', lineHeight: 1, x: bgX }}
        >
          다르게 — 더 바르게
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="relative z-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-10"
          style={{ paddingLeft: '52px', paddingRight: '52px' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <span className="section-label shrink-0">BRAND PHILOSOPHY</span>
            <div className="w-px h-8 bg-[#DDDDDD] hidden md:block shrink-0" />
            <p className="font-light text-[18px] leading-[1.75] max-w-2xl" style={{ fontFamily: SERIF, color: '#1A1A1A' }}>
              나무의 결을 읽고, 세월의 흔적을 존중하며, 전통의 기술로 미래를 짓습니다.
            </p>
          </div>
          <a href="/masterartisan" className="shrink-0 inline-block transition-opacity duration-300 hover:opacity-60"
            style={{ padding: '18px 44px', border: '1px solid rgba(26,26,26,0.35)', fontFamily: SANS, fontSize: '12px', color: '#1A1A1A', letterSpacing: '3px' }}>
            장인 소개
          </a>
        </motion.div>
      </section>

      {/* ── 모바일 — Pencil Ca5JX·x9W5nY / d933990 mobile ── */}
      {/* #FFFFFF, padding [64,24], gap 24, layout vertical */}
      <section className="md:hidden" style={{ backgroundColor: '#FFFFFF', padding: '64px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="flex items-center" style={{ gap: 16 }}>
          <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 3, color: '#AAAAAA' }}>BRAND PHILOSOPHY</span>
          <div style={{ width: 1, height: 16, backgroundColor: '#DDDDDD' }} />
        </div>
        <p style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 300, lineHeight: 1.6, color: '#1A1A1A' }}>
          나무의 결을 읽고, 세월의 흔적을 존중하며, 전통의 기술로 미래를 짓습니다.
        </p>
        <a
          href="/masterartisan"
          style={{ display: 'inline-flex', height: 48, alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(26,26,26,0.35)', padding: '0 24px', fontFamily: SANS, fontSize: 12, letterSpacing: 3, color: '#1A1A1A', alignSelf: 'flex-start' }}
        >
          장인 소개 →
        </a>
      </section>
    </>
  );
}
