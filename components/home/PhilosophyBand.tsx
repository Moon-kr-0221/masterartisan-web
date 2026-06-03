'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

export default function PhilosophyBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);
  const isMobile = useIsMobile();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex items-center"
      style={{
        backgroundColor: '#FFFFFF',
        // 데스크탑: Pencil S2 Philosophy Band 높이 360 고정 / 모바일: 컴팩트
        height: isMobile ? 'auto' : 360,
        minHeight: isMobile ? 200 : undefined,
        padding: isMobile ? '48px 0' : '0',
      }}
    >
      {/* 배경 초대형 텍스트 — 패럴랙스 (Pencil BgPhrase 150px) */}
      <motion.p
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-light select-none pointer-events-none"
        aria-hidden
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: isMobile ? 60 : 'clamp(100px, 14vw, 180px)',
          color: '#F0EDE6',
          letterSpacing: '-0.04em',
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
        className="relative z-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-8"
        style={{ paddingLeft: isMobile ? 24 : 52, paddingRight: isMobile ? 24 : 52 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          <span className="section-label shrink-0">BRAND PHILOSOPHY</span>
          <div className="w-px h-8 bg-[#DDDDDD] hidden md:block shrink-0" />
          <p
            className="font-light leading-[1.75]"
            style={{ fontFamily: 'var(--font-serif)', color: '#1A1A1A', fontSize: isMobile ? 16 : 18 }}
          >
            나무의 결을 읽고, 세월의 흔적을 존중하며, 전통의 기술로 미래를 짓습니다.
          </p>
        </div>
        <a
          href="/masterartisan"
          className="shrink-0 inline-flex items-center justify-center transition-opacity duration-300 hover:opacity-60 self-start md:self-auto"
          style={{
            padding: isMobile ? '14px 32px' : '18px 44px',
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
  );
}
