'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];
const EIN = [0.7, 0, 0.84, 0] as [number, number, number, number];

const LOGO = 'MASTERARTISAN'.split('');

export default function PageIntro() {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const FRAMES = 95;
    const iv = setInterval(() => {
      frame++;
      setPct(Math.min(100, Math.round((frame / FRAMES) * 100)));
      if (frame >= FRAMES) clearInterval(iv);
    }, 24);
    const t1 = setTimeout(() => setExiting(true), 2600);
    const t2 = setTimeout(() => setGone(true), 3800);
    return () => { clearInterval(iv); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none" aria-hidden>

      {/* ── 패널 1 (좌) ── */}
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{ width: '33.35%', backgroundColor: '#0D0C0A' }}
        animate={exiting ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 1.0, ease: E, delay: 0 }}
      >
        {/* grain overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />

        {/* 세로 장식선 */}
        <motion.div className="absolute right-0 top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.12) 60%, transparent 100%)' }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: E, delay: 0.1 }} />

        {/* 좌측 카운터 */}
        <motion.div
          className="absolute bottom-12 left-10 flex items-center gap-3"
          initial={{ opacity: 0 }} animate={{ opacity: exiting ? 0 : 0.5 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="h-px w-6" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', color: '#FFFFFF', letterSpacing: '2px' }}>
            SINCE 1960s
          </span>
        </motion.div>
      </motion.div>

      {/* ── 패널 2 (중앙·콘텐츠) ── */}
      <motion.div
        className="absolute top-0 h-full flex flex-col items-center justify-center"
        style={{ left: '33.35%', width: '33.3%', backgroundColor: '#0D0C0A', zIndex: 2 }}
        animate={exiting ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1.05, ease: E, delay: 0.07 }}
      >
        <div className="flex flex-col items-center gap-6 px-6">

          {/* 상단 가로선 */}
          <motion.div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            initial={{ width: 0 }} animate={{ width: 180 }}
            transition={{ duration: 0.7, ease: E, delay: 0.25 }} />

          {/* 로고 — 글자별 스태거 */}
          <div className="flex items-center" style={{ gap: 0 }}>
            {LOGO.map((ch, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: exiting ? 0 : 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.55, ease: E, delay: 0.45 + i * 0.04 }}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '3.5px' }}
              >{ch}</motion.span>
            ))}
          </div>

          {/* 서브타이틀 */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: exiting ? 0 : 0.45, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 1.1 }}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '8px', color: '#FFFFFF', letterSpacing: '3px', textAlign: 'center', lineHeight: 2 }}
          >
            경기무형문화재 제36호<br />TRADITIONAL ARCHITECTURE
          </motion.p>

          {/* 프로그레스 트랙 */}
          <motion.div className="flex items-center gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: exiting ? 0 : 0.6 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="relative overflow-hidden h-px w-20" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <motion.div className="absolute left-0 top-0 h-full bg-white"
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.1, ease: 'linear' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', minWidth: '30px' }}>
              {pct.toString().padStart(3, '0')}
            </span>
          </motion.div>

          {/* 하단 가로선 */}
          <motion.div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            initial={{ width: 0 }} animate={{ width: 180 }}
            transition={{ duration: 0.7, ease: E, delay: 0.4 }} />
        </div>

        {/* 중앙 패널 세로 장식선 (양쪽) */}
        {[-1, 1].map((side) => (
          <motion.div key={side}
            className="absolute top-0 h-full w-px"
            style={{ [side === -1 ? 'left' : 'right']: 0, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, transparent)' }}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: E, delay: 0.1 }} />
        ))}
      </motion.div>

      {/* ── 패널 3 (우) ── */}
      <motion.div
        className="absolute top-0 right-0 h-full"
        style={{ width: '33.35%', backgroundColor: '#0D0C0A' }}
        animate={exiting ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 1.0, ease: E, delay: 0.03 }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />

        <motion.div className="absolute left-0 top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.12) 60%, transparent)' }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: E, delay: 0.15 }} />

        {/* 우측 연도 */}
        <motion.div
          className="absolute bottom-12 right-10 flex items-center gap-3"
          initial={{ opacity: 0 }} animate={{ opacity: exiting ? 0 : 0.5 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', color: '#FFFFFF', letterSpacing: '2px' }}>
            NO. 36
          </span>
          <div className="h-px w-6" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
        </motion.div>
      </motion.div>

      {/* ── 전체 하단 프로그레스 바 ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)', zIndex: 3 }}>
        <motion.div className="h-full bg-white opacity-40"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.1, ease: 'linear' }} />
      </div>

    </div>
  );
}
