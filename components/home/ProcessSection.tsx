'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // 배경 이미지 패럴랙스 (느리게 이동)
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  // 배경 마키 텍스트 (반대 방향)
  const textX = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ minHeight: '520px', backgroundColor: '#111111' }}>
      {/* 배경 이미지 — 패럴랙스 */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundColor: '#1F1B17', y: bgY }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(10, 8, 6, 0.72)' }} />

      {/* 배경 타이포 — 반대 방향 패럴랙스 */}
      <motion.p
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap select-none pointer-events-none font-bold"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '120px',
          color: 'rgba(255,255,255,0.03)',
          letterSpacing: '0.3em',
          x: textX,
        }}
        aria-hidden
      >
        HERITAGE · CRAFT · TRADITION · HERITAGE · CRAFT · TRADITION
      </motion.p>

      {/* 전경 콘텐츠 */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 px-12 py-24">
        <motion.div
          className="flex flex-col gap-7 max-w-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.35)' }}>THE PROCESS</span>
          <h2
            className="font-light leading-[1.2]"
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 4vw, 52px)', color: '#FFFFFF' }}
          >
            모든 공정은<br />손으로 완성됩니다
          </h2>
          <p className="text-[14px] leading-[1.9]" style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)' }}>
            나무를 선별하고, 결을 읽고, 깎고 이어 붙이는 모든 과정.<br />
            3대 장인의 손끝에서 전통건축의 혼이 담깁니다.
          </p>
          <Link
            href="/works"
            className="self-start text-[12px] tracking-[0.12em] transition-opacity hover:opacity-50"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.7)' }}
          >
            작업 사례 보기 →
          </Link>
        </motion.div>

        {/* 우측 — 공정 이미지 2x2 그리드 */}
        <motion.div
          className="grid grid-cols-2 flex-1 w-full"
          style={{ gap: 12 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {[
            ['목재 선별', 'photo-1703541585777-5b9349aa4f6f'],
            ['치목 (治木)', 'photo-1564067018527-8584aca23a04'],
            ['가조립 검증', 'photo-1768573263769-49bd0ddfa104'],
            ['설치 및 마감', 'photo-1758696654625-29937273a271'],
          ].map(([title, pid], i) => (
            <motion.div
              key={title}
              className="relative overflow-hidden"
              style={{ aspectRatio: '4 / 3' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(https://images.unsplash.com/${pid}?auto=format&fit=crop&w=800&q=80)`, backgroundColor: '#1A1816' }}
              />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
              <div className="absolute left-4 bottom-3 z-10">
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 300, color: '#FFFFFF' }}>
                  {title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
