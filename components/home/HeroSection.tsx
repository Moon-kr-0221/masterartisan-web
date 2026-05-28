'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden bg-[#111111]">
      {/* 배경 패럴랙스 이미지 */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: 'url(/images/home/hero.jpg)', y: bgY }}
      />

      {/* 오버레이 */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.75) 100%)' }} />

      {/* 상단 우 — 배지 */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="absolute top-[88px] right-12 flex items-center gap-2 px-4 py-[6px]"
        style={{ border: '1px solid rgba(255,255,255,0.22)' }}
      >
        <span className="text-[9px] tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)' }}>
          경기무형문화재 제36호 · SINCE 1960s
        </span>
      </motion.div>

      {/* 메인 텍스트 */}
      <motion.div
        className="absolute bottom-[180px] left-12"
        style={{ y: textY, opacity }}
      >
        {/* 라인 1 */}
        <div className="clip-reveal">
          <motion.h1
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-light leading-none"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(56px, 7vw, 96px)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            삼대의 손,
          </motion.h1>
        </div>
        {/* 라인 2 */}
        <div className="clip-reveal">
          <motion.h1
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
            className="font-light leading-none"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(56px, 7vw, 96px)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            천년의 기술.
          </motion.h1>
        </div>

        {/* 영문 서브 카피 — 얇은 세리프, 에디토리얼 감성 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          className="mt-6 font-light"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(14px, 1.2vw, 18px)',
            color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.22em',
          }}
        >
          Heritage of Master Artisan
        </motion.p>
      </motion.div>

      {/* 하단 좌 — 페이지네이션 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-10 left-12 flex items-center gap-3"
      >
        <span className="text-[11px] font-bold tracking-widest text-white">01</span>
        <div className="w-8 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
        <span className="text-[11px] tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>04</span>
      </motion.div>

      {/* 하단 중앙 — 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[8px] tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
          SCROLL
        </span>
        <div className="relative w-px h-12 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <motion.div
            className="absolute top-0 left-0 w-full bg-white"
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: '50%' }}
          />
        </div>
      </motion.div>

      {/* 하단 우 — 링크 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 right-12"
      >
        <Link
          href="/masterartisan"
          className="text-[11px] tracking-[0.2em] transition-opacity duration-300 hover:opacity-60"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)' }}
        >
          장인 소개 →
        </Link>
      </motion.div>
    </section>
  );
}
