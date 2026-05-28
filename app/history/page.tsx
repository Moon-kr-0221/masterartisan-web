'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { historyEras } from '@/data/history';

// Three.js 캔버스는 SSR 없이 동적 로드
const OrbScene = dynamic(() => import('@/components/history/OrbScene'), { ssr: false });

// 에라별 색조 (HTML 오버레이 텍스트)
const ERA_TEXT_COLORS = [
  'rgba(200,120,64,0.9)',   // ~2011
  'rgba(80,160,200,0.9)',   // 2010~2001
  'rgba(180,160,100,0.9)',  // 2000~1991
  'rgba(180,100,60,0.9)',   // 1990~1981
  'rgba(190,110,50,0.9)',   // 1980~1971
  'rgba(160,90,40,0.9)',    // 1970~1961
  'rgba(140,80,30,0.9)',    // 1960~1951
];

export default function HistoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEra, setActiveEra] = useState(0);
  const [orbRotation, setOrbRotation] = useState(0);

  const { scrollYProgress } = useScroll({ container: containerRef });

  // 스크롤 → activeEra + orbRotation 동기화
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const eraIndex = Math.min(
        Math.floor(v * historyEras.length),
        historyEras.length - 1
      );
      setActiveEra(eraIndex);
      // 구체 회전: 스크롤 100% = 2π × 1.5 회전
      setOrbRotation(v * Math.PI * 3);
    });
    return unsub;
  }, [scrollYProgress]);

  const era = historyEras[activeEra];
  const accentColor = ERA_TEXT_COLORS[activeEra];

  return (
    <div
      ref={containerRef}
      className="relative overflow-y-scroll"
      style={{ height: '100vh' }}
    >
      {/* ── 스크롤 가능한 긴 컨테이너 (7 에라 × 100vh) ── */}
      <div style={{ height: `${historyEras.length * 100}vh` }}>

        {/* ── [고정] 3D 캔버스 배경 ── */}
        <div
          className="fixed inset-0 z-0"
          style={{ pointerEvents: 'none' }}
        >
          <OrbScene rotation={orbRotation} activeEra={activeEra} />
        </div>

        {/* ── [고정] HTML 오버레이 ── */}
        <div className="fixed inset-0 z-10 flex" style={{ pointerEvents: 'none' }}>

          {/* 좌측: 타이포 + 작업 목록 */}
          <div
            className="flex flex-col justify-center px-14 pt-[72px]"
            style={{ width: '52%', pointerEvents: 'auto' }}
          >
            {/* 에라 라벨 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEra + '_label'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-6 h-px" style={{ backgroundColor: accentColor }} />
                <span
                  className="text-[10px] tracking-[0.35em]"
                  style={{ fontFamily: 'var(--font-sans)', color: accentColor }}
                >
                  {era.era}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* 대형 연도 타이포 */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeEra + '_year'}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-light leading-none mb-6"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(80px, 12vw, 160px)',
                  color: 'rgba(255,255,255,0.88)',
                  letterSpacing: '-0.05em',
                }}
              >
                {/* 대표 연도: 에라의 첫 번째 연도 표시 */}
                {era.works[0]?.year ?? era.era}
              </motion.h1>
            </AnimatePresence>

            {/* 작업 목록 */}
            <AnimatePresence mode="wait">
              <motion.ul
                key={activeEra + '_list'}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: { transition: { staggerChildren: 0.04 } },
                  hidden: {},
                }}
                className="flex flex-col gap-0"
                style={{ maxHeight: '360px', overflowY: 'hidden' }}
              >
                {era.works.map((work, i) => {
                  const prevYear = i > 0 ? era.works[i - 1].year : null;
                  const showYear = work.year !== prevYear;
                  return (
                    <motion.li
                      key={i}
                      variants={{
                        hidden: { opacity: 0, x: -16 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
                      }}
                      className="flex items-center gap-6 py-[9px]"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span
                        className="shrink-0 text-[10px] w-10 tracking-[0.05em]"
                        style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.25)' }}
                      >
                        {showYear ? work.year : ''}
                      </span>
                      <span
                        className="text-[12px] leading-[1.5]"
                        style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.62)' }}
                      >
                        {work.title}
                      </span>
                      {work.hasMedia && (
                        <span
                          className="shrink-0 text-[8px] px-2 py-[2px] tracking-widest"
                          style={{ border: `1px solid ${accentColor}44`, color: accentColor, fontFamily: 'var(--font-sans)' }}
                        >
                          MEDIA
                        </span>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
          </div>

          {/* 우측: Orb 영역 (캔버스가 배경이므로 투명) */}
          <div className="flex-1" />
        </div>

        {/* ── [고정] GNB ── */}
        <nav
          className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-[72px] px-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <a
            href="/"
            className="text-[13px] font-bold tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-sans)', color: '#FFFFFF' }}
          >
            MASTERARTISAN
          </a>
          <nav className="hidden md:flex items-center gap-10">
            {[['/', 'HOME'], ['/masterartisan', 'MASTERARTISAN'], ['/history', 'HISTORY'], ['/works', 'WORKS'], ['/products', 'PRODUCT'], ['/contact', 'CONTACT']].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-[10px] tracking-[0.18em] transition-opacity hover:opacity-100"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: href === '/history' ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </nav>

        {/* ── [고정] 하단 스크롤 진행 표시 ── */}
        <div
          className="fixed bottom-8 left-12 z-20 flex items-center gap-4"
          style={{ pointerEvents: 'none' }}
        >
          <span
            className="text-[10px] tracking-[0.3em]"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.3)' }}
          >
            {String(activeEra + 1).padStart(2, '0')} / {String(historyEras.length).padStart(2, '0')}
          </span>
          <div className="w-32 h-px relative" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="absolute left-0 top-0 h-full"
              style={{ backgroundColor: accentColor }}
              animate={{ width: `${((activeEra + 1) / historyEras.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* 에라 탭 도트 */}
          <div className="flex items-center gap-2">
            {historyEras.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeEra ? '20px' : '4px',
                  height: '4px',
                  backgroundColor: i === activeEra ? accentColor : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
