'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section
      className="flex flex-col md:flex-row items-center justify-between gap-8 px-12 py-20"
      style={{ backgroundColor: '#1A1A1A', borderTop: '1px solid #2A2A2A' }}
    >
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <h2
          className="font-light"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3vw, 36px)', color: '#FFFFFF' }}
        >
          전통건축을 의뢰하시겠습니까?
        </h2>
        <p className="text-[14px]" style={{ fontFamily: 'var(--font-sans)', color: '#666666' }}>
          유지보수·수리·제작 모든 분야에 대한 문의를 환영합니다.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <Link
          href="/contact"
          className="inline-block px-10 py-4 text-[12px] tracking-[0.2em] transition-colors duration-300 hover:bg-white hover:text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-sans)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          문의하기
        </Link>
      </motion.div>
    </section>
  );
}
