'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function useIsMobile(bp = 768) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const up = () => setV(mq.matches);
    up();
    mq.addEventListener('change', up);
    return () => mq.removeEventListener('change', up);
  }, [bp]);
  return v;
}

export default function CtaSection() {
  const isMobile = useIsMobile();

  return (
    <section style={{ backgroundColor: '#0D0C0A' }}>
      {isMobile ? (
        /* 모바일: flex 세로 스택 */
        <div style={{ padding: '64px 24px', borderBottom: '1px solid #222222', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2
              className="font-light"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: '#FFFFFF', lineHeight: 1.25 }}
            >
              전통건축을 의뢰하시겠습니까?
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#666666' }}>
              유지보수·수리·제작 모든 분야에 대한 문의를 환영합니다.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-block transition-opacity duration-300 hover:opacity-60 self-start"
            style={{ padding: '14px 36px', border: '1px solid rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontSize: 12, color: '#FFFFFF', letterSpacing: '3px' }}
          >
            문의하기
          </Link>
        </div>
      ) : (
        /* 데스크탑: d933990 absolute 레이아웃 */
        <div
          className="relative overflow-hidden"
          style={{ height: '360px', borderBottom: '1px solid #222222' }}
        >
          {/* 배경 대형 로고 */}
          <span
            className="absolute select-none pointer-events-none font-bold whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '120px',
              color: 'rgba(255,255,255,0.04)',
              letterSpacing: '8px',
              left: '114px',
              top: '160px',
            }}
            aria-hidden
          >
            MASTERARTISAN
          </span>

          {/* 좌 — 헤드카피 + 서브카피 */}
          <motion.div
            className="absolute flex flex-col"
            style={{ left: '52px', top: '134px', gap: '16px' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <h2
              className="font-light"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', color: '#FFFFFF', lineHeight: 1.2, width: '608px' }}
            >
              전통건축을 의뢰하시겠습니까?
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#666666' }}>
              유지보수·수리·제작 모든 분야에 대한 문의를 환영합니다.
            </p>
          </motion.div>

          {/* 우 — 문의하기 버튼 */}
          <motion.div
            className="absolute"
            style={{ right: '52px', top: '153px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <Link
              href="/contact"
              className="inline-block transition-opacity duration-300 hover:opacity-60"
              style={{ padding: '18px 44px', border: '1px solid rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#FFFFFF', letterSpacing: '3px' }}
            >
              문의하기
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
}
