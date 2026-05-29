'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Stagger text reveal by word
function SplitReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.25em' }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.06,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bgRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-end"
      style={{ height: '100svh', overflow: 'hidden' }}
    >
      {/* Background image with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(165deg, #2A1F15 0%, #1A1410 40%, #0E0C0A 100%)',
          transform: 'scale(1.15)',
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            opacity: 0.6,
          }}
        />
        {/* Warm vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 100%, rgba(200,168,130,0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center"
        style={{ padding: '32px 52px' }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <span style={{
          fontFamily: '"Playfair Display", "Noto Serif KR", serif',
          fontSize: '13px',
          letterSpacing: '0.22em',
          color: '#F5F0E8',
          fontWeight: 400,
        }}>
          MAISON
        </span>
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {['Collection', 'Atelier', 'Story', 'Contact'].map((item) => (
            <a key={item} href="#" style={{
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: 'rgba(245,240,232,0.55)',
              textDecoration: 'none',
            }}>
              {item}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10" style={{ padding: '0 52px 72px' }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#C8A882',
            marginBottom: '28px',
          }}
        >
          THE ART OF SITTING — 2024 COLLECTION
        </motion.p>

        <h1 style={{
          fontFamily: '"Playfair Display", "Noto Serif KR", serif',
          fontSize: 'clamp(52px, 7.5vw, 112px)',
          fontWeight: 400,
          lineHeight: 1.0,
          color: '#F5F0E8',
          letterSpacing: '-0.02em',
          marginBottom: '40px',
        }}>
          <SplitReveal text="앉는다는 것," delay={0.6} />
          <SplitReveal text="그 고요한 사치" delay={0.75} />
        </h1>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            style={{
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: '13px',
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.85,
              maxWidth: '320px',
              letterSpacing: '0.01em',
            }}
          >
            최상의 가죽과 장인의 손길이 만나<br />
            당신만을 위한 공간을 완성합니다
          </motion.p>

          <motion.a
            href="#collection"
            data-cursor-hover
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: '#F5F0E8',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(245,240,232,0.3)',
              paddingBottom: '4px',
            }}
          >
            컬렉션 보기
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
              <path d="M0 4H14M14 4L10 1M14 4L10 7" stroke="#F5F0E8" strokeWidth="0.8"/>
            </svg>
          </motion.a>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute z-20"
        style={{ right: '52px', bottom: '72px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: '"Noto Sans KR", sans-serif',
            fontSize: '8px',
            letterSpacing: '0.3em',
            color: 'rgba(245,240,232,0.3)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}>
            SCROLL
          </span>
          <motion.div
            style={{ width: '1px', height: '48px', backgroundColor: 'rgba(200,168,130,0.4)', originY: 0 }}
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
