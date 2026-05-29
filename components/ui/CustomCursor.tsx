'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Mode = 'default' | 'link' | 'image' | 'hidden';

const DOT_SIZE: Record<Mode, number>   = { default: 8,  link: 44, image: 88, hidden: 0 };
const TRAIL_SIZE: Record<Mode, number> = { default: 3,  link: 0,  image: 0,  hidden: 0 };

export default function CustomCursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const [mode, setMode] = useState<Mode>('hidden');

  // Fast cursor
  const cx = useSpring(mx, { stiffness: 700, damping: 40, mass: 0.3 });
  const cy = useSpring(my, { stiffness: 700, damping: 40, mass: 0.3 });
  // Lazy trail
  const tx = useSpring(mx, { stiffness: 180, damping: 28, mass: 0.8 });
  const ty = useSpring(my, { stiffness: 180, damping: 28, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-cursor="image"], .works-card, figure'))   setMode('image');
      else if (t.closest('a, button, [role="button"], label, input')) setMode('link');
      else setMode('default');
    };
    const onLeave = () => setMode('hidden');
    const onEnter = () => setMode('default');

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [mx, my]);

  const dotSize  = DOT_SIZE[mode];
  const trailSize = TRAIL_SIZE[mode];

  return (
    <>
      {/* Main dot — blend-mode difference (white on dark, black on light) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{ x: cx, y: cy, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full"
          animate={{
            width: dotSize,
            height: dotSize,
            backgroundColor: mode === 'image' ? 'transparent' : '#FFFFFF',
            border: mode === 'image' ? '1px solid rgba(255,255,255,0.85)' : 'none',
          }}
          style={{ mixBlendMode: 'difference' }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          {mode === 'image' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '8px',
                color: '#FFFFFF',
                letterSpacing: '2px',
                mixBlendMode: 'normal',
              }}
            >
              VIEW
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Trailing ghost dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{ x: tx, y: ty, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full"
          animate={{ width: trailSize, height: trailSize, opacity: mode === 'default' ? 0.35 : 0 }}
          style={{ backgroundColor: '#FFFFFF', mixBlendMode: 'difference' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </motion.div>
    </>
  );
}
