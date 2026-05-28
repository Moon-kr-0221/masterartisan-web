'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ContrastSection() {
  return (
    <section className="flex flex-col md:flex-row w-full" style={{ minHeight: '620px' }}>

      {/* 왼쪽 — 다릅니다 (다크) */}
      <motion.div
        className="relative flex-1 overflow-hidden"
        style={{ backgroundColor: '#111111', minHeight: '620px' }}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.4s] ease-out hover:scale-105"
          style={{ backgroundImage: 'url(/images/home/contrast-dark.jpg)', backgroundColor: '#1A1410' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%)' }} />

        <div className="absolute bottom-12 left-10 z-10">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            className="section-label mb-4 block" style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            DIFFERENT THINKING
          </motion.span>
          <div className="clip-reveal">
            <motion.p
              initial={{ y: '105%' }} whileInView={{ y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              viewport={{ once: true }}
              className="font-light"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 4vw, 52px)', color: '#FFFFFF', lineHeight: 1.1 }}
            >
              다릅니다
            </motion.p>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}
            className="mt-4 text-[13px] leading-[1.8] max-w-[340px]"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)' }}
          >
            3대에 걸쳐 축적된 기술력과<br />독자적인 공법으로 만들어집니다.
          </motion.p>
        </div>
      </motion.div>

      {/* 오른쪽 — 바릅니다 (라이트) */}
      <motion.div
        className="relative flex-1 overflow-hidden"
        style={{ backgroundColor: '#FAFAF8', minHeight: '620px' }}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.4s] ease-out hover:scale-105"
          style={{ backgroundImage: 'url(/images/home/contrast-light.jpg)', backgroundColor: '#E8E4DC' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to left, rgba(250,250,248,0.9) 0%, rgba(250,250,248,0.3) 60%)' }} />

        <div className="absolute bottom-12 right-10 z-10 text-right">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            className="section-label mb-4 block" style={{ color: '#AAAAAA' }}
          >
            RIGHT THINKING
          </motion.span>
          <div className="clip-reveal">
            <motion.p
              initial={{ y: '105%' }} whileInView={{ y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              viewport={{ once: true }}
              className="font-light"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 4vw, 52px)', color: '#1A1A1A', lineHeight: 1.1 }}
            >
              바릅니다
            </motion.p>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}
            className="mt-4 text-[13px] leading-[1.8] max-w-[340px] ml-auto"
            style={{ fontFamily: 'var(--font-sans)', color: '#666666' }}
          >
            전통 목구조 기법 그대로,<br />원형을 존중하며 정직하게 짓습니다.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
