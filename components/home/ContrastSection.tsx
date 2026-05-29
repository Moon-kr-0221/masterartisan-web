'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ContrastSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // 배경 패럴랙스 — 좌우 이미지 반대 방향
  const leftBgY  = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const rightBgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section ref={ref} className="flex flex-col md:flex-row w-full overflow-hidden">

      {/* 왼쪽 — 다릅니다 (다크), 660px 고정 */}
      <motion.div
        className="relative flex-1 overflow-hidden"
        style={{ backgroundColor: '#0E0D0B', minHeight: '700px' }}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559825491-a529dd302927?auto=format&fit=crop&w=1080&q=80)', y: leftBgY, scale: 1.15 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(14,13,11,0.87) 0%, rgba(14,13,11,0) 60%)' }} />

        <div className="absolute bottom-[45px] left-[52px] z-10">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            className="section-label mb-4 block" style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            DIFFERENT THINKING
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            viewport={{ once: true, margin: '-40px' }}
            className="font-light"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '60px', letterSpacing: '-0.033em', color: '#FFFFFF', lineHeight: 1.43 }}
          >
            다릅니다
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}
            className="mt-4 text-[13px] leading-[1.85] max-w-[520px]"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)' }}
          >
            3대에 걸쳐 축적된 기술력과<br />독자적인 공법으로 만들어집니다.
          </motion.p>
        </div>
      </motion.div>

      {/* 오른쪽 — 바릅니다 (라이트), fill */}
      <motion.div
        className="relative flex-1 overflow-hidden"
        style={{ backgroundColor: '#F0EDE6', minHeight: '700px' }}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1688341750245-f16a2ce6e56d?auto=format&fit=crop&w=1080&q=80)', y: rightBgY, scale: 1.15 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(14,13,11,0.87) 0%, rgba(14,13,11,0) 60%)' }} />

        <div className="absolute bottom-[45px] right-[60px] z-10 text-right">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            className="section-label mb-4 block" style={{ color: '#AAAAAA' }}
          >
            RIGHT THINKING
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
            viewport={{ once: true, margin: '-40px' }}
            className="font-light"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '60px', letterSpacing: '-0.033em', color: '#FFFFFF', lineHeight: 1.43 }}
          >
            바릅니다
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}
            className="mt-4 text-[13px] leading-[1.85] max-w-[320px] ml-auto"
            style={{ fontFamily: 'var(--font-sans)', color: '#666666' }}
          >
            전통 목구조 기법 그대로,<br />원형을 존중하며 정직하게 짓습니다.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
