'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const works = [
  { title: '수원화성 서북공심돈 보수', cat: '수리', year: '2023', bg: '/images/works/work-01.jpg', color: '#2A2218' },
  { title: '경복궁 근정전 유지보수', cat: '유지보수', year: '2023', bg: '/images/works/work-02.jpg', color: '#1E2018' },
  { title: '전통 목구조 누각 신축', cat: '제작', year: '2022', bg: '/images/works/work-03.jpg', color: '#181C1A' },
];

export default function WorksGrid() {
  return (
    <section style={{ backgroundColor: '#FAFAF8', padding: '0 48px 80px' }}>
      {/* 헤더 */}
      <motion.div
        className="flex items-end justify-between py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="flex flex-col gap-2">
          <span className="section-label">OUR WORKS</span>
          <h2
            className="font-light"
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', color: '#1A1A1A' }}
          >
            작업 사례
          </h2>
        </div>
        <Link
          href="/works"
          className="text-[12px] tracking-[0.1em] transition-opacity hover:opacity-50 mb-2"
          style={{ fontFamily: 'var(--font-sans)', color: '#888888' }}
        >
          전체 보기 →
        </Link>
      </motion.div>

      {/* 비대칭 그리드 */}
      <div className="flex gap-[3px]">
        {/* 왼쪽 큰 카드 */}
        <motion.div
          className="relative overflow-hidden"
          style={{ width: '55%', height: '560px', backgroundColor: works[0].color, flexShrink: 0 }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-out hover:scale-[1.04]"
            style={{ backgroundImage: `url(${works[0].bg})` }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
          <div className="absolute bottom-8 left-8">
            <p className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {works[0].cat} · {works[0].year}
            </p>
            <p className="font-light text-[20px]" style={{ fontFamily: 'var(--font-serif)', color: '#FFFFFF' }}>
              {works[0].title}
            </p>
          </div>
        </motion.div>

        {/* 오른쪽 두 카드 (세로) */}
        <div className="flex flex-col gap-[3px] flex-1">
          {works.slice(1).map((w, i) => (
            <motion.div
              key={w.title}
              className="relative overflow-hidden flex-1"
              style={{ backgroundColor: w.color, minHeight: '278px' }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-out hover:scale-[1.06]"
                style={{ backgroundImage: `url(${w.bg})` }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
              <div className="absolute bottom-6 left-6">
                <p className="section-label mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>
                  {w.cat} · {w.year}
                </p>
                <p className="font-light text-[15px]" style={{ fontFamily: 'var(--font-serif)', color: '#FFFFFF' }}>
                  {w.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
