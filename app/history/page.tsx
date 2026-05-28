'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { historyEras } from '@/data/history';

const TOTAL_ERAS = historyEras.length; // 7

export default function HistoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEra, setActiveEra] = useState(0);

  // 전체 스크롤: 7 * 100vh
  const { scrollYProgress } = useScroll({ target: containerRef });

  // 다이얼 회전: 스크롤 0→1 = 0→360° (한 바퀴)
  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const dialRotation = useSpring(rawRotation, { stiffness: 60, damping: 20 });

  // activeEra 업데이트
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(Math.floor(v * TOTAL_ERAS), TOTAL_ERAS - 1);
      setActiveEra(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  const era = historyEras[activeEra];

  return (
    // 전체 스크롤 컨테이너
    <div ref={containerRef} style={{ height: `${TOTAL_ERAS * 100}vh` }}>

      {/* ── 고정 뷰 ── */}
      <div className="sticky top-0 h-screen overflow-hidden flex"
        style={{ backgroundColor: '#FAFAF8' }}>

        {/* 상단 스크롤 진행 바 */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-50 origin-left"
          style={{ scaleX: scrollYProgress, height: '2px', backgroundColor: '#1A1A1A' }}
        />

        {/* NAV */}
        <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between h-[72px] px-12"
          style={{ borderBottom: '1px solid #E4E0D8', backgroundColor: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(12px)' }}>
          <a href="/" className="text-[13px] font-bold tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-sans)', color: '#1A1A1A' }}>
            MASTERARTISAN
          </a>
          <div className="hidden md:flex items-center gap-10">
            {[['/', 'HOME'], ['/masterartisan', 'MASTERARTISAN'], ['/history', 'HISTORY'], ['/works', 'WORKS'], ['/products', 'PRODUCT'], ['/contact', 'CONTACT']].map(([href, label]) => (
              <a key={href} href={href}
                className="text-[10px] tracking-[0.18em] transition-opacity hover:opacity-100"
                style={{ fontFamily: 'var(--font-sans)', color: href === '/history' ? '#1A1A1A' : '#AAAAAA' }}>
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── 좌측: 콘텐츠 ── */}
        <div className="flex flex-col justify-center px-14 pt-[72px] shrink-0"
          style={{ width: '50%', borderRight: '1px solid #E4E0D8' }}>

          {/* 에라 라벨 */}
          <AnimatePresence mode="wait">
            <motion.div key={activeEra + '_label'}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px" style={{ backgroundColor: '#AAAAAA' }} />
              <span className="section-label">{era.era}</span>
            </motion.div>
          </AnimatePresence>

          {/* 대형 연도 */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeEra + '_year'}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-light leading-none mb-8"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(72px, 10vw, 128px)', color: '#1A1A1A', letterSpacing: '-0.04em' }}>
              {era.works[0]?.year ?? era.era}
            </motion.h1>
          </AnimatePresence>

          {/* 작업 목록 */}
          <AnimatePresence mode="wait">
            <motion.ul key={activeEra + '_list'}
              initial="hidden" animate="visible" exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.04 } }, hidden: {} }}
              style={{ maxHeight: '340px', overflowY: 'hidden' }}>
              {era.works.map((work, i) => {
                const showYear = i === 0 || era.works[i - 1].year !== work.year;
                return (
                  <motion.li key={i}
                    variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
                    className="flex items-center gap-6 py-[8px]"
                    style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <span className="shrink-0 text-[10px] w-10 tabular-nums"
                      style={{ fontFamily: 'var(--font-sans)', color: '#BBBBBB' }}>
                      {showYear ? work.year : ''}
                    </span>
                    <span className="text-[12px] leading-[1.5] flex-1"
                      style={{ fontFamily: 'var(--font-sans)', color: '#444444' }}>
                      {work.title}
                    </span>
                    {work.hasMedia && (
                      <span className="shrink-0 text-[8px] px-2 py-[2px] tracking-widest"
                        style={{ border: '1px solid #E0E0E0', color: '#AAAAAA', fontFamily: 'var(--font-sans)' }}>
                        MEDIA
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* ── 우측: 입체 다이얼 ── */}
        <div className="flex-1 flex items-center justify-center relative">

          {/* 고정 기준선 (바늘) — 12시 방향 */}
          <div className="absolute top-[calc(50%-200px)] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
            <div className="w-[2px] h-8 rounded-full" style={{ backgroundColor: '#1A1A1A' }} />
            <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: '#1A1A1A' }} />
          </div>

          {/* 회전하는 다이얼 */}
          <motion.div
            style={{ rotate: dialRotation }}
            className="relative flex items-center justify-center"
            aria-hidden>

            {/* 외부 링 — 입체감 */}
            <div className="absolute rounded-full"
              style={{
                width: '420px', height: '420px',
                background: 'radial-gradient(circle at 35% 30%, #FFFFFF, #E8E4DC)',
                boxShadow: '8px 12px 32px rgba(0,0,0,0.12), -4px -4px 16px rgba(255,255,255,0.8), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.06)',
              }} />

            {/* 내부 링 */}
            <div className="absolute rounded-full"
              style={{
                width: '300px', height: '300px',
                background: 'radial-gradient(circle at 40% 35%, #F8F6F2, #ECEAE4)',
                boxShadow: 'inset 2px 3px 8px rgba(0,0,0,0.08), inset -1px -1px 4px rgba(255,255,255,0.9)',
                border: '1px solid rgba(0,0,0,0.05)',
              }} />

            {/* 가장 안쪽 — 중심 버튼 느낌 */}
            <div className="absolute rounded-full z-10"
              style={{
                width: '64px', height: '64px',
                background: 'radial-gradient(circle at 40% 35%, #FFFFFF, #D8D4CC)',
                boxShadow: '2px 3px 8px rgba(0,0,0,0.15), -1px -1px 4px rgba(255,255,255,0.9)',
              }} />

            {/* 에라 레이블 (원 둘레) */}
            {historyEras.map((e, i) => {
              const angle = (i / TOTAL_ERAS) * 360 - 90; // 12시부터 시계방향
              const rad = (angle * Math.PI) / 180;
              const r = 175; // 레이블 반지름
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              const isActive = i === activeEra;
              return (
                <div
                  key={e.era}
                  className="absolute flex flex-col items-center gap-1"
                  style={{ transform: `translate(${x}px, ${y}px)` }}>
                  {/* 틱 마크 */}
                  <div
                    style={{
                      width: isActive ? '2px' : '1px',
                      height: isActive ? '14px' : '8px',
                      backgroundColor: isActive ? '#1A1A1A' : '#BBBBBB',
                      transformOrigin: 'top',
                      transform: `rotate(${angle + 90}deg)`,
                    }} />
                  {/* 레이블 */}
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: isActive ? '10px' : '9px',
                      fontWeight: isActive ? '700' : '400',
                      color: isActive ? '#1A1A1A' : '#BBBBBB',
                      letterSpacing: '0.05em',
                      transform: `rotate(${-(angle + 90)}deg)`, // 항상 바로 읽히게
                      whiteSpace: 'nowrap',
                    }}>
                    {e.era}
                  </span>
                </div>
              );
            })}
          </motion.div>

        </div>

        {/* 하단 진행 표시 */}
        <div className="absolute bottom-8 left-14 flex items-center gap-4 z-30">
          <span className="text-[10px] tracking-[0.3em] tabular-nums"
            style={{ fontFamily: 'var(--font-sans)', color: '#AAAAAA' }}>
            {String(activeEra + 1).padStart(2, '0')} / {String(TOTAL_ERAS).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-[6px]">
            {historyEras.map((_, i) => (
              <motion.div key={i} className="rounded-full"
                animate={{
                  width: i === activeEra ? '20px' : '4px',
                  backgroundColor: i === activeEra ? '#1A1A1A' : '#D0CCC6',
                }}
                style={{ height: '4px' }}
                transition={{ duration: 0.3 }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
