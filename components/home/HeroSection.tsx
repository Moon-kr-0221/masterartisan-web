'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1762246569597-2fbf5065a73f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1559825491-a529dd302927?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1688341750245-f16a2ce6e56d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1636625278157-e7f3cf7d77fb?auto=format&fit=crop&w=1600&q=80',
];

const SLIDE_META = [
  { h1a: '천년의 기술',  h1b: '삼대의 손',       sub: 'Heritage of Master Artisan' },
  { h1a: '다름이',       h1b: '우리의 방식.',     sub: 'Different Thinking, Different Making' },
  { h1a: '전통을 담아',  h1b: '미래를 짓습니다.', sub: 'Traditional Craft, Timeless Space' },
  { h1a: '기술이 아닌,', h1b: '예술로 짓습니다.', sub: 'Crafted Beyond Convention' },
];

export type HeroSlideInput = { image?: string; h1a?: string; h1b?: string; sub?: string };

function buildSlides(slides?: HeroSlideInput[]) {
  return SLIDE_META.map((m, i) => {
    const s = slides?.[i];
    return {
      image: (s?.image && s.image !== '') ? s.image : DEFAULT_IMAGES[i],
      h1a:   (s?.h1a  && s.h1a  !== '') ? s.h1a  : m.h1a,
      h1b:   (s?.h1b  && s.h1b  !== '') ? s.h1b  : m.h1b,
      sub:   (s?.sub  && s.sub  !== '') ? s.sub  : m.sub,
    };
  });
}

const INTERVAL = 5500;
const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

