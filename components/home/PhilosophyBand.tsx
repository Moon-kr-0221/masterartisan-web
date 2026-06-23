'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PhilosophyBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  return (
    <>
    {/* ── 모바일 — Pencil Ca5JX·x9W5nY ── */}
    <section className="md:hidden flex flex-col" style={{ backgroundColor: '#FFFFFF', padding: '64px 24px', gap: 24 }}>
      <div className="flex flex-col" style={{ gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: 3, color: '#AAAAAA', textTransform: 'uppercase' }}>BRAND PHILOSOPHY</span>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 300, lineHeight: 1.5, color: '#1A1A1A', letterSpacing: -1 }}>
          나무의 결을 읽고,<br />세월의 흔적을 존중하며,<br />전통의 기술로 미래를 짓습니다.
        </p>
      </div>
      <a href="/masterartisan"
        className="inline-flex items-center justify-center self-start transition-opacity duration-300 hover:opacity-60"
        style={{ height: 48, padding: '0 24px', border: '1px solid rgba(26,26,26,0.35)', fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1A1A1A', letterSpacing: 2 }}>
        장인 소개 →
      </a>
    </section>

    {/* ── 데스크탑 ── */}
    <section ref={ref} className="relative overflow-hidden items-center hidden md:flex" style={{ backgroundColor: '#FFFFFF', height: '360px' }}>
      {/* 배경 초대형 텍스트 — 패럴랙스 */}
      <motion.p
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-light select-none pointer-events-none"
        aria-hidden
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '150px',
          color: '#F0EDE6',
          letterSpacing: '-6px',
          lineHeight: 1,
          x: bgX,
        }}
      >
        다르게 — 더 바르게
      </motion.p>

      {/* 전경 콘텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-10"
        style={{ paddingLeft: '52px', paddingRight: '52px' }}
      >
        <div className="flex flex-col md:flex-row items-center gap-10">
          <span className="section-label shrink-0" style={{ letterSpacing: '3px' }}>BRAND PHILOSOPHY</span>
          <div className="w-px h-8 bg-[#DDDDDD] hidden md:block shrink-0" />
          <p
            className="font-light text-[18px] leading-[1.75] max-w-2xl"
            style={{ fontFamily: 'var(--font-serif)', color: '#1A1A1A' }}
          >
            나무의 결을 읽고, 세월의 흔적을 존중하며, 전통의 기술로 미래를 짓습니다.
          </p>
        </div>
        <a
          href="/masterartisan"
          className="shrink-0 inline-block transition-opacity duration-300 hover:opacity-60"
          style={{
            padding: '18px 44px',
            border: '1px solid rgba(26,26,26,0.35)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: '#1A1A1A',
            letterSpacing: '3px',
          }}
        >
          장인 소개
        </a>
      </motion.div>
    </section>
    </>
  );
}
