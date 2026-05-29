'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1577735518457-06de4c9d81ca?auto=format&fit=crop&w=1600&q=80',
    h1a: '천년의 기술',
    h1b: '삼대의 손',
    sub: 'Heritage of Master Artisan',
  },
  {
    image: 'https://images.unsplash.com/photo-1559825491-a529dd302927?auto=format&fit=crop&w=1600&q=80',
    h1a: '다름이',
    h1b: '우리의 방식.',
    sub: 'Different Thinking, Different Making',
  },
  {
    image: 'https://images.unsplash.com/photo-1688341750245-f16a2ce6e56d?auto=format&fit=crop&w=1600&q=80',
    h1a: '전통을 담아',
    h1b: '미래를 짓습니다.',
    sub: 'Traditional Craft, Timeless Space',
  },
  {
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=1600&q=80',
    h1a: '기술이 아닌,',
    h1b: '예술로 짓습니다.',
    sub: 'Crafted Beyond Convention',
  },
];

const INTERVAL = 5500;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const startedAt = Date.now();
    const raf = { id: 0 };

    function tick() {
      const elapsed = Date.now() - startedAt;
      const p = Math.min(elapsed / INTERVAL, 1);
      setProgress(p);
      if (p < 1) {
        raf.id = requestAnimationFrame(tick);
      } else {
        advance();
      }
    }
    raf.id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.id);
  }, [current, advance]);

  const slide = SLIDES[current];
  const pgnLabel = String(current + 1).padStart(2, '0');

  // 마우스 패럴랙스
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const textX  = useTransform(springX, [-1, 1], [-14, 14]);
  const textY  = useTransform(springY, [-1, 1], [-8, 8]);
  const bgX    = useTransform(springX, [-1, 1], [10, -10]);
  const bgY    = useTransform(springY, [-1, 1], [6, -6]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      mouseX.set(((e.clientX - left) / width  - 0.5) * 2);
      mouseY.set(((e.clientY - top)  / height - 0.5) * 2);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[700px] overflow-hidden"
      style={{ backgroundColor: '#0D0C0A' }}
    >
      {/* 슬라이드 배경 — Ken Burns 줌 */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})`, x: bgX, y: bgY }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 7, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </AnimatePresence>

      {/* 그라디언트 오버레이 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(170deg, rgba(13,12,10,0) 0%, rgba(13,12,10,0.73) 55%, rgba(13,12,10,0.94) 100%)',
        }}
      />

      {/* 메인 텍스트 — 인트로 패널 퇴장(~2.7s) 이후 reveal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${current}`}
          className="absolute left-[52px]"
          style={{ top: '46.875%', x: textX, y: textY }}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: current === 0 ? 2.9 : 0 }}
        >
          {/* 단일 텍스트 블록, 줄바꿈 포함 */}
          <h1
            className="font-light"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(52px, 6.94vw, 100px)',
              color: '#FFFFFF',
              lineHeight: 1.3,
              marginBottom: '30px',
            }}
          >
            {slide.h1a}<br />{slide.h1b}
          </h1>
          {/* 서브타이틀 */}
          <motion.p
            className="font-light"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: current === 0 ? 3.4 : 0.3 }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(14px, 1.39vw, 20px)',
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: '8px',
              lineHeight: 1,
              paddingLeft: '10px',
            }}
          >
            {slide.sub}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* 하단 우 — 영문 서브카피 */}
      <motion.div
        className="absolute"
        style={{ right: '100px', top: '87.5%', width: '380px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 3.2 }}
      >
        <p
          className="text-right text-[13px] leading-[1.7]"
          style={{
            fontFamily: 'var(--font-sans)',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '1px',
          }}
        >
          We Make Quality<br />That Stands the Test of Time.
        </p>
      </motion.div>

      {/* 하단 좌 — 페이지네이션 */}
      <motion.div
        className="absolute flex items-center"
        style={{ left: '52px', bottom: '8%', gap: '10px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.0 }}
      >
        <span
          className="text-[11px] font-bold tabular-nums"
          style={{
            fontFamily: 'var(--font-sans)',
            color: '#FFFFFF',
            letterSpacing: '2px',
          }}
        >
          {pgnLabel}
        </span>
        <div
          className="relative h-px"
          style={{ width: '40px', backgroundColor: 'rgba(255,255,255,0.25)' }}
        >
          <div
            className="absolute left-0 top-0 h-full bg-white"
            style={{ width: `${progress * 100}%`, transition: 'none' }}
          />
        </div>
        <span
          className="text-[11px]"
          style={{
            fontFamily: 'var(--font-sans)',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '2px',
          }}
        >
          04
        </span>
      </motion.div>

      {/* 하단 중앙 — 스크롤 인디케이터 */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.3 }}
        style={{ bottom: '5.2%', gap: '6px' }}
      >
        <span
          className="text-[8px]"
          style={{
            fontFamily: 'var(--font-sans)',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '4px',
          }}
        >
          SCROLL
        </span>
        <div
          className="relative w-px overflow-hidden"
          style={{ height: '52px', backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
            style={{ height: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
