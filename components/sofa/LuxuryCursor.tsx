'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function LuxuryCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.4 });

  // Trailing dot — slower spring
  const dotX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 0.6 });
  const dotY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 0.6 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setHidden(false);
    };

    const enter = () => setHovered(true);
    const leave = () => setHovered(false);

    window.addEventListener('mousemove', move);

    const interactives = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, [mouseX, mouseY]);

  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  return (
    <>
      {/* Ring cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border"
          style={{ borderColor: '#F5F0E8' }}
          animate={{
            width: hovered ? 52 : 28,
            height: hovered ? 52 : 28,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </motion.div>

      {/* Dot cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          style={{ backgroundColor: '#C8A882' }}
          animate={{
            width: hovered ? 4 : 5,
            height: hovered ? 4 : 5,
            opacity: hidden ? 0 : 0.9,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}
