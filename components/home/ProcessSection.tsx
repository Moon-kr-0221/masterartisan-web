'use client';

import { motion } from 'framer-motion';

const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

const STEPS = [
  { num: '01', title: '목재 선별' },
  { num: '02', title: '치목 (治木)' },
  { num: '03', title: '가조립 검증' },
  { num: '04', title: '설치 및 마감' },
];

const TILES = [
  'photo-1703541585777-5b9349aa4f6f',
  'photo-1564067018527-8584aca23a04',
  'photo-1777589555761-c7bc2a082982',
  'photo-1758696654625-29937273a271',
];

export default function ProcessSection() {
  return (
    <>
      {/* ── 데스크탑 — d933990 완전 동일 ── */}
      <section className="hidden md:flex" style={{ height: '600px' }}>
        <motion.div className="flex flex-col"
          style={{ width: '480px', flexShrink: 0, backgroundColor: '#111111', padding: '60px 50px 124px 50px', gap: '28px' }}
          initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true, margin: '-60px' }}>
          <span style={{ fontFamily: SANS, fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '4px', textTransform: 'uppercase' }}>THE PROCESS</span>
          <h2 className="font-light" style={{ fontFamily: SERIF, fontSize: '48px', color: '#FFFFFF', lineHeight: 1.354, width: '380px' }}>장인의 혼을 담아</h2>
          <p style={{ fontFamily: SANS, fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, width: '360px' }}>
            나무를 선별하고, 결을 읽고, 깎고 이어 붙이는 모든 과정.<br />3대 장인의 손끝에서 전통건축의 혼이 담깁니다.
          </p>
          <div className="flex flex-col" style={{ width: '380px' }}>
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-center" style={{ gap: '16px', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: SANS, fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px', minWidth: '18px' }}>{step.num}</span>
                <span className="font-light" style={{ fontFamily: SERIF, fontSize: '15px', color: '#FFFFFF' }}>{step.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="flex-1 overflow-hidden" style={{ backgroundColor: '#1A1816', display: 'grid', gridTemplateColumns: '480fr 478fr', gridTemplateRows: '298px 300px', gap: '2px' }}>
          {TILES.map((pid) => (
            <div key={pid} className="relative overflow-hidden" style={{ backgroundColor: '#1A1816' }}>
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/${pid}?auto=format&fit=crop&w=800&q=80)` }} />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 모바일 — Pencil Ca5JX·C8GhxQ / d933990 mobile ── */}
      {/* #111111, padding [64,24], gap 32 */}
      <section className="md:hidden flex flex-col" style={{ backgroundColor: '#111111', padding: '64px 24px', gap: 32 }}>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 4, color: 'rgba(255,255,255,0.3)' }}>THE PROCESS</span>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: '#FFFFFF' }}>장인의 혼을 담아</h2>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.45)' }}>
            나무를 선별하고, 결을 읽고, 깎고 이어 붙이는 모든 과정. 3대 장인의 손끝에서 전통건축의 혼이 담깁니다.
          </p>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {STEPS.map((step) => (
            <li key={step.num} className="flex items-center" style={{ gap: 16, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.2)', minWidth: 18 }}>{step.num}</span>
              <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 300, color: '#FFFFFF' }}>{step.title}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {TILES.map((pid) => (
            <img key={pid} src={`https://images.unsplash.com/${pid}?auto=format&fit=crop&w=800&q=80`} alt=""
              style={{ height: 144, width: '100%', objectFit: 'cover', display: 'block' }} />
          ))}
        </div>
      </section>
    </>
  );
}
