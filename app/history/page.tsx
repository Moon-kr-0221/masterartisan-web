'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { historyEras } from '@/data/history';

export default function HistoryPage() {
  const [activeEra, setActiveEra] = useState(0);
  const era = historyEras[activeEra];

  return (
    <div className="pt-[72px]" style={{ backgroundColor: '#FAFAF8', minHeight: '100vh' }}>

      {/* 페이지 헤더 */}
      <section className="px-12 pt-16 pb-12" style={{ borderBottom: '1px solid #E4E0D8' }}>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-3">
            <span className="section-label">OUR HISTORY</span>
            <h1
              className="font-light leading-none"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 5vw, 56px)', color: '#1A1A1A' }}
            >
              1936 — 현재
            </h1>
            <p className="text-[14px] leading-[1.8]" style={{ fontFamily: 'var(--font-sans)', color: '#888888' }}>
              창업 이래 70여 년, 전국 사찰과 문화재에 새겨진 장인의 발자취입니다.
            </p>
          </div>
          <span
            className="text-[18px] font-light"
            style={{ fontFamily: 'var(--font-serif)', color: '#CCCCCC', letterSpacing: '0.05em' }}
          >
            총 80여 건
          </span>
        </div>
      </section>

      {/* 에라 탭 네비게이션 */}
      <div
        className="flex overflow-x-auto"
        style={{ borderBottom: '1px solid #E4E0D8', backgroundColor: '#FFFFFF' }}
      >
        {historyEras.map((e, i) => (
          <button
            key={e.era}
            onClick={() => setActiveEra(i)}
            className="shrink-0 px-6 py-4 text-[11px] tracking-[0.08em] transition-all duration-300"
            style={{
              fontFamily: 'var(--font-sans)',
              backgroundColor: activeEra === i ? '#1A1A1A' : 'transparent',
              color: activeEra === i ? '#FFFFFF' : '#AAAAAA',
              borderRight: '1px solid #F0EDE8',
            }}
          >
            {e.era}
          </button>
        ))}
      </div>

      {/* 메인: 에라 콘텐츠 */}
      <div className="flex min-h-[600px]">
        {/* 왼쪽: 에라 요약 */}
        <motion.div
          key={activeEra}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col gap-6 px-12 py-12 shrink-0"
          style={{ width: '280px', borderRight: '1px solid #E4E0D8', backgroundColor: '#FAFAF8' }}
        >
          <span
            className="font-light"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', color: '#EEEEEE', lineHeight: 1 }}
          >
            {String(activeEra + 1).padStart(2, '0')}
          </span>
          <div
            className="inline-flex px-3 py-1 self-start text-[11px] tracking-[0.06em]"
            style={{ border: '1px solid #1A1A1A', fontFamily: 'var(--font-sans)', color: '#1A1A1A' }}
          >
            {era.era}
          </div>
          <p className="text-[13px] leading-[1.8]" style={{ fontFamily: 'var(--font-sans)', color: '#AAAAAA' }}>
            총 {era.works.length}건
          </p>
        </motion.div>

        {/* 오른쪽: 작업 목록 */}
        <motion.div
          key={activeEra + '_list'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 px-12 py-8"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {era.works.map((work, i) => {
            const prevYear = i > 0 ? era.works[i - 1].year : null;
            const showYear = work.year !== prevYear;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="flex items-center gap-8 py-3"
                style={{ borderBottom: '1px solid #F5F3EF' }}
              >
                <span
                  className="shrink-0 w-12 text-[11px]"
                  style={{ fontFamily: 'var(--font-sans)', color: '#BBBBBB', letterSpacing: '0.05em' }}
                >
                  {showYear ? work.year : ''}
                </span>
                <span
                  className="text-[13px] flex-1"
                  style={{ fontFamily: 'var(--font-sans)', color: '#444444' }}
                >
                  {work.title}
                </span>
                {work.hasMedia && (
                  <span
                    className="shrink-0 text-[9px] px-2 py-[2px] tracking-widest"
                    style={{ border: '1px solid #E0E0E0', color: '#AAAAAA', fontFamily: 'var(--font-sans)' }}
                  >
                    MEDIA
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

    </div>
  );
}
