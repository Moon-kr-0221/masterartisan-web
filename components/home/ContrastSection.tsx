'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

const DEFAULT_LEFT  = 'https://images.unsplash.com/photo-1771411068495-11575ea96c51?auto=format&fit=crop&w=1080&q=80';
const DEFAULT_RIGHT = 'https://images.unsplash.com/photo-1655645888733-f0c9f8827a49?auto=format&fit=crop&w=1080&q=80';

export default function ContrastSection({ leftImage, rightImage }: { leftImage?: string; rightImage?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const leftBgY  = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const rightBgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const leftSrc  = (leftImage  && leftImage  !== '') ? leftImage  : DEFAULT_LEFT;
  const rightSrc = (rightImage && rightImage !== '') ? rightImage : DEFAULT_RIGHT;

  return (
    <>
      {/* ── 데스크탑 — d933990 완전 동일 ── */}
      <section ref={ref} className="flex-col md:flex-row w-full overflow-hidden hidden md:flex">
        <motion.div className="relative flex-1 overflow-hidden" style={{ backgroundColor: '#0E0D0B', minHeight: '700px' }}
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE }} viewport={{ once: true, margin: '-60px' }}>
          <motion.div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${leftSrc})`, y: leftBgY, scale: 1.15 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,13,11,0.87) 0%, rgba(14,13,11,0) 60%)' }} />
          <div className="absolute z-10 bottom-[45px] left-[52px]">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
              className="section-label mb-4 block" style={{ color: 'rgba(255,255,255,0.35)' }}>DIFFERENT THINKING</motion.span>
            <motion.p initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE }} viewport={{ once: true, margin: '-40px' }}
              className="font-light" style={{ fontFamily: SERIF, fontSize: '60px', letterSpacing: '-0.033em', color: '#FFFFFF', lineHeight: 1.43 }}>다릅니다</motion.p>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}
              className="mt-4 text-[13px] leading-[1.85] max-w-[520px]"
              style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.5)' }}>3대에 걸쳐 축적된 기술력과<br />독자적인 공법으로 만들어집니다.</motion.p>
          </div>
        </motion.div>
        <motion.div className="relative flex-1 overflow-hidden" style={{ backgroundColor: '#F0EDE6', minHeight: '700px' }}
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE }} viewport={{ once: true, margin: '-60px' }}>
          <motion.div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${rightSrc})`, y: rightBgY, scale: 1.15 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,13,11,0.87) 0%, rgba(14,13,11,0) 60%)' }} />
          <div className="absolute z-10 text-right bottom-[45px] right-[60px]">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
              className="section-label mb-4 block" style={{ color: '#AAAAAA' }}>RIGHT THINKING</motion.span>
            <motion.p initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.25, ease: EASE }} viewport={{ once: true, margin: '-40px' }}
              className="font-light" style={{ fontFamily: SERIF, fontSize: '60px', letterSpacing: '-0.033em', color: '#FFFFFF', lineHeight: 1.43 }}>바릅니다</motion.p>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}
              className="mt-4 text-[13px] leading-[1.85] max-w-[320px] ml-auto"
              style={{ fontFamily: SANS, color: '#666666' }}>전통 목구조 기법 그대로,<br />원형을 존중하며 정직하게 짓습니다.</motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── 모바일 — Pencil Ca5JX·TUOIh / d933990 mobile ── */}
      {/* #F0EDE6 래퍼, 다릅니다/바릅니다 320px 세로 스택 */}
      <section className="md:hidden" style={{ backgroundColor: '#F0EDE6' }}>
        {[
          { img: leftSrc,  title: '다릅니다', sub: '남들과 다른 길을 걷습니다' },
          { img: rightSrc, title: '바릅니다', sub: '원칙을 바르게 지킵니다' },
        ].map((item) => (
          <article key={item.title} className="relative overflow-hidden" style={{ height: 320, backgroundColor: '#0E0D0B' }}>
            <img src={item.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(14,13,11,0.87) 100%)' }} />
            <div className="absolute" style={{ bottom: 28, left: 24 }}>
              <h3 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#FFFFFF' }}>{item.title}</h3>
              <p style={{ fontFamily: SANS, fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>{item.sub}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
