'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 플레이스홀더 — 실제 이미지로 교체 필요 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/home/hero.jpg)',
          backgroundColor: '#1A1208',
        }}
      />

      {/* 어두운 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(13,11,8,0.5) 0%, rgba(13,11,8,0.3) 50%, rgba(13,11,8,0.85) 100%)',
        }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-sm tracking-[0.4em] uppercase mb-8"
          style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
        >
          경기무형문화재 제36호
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
          style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
        >
          삼대의 손,
          <br />
          천년의 기술
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-lg md:text-xl mb-12 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-noto-serif-kr)' }}
        >
          3대를 이어온 전통건축의 혼으로
          <br className="hidden md:block" />
          대한민국의 소중한 문화유산을 보존합니다
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/masterartisan"
            className="px-10 py-4 text-sm tracking-[0.2em] transition-all duration-500 hover:scale-105"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#0D0B08',
              fontFamily: 'var(--font-kr-sans)',
              fontWeight: 700,
            }}
          >
            장인을 소개합니다
          </Link>
          <Link
            href="/works"
            className="px-10 py-4 text-sm tracking-[0.2em] transition-all duration-500 hover:scale-105"
            style={{
              border: '1px solid var(--color-timber-400)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-kr-sans)',
            }}
          >
            작업 보기
          </Link>
        </motion.div>
      </div>

      {/* 스크롤 유도 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="text-xs tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          SCROLL
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10"
          style={{ backgroundColor: 'var(--color-timber-400)' }}
        />
      </motion.div>
    </section>
  );
}