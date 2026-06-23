'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

export default function CtaSection() {
  return (
    <>
      {/* ── 데스크탑 — d933990 완전 동일 ── */}
      <section className="hidden md:block" style={{ backgroundColor: '#0D0C0A' }}>
        <div className="relative overflow-hidden" style={{ height: '360px', borderBottom: '1px solid #222222' }}>
          <span className="absolute select-none pointer-events-none font-bold whitespace-nowrap"
            style={{ fontFamily: SANS, fontSize: '120px', color: 'rgba(255,255,255,0.04)', letterSpacing: '8px', left: '114px', top: '160px' }} aria-hidden>
            MASTERARTISAN
          </span>
          <motion.div className="absolute flex flex-col" style={{ left: '52px', top: '134px', gap: '16px' }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true, margin: '-60px' }}>
            <h2 className="font-light" style={{ fontFamily: SERIF, fontSize: '40px', color: '#FFFFFF', lineHeight: 1.2, width: '608px' }}>
              전통건축을 의뢰하시겠습니까?
            </h2>
            <p style={{ fontFamily: SANS, fontSize: '14px', color: '#666666' }}>유지보수·수리·제작 모든 분야에 대한 문의를 환영합니다.</p>
          </motion.div>
          <motion.div className="absolute" style={{ right: '52px', top: '153px' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true, margin: '-60px' }}>
            <Link href="/contact" className="inline-block transition-opacity duration-300 hover:opacity-60"
              style={{ padding: '18px 44px', border: '1px solid rgba(255,255,255,0.35)', fontFamily: SANS, fontSize: '12px', color: '#FFFFFF', letterSpacing: '3px' }}>
              문의하기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 모바일 — Pencil Ca5JX·QL5Ep / d933990 mobile ── */}
      {/* #0D0C0A, padding [64,24], gap 24, border-bottom #222222 */}
      <section className="md:hidden flex flex-col"
        style={{ backgroundColor: '#0D0C0A', padding: '64px 24px', gap: 24, borderBottom: '1px solid #222222' }}>
        <div className="flex flex-col" style={{ gap: 12 }}>
          <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 4, color: 'rgba(255,255,255,0.3)' }}>START YOUR PROJECT</span>
          <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 300, lineHeight: 1.5, color: '#FFFFFF' }}>
            전통의 가치를<br />함께 짓겠습니다
          </h2>
        </div>
        <Link href="/contact"
          className="inline-flex items-center justify-center"
          style={{ height: 48, padding: '0 24px', border: '1px solid rgba(255,255,255,0.35)', fontFamily: SANS, fontSize: 12, letterSpacing: 2, color: '#FFFFFF', alignSelf: 'flex-start' }}>
          문의하기 →
        </Link>
      </section>
    </>
  );
}
