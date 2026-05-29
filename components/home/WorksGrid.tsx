'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

import type { Transition, TargetAndTransition, VariantLabels } from 'framer-motion';

function TiltCard({ children, className, style, initial, whileInView, transition, viewport }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: TargetAndTransition;
  whileInView?: TargetAndTransition | VariantLabels;
  transition?: Transition;
  viewport?: { once?: boolean; margin?: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 300, damping: 30 });
  const sRy = useSpring(ry, { stiffness: 300, damping: 30 });
  const rotX = useTransform(sRx, v => `${v}deg`);
  const rotY = useTransform(sRy, v => `${v}deg`);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const xPct = (e.clientX - left) / width  - 0.5;
    const yPct = (e.clientY - top)  / height - 0.5;
    ry.set(xPct * 10);
    rx.set(-yPct * 7);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: '800px' }}
      initial={initial}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="image"
    >
      {children}
    </motion.div>
  );
}

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1080&q=80`;

const works = [
  { title: '수원화성 서북공심돈 보수', cat: '수리', year: '2023', bg: U('photo-1560083270-5aa41ed4e1c5'), color: '#2A2218' },
  { title: '경복궁 근정전 유지보수', cat: '유지보수', year: '2023', bg: U('photo-1748835600856-dba50a909dfb'), color: '#1E2018' },
  { title: '전통 목구조 누각 신축', cat: '제작', year: '2022', bg: U('photo-1675143967358-8b0651f4c679'), color: '#181C1A' },
];

export default function WorksGrid() {
  return (
    <section style={{ backgroundColor: '#FAFAF8', padding: '0 52px 72px' }}>
      {/* 헤더 */}
      <motion.div
        className="flex items-end justify-between"
        style={{ paddingTop: '64px', paddingBottom: '40px' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="flex flex-col gap-[6px]">
          <span
            className="section-label"
            style={{ letterSpacing: '4px', lineHeight: 1.44 }}
          >
            OUR WORKS
          </span>
          <h2
            className="font-light"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: '#1A1A1A',
              lineHeight: 1.44,
            }}
          >
            작업 사례
          </h2>
        </div>
        <Link
          href="/works"
          className="text-[12px] transition-opacity hover:opacity-50"
          style={{ fontFamily: 'var(--font-sans)', color: '#999999', letterSpacing: '1px' }}
        >
          전체 보기 →
        </Link>
      </motion.div>

      {/* 비대칭 그리드 */}
      <div className="flex gap-[3px]">
        {/* 왼쪽 큰 카드 */}
        <TiltCard
          className="relative overflow-hidden"
          style={{ width: '58.5%', height: '540px', backgroundColor: works[0].color, flexShrink: 0 }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-out hover:scale-[1.04]"
            style={{ backgroundImage: `url(${works[0].bg})` }}
          />
          {/* 웜톤 컬러 그레이딩 — 채도 낮춤 + 세피아 */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(44,31,16,0) 0%, rgba(44,31,16,0.45) 100%)', mixBlendMode: 'multiply' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
          <div className="absolute left-[36px]" style={{ bottom: '39px', transform: 'translateZ(20px)' }}>
            <p className="section-label mb-[6px]" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '2px' }}>
              {works[0].cat} · {works[0].year}
            </p>
            <p className="font-light text-[22px]" style={{ fontFamily: 'var(--font-serif)', color: '#FFFFFF' }}>
              {works[0].title}
            </p>
          </div>
        </TiltCard>

        {/* 오른쪽 두 카드 (세로) */}
        <div className="flex flex-col gap-[3px] flex-1">
          {works.slice(1).map((w, i) => (
            <TiltCard
              key={w.title}
              className="relative overflow-hidden flex-1"
              style={{ backgroundColor: w.color, height: '268px' }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-out hover:scale-[1.06]"
                style={{ backgroundImage: `url(${w.bg})` }}
              />
              {/* 웜톤 컬러 그레이딩 */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(44,31,16,0) 0%, rgba(44,31,16,0.4) 100%)', mixBlendMode: 'multiply' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
              <div className="absolute left-[28px]" style={{ bottom: '18px', transform: 'translateZ(16px)' }}>
                <p className="section-label mb-1" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '2px' }}>
                  {w.cat} · {w.year}
                </p>
                <p className="font-light text-[18px]" style={{ fontFamily: 'var(--font-serif)', color: '#FFFFFF' }}>
                  {w.title}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