// ── 모바일 전체화면 슬라이드 히어로 ──────────────────────────────────────
function MobileHero({ slides }: { slides: ReturnType<typeof buildSlides> }) {
  const [cur, setCur] = useState(0);
  const [prog, setProg] = useState(0);
  const touchStartX = useRef(0);
  const N = slides.length;

  const advance = useCallback(() => setCur((c) => (c + 1) % N), [N]);
  const goBack  = useCallback(() => setCur((c) => (c - 1 + N) % N), [N]);

  // 자동 진행
  useEffect(() => {
    const startedAt = Date.now();
    const raf = { id: 0 };
    function tick() {
      const p = Math.min((Date.now() - startedAt) / INTERVAL, 1);
      setProg(p);
      if (p < 1) { raf.id = requestAnimationFrame(tick); } else { advance(); }
    }
    raf.id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.id);
  }, [cur, advance]);

  // 터치 스와이프
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50) advance();
    else if (delta > 50) goBack();
  };

  const slide = slides[cur];

  return (
    <section
      className="relative overflow-hidden md:hidden"
      style={{ height: '100dvh', backgroundColor: '#0D0C0A' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 슬라이드 레일 — 전체 슬라이드 수평 나열, CSS transform으로 이동 */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: `${N * 100}%`,
          display: 'flex',
          transform: `translateX(-${(cur / N) * 100}%)`,
          transition: 'transform 0.65s cubic-bezier(0.25, 0.1, 0.25, 1)',
          willChange: 'transform',
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              flex: '0 0 auto',
              width: `${100 / N}%`,
              height: '100%',
              backgroundImage: `url(${s.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

      {/* 그라디언트 */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(13,12,10,0.7) 55%, rgba(13,12,10,0.95) 100%)' }} />

      {/* HeroText — bottom anchor */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`m-text-${cur}`}
          className="absolute"
          style={{ left: 24, right: 24, bottom: 112, display: 'flex', flexDirection: 'column', gap: 10 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow: Pencil fontSize:12, letterSpacing:2, color:#ffffff80 */}
          <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: 2, color: 'rgba(255,255,255,0.5)' }}>
            HERITAGE OF MASTER ARTISAN
          </span>
          {/* H1: Pencil fontSize:44, lineHeight:1.45, letterSpacing:-1 */}
          <h1 style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 300, lineHeight: 1.45, letterSpacing: '-1px', color: '#FFFFFF', margin: 0 }}>
            {slide.h1a}<br />{slide.h1b}
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 300, letterSpacing: 4, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {slide.sub}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Pager — bottom anchor */}
      <div className="absolute flex items-center" style={{ left: 24, bottom: 52, gap: 10 }}>
        <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#FFFFFF' }}>
          {String(cur + 1).padStart(2, '0')}
        </span>
        <div className="relative h-px" style={{ width: 32, backgroundColor: 'rgba(255,255,255,0.25)' }}>
          <div className="absolute left-0 top-0 h-full bg-white" style={{ width: `${prog * 100}%`, transition: 'none' }} />
        </div>
        <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.4)' }}>
          {String(N).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}

export default function HeroSection({ slides: slidesProp }: { slides?: HeroSlideInput[] }) {
  const slides = buildSlides(slidesProp);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const advance = useCallback(() => { setCurrent((c) => (c + 1) % slides.length); }, [slides.length]);

  useEffect(() => {
    const startedAt = Date.now();
    const raf = { id: 0 };
    function tick() {
      const elapsed = Date.now() - startedAt;
      const p = Math.min(elapsed / INTERVAL, 1);
      setProgress(p);
      if (p < 1) { raf.id = requestAnimationFrame(tick); } else { advance(); }
    }
    raf.id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.id);
  }, [current, advance]);

  const slide = slides[current];
  const pgnLabel = String(current + 1).padStart(2, '0');

  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const textX = useTransform(springX, [-1, 1], [-14,  14]);
  const textY = useTransform(springY, [-1, 1], [ -8,   8]);
  const bgX   = useTransform(springX, [-1, 1], [ 10, -10]);
  const bgY   = useTransform(springY, [-1, 1], [  6,  -6]);

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
    <>
      {/* ── 데스크탑 Hero — Pencil 기준: 960px 고정, 4슬라이드 캐러셀 ── */}
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden hidden md:block"
        style={{ height: '960px', backgroundColor: '#0D0C0A' }}
      >
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
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(170deg, rgba(13,12,10,0) 0%, rgba(13,12,10,0.6) 55%, rgba(13,12,10,0.85) 100%)' }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${current}`}
            className="absolute left-[52px]"
            style={{ top: '400px', x: textX, y: textY }}
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: current === 0 ? 2.9 : 0 }}
          >
            {/* Pencil o3n6e — HeroEyebrow (SANS 32 / letterSpacing 2 / #ffffff80) */}
            <span style={{ display: 'block', fontFamily: SANS, fontSize: '32px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: '34px' }}>
              HERITAGE OF MASTER ARTISAN
            </span>
            <h1 className="font-light" style={{ fontFamily: SERIF, fontSize: '100px', color: '#FFFFFF', lineHeight: 1.3, letterSpacing: '-5px', marginBottom: '34px' }}>
              {slide.h1a}<br />{slide.h1b}
            </h1>
            <motion.p
              className="font-light"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: current === 0 ? 3.4 : 0.3 }}
              style={{ fontFamily: SERIF, fontSize: '32px', color: 'rgba(255,255,255,0.4)', letterSpacing: '8px', lineHeight: 1, paddingLeft: '10px' }}
            >
              {slide.sub}
            </motion.p>
          </motion.div>
        </AnimatePresence>
        {/* HeroSubCopyEN — Pencil: x:960, y:840, width:380 */}
        <motion.div className="absolute" style={{ right: '100px', top: '840px', width: '380px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, delay: 3.2 }}>
          <p className="text-right text-[13px] leading-[1.7]" style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
            We Make Quality<br />That Stands the Test of Time.
          </p>
        </motion.div>
        {/* Pagination — Pencil: x:52, y:867 → bottom:77px */}
        <motion.div className="absolute flex items-center" style={{ left: '52px', bottom: '77px', gap: '10px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 3.0 }}>
          <span className="text-[11px] font-bold tabular-nums" style={{ fontFamily: SANS, color: '#FFFFFF', letterSpacing: '2px' }}>{pgnLabel}</span>
          <div className="relative h-px" style={{ width: '40px', backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <div className="absolute left-0 top-0 h-full bg-white" style={{ width: `${progress * 100}%`, transition: 'none' }} />
          </div>
          <span role="button" tabIndex={0} aria-label="다음 사진" onClick={advance} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } }} className="text-[11px] transition-colors hover:text-white" style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', cursor: 'pointer' }}>
            {String(slides.length).padStart(2, '0')}
          </span>
        </motion.div>
        {/* ScrollInd — Pencil: x:696, y:840 → bottom:54px (840+66=906, 960-906=54) */}
        <motion.div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 3.3 }} style={{ bottom: '54px', gap: '6px' }}>
          <span className="text-[8px]" style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.35)', letterSpacing: '4px' }}>SCROLL</span>
          <div className="relative w-px overflow-hidden" style={{ height: '52px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <motion.div className="absolute top-0 left-0 w-full" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }} style={{ height: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }} />
          </div>
        </motion.div>
      </section>

      {/* ── 모바일 Hero — 전체화면 + 터치 스와이프 슬라이드 ── */}
      <MobileHero slides={slides} />
    </>
  );
}
