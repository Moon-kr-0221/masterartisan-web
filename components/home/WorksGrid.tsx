'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Transition, TargetAndTransition, VariantLabels } from 'framer-motion';

function TiltCard({ children, className, style, initial, whileInView, transition, viewport, onClick }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: TargetAndTransition;
  whileInView?: TargetAndTransition | VariantLabels;
  transition?: Transition;
  viewport?: { once?: boolean; margin?: string };
  onClick?: () => void;
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
      onClick={onClick}
      data-cursor="image"
    >
      {children}
    </motion.div>
  );
}

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1080&q=80`;

type FeaturedWork = { title: string; cat: string; year: string; bg: string; color: string };

const FALLBACK: FeaturedWork[] = [
  { title: '수원화성 서북공심돈 보수', cat: '수리', year: '2023', bg: U('photo-1737740068972-d3457e694bac'), color: '#2A2218' },
  { title: '경복궁 근정전 유지보수', cat: '유지보수', year: '2023', bg: U('photo-1774249254132-4f6fd8382a4a'), color: '#1E2018' },
  { title: '전통 목구조 누각 신축', cat: '제작', year: '2022', bg: U('photo-1758622043464-875662d94a6c'), color: '#181C1A' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

export default function WorksGrid({ items, pool = [], random = false }: {
  items?: FeaturedWork[]; pool?: FeaturedWork[]; random?: boolean;
}) {
  const randomBase = pool.length > 0 ? pool : FALLBACK;
  const [picked, setPicked] = useState<FeaturedWork[] | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (random) setPicked(shuffle(randomBase).slice(0, 3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [random]);

  const works = random
    ? (picked ?? randomBase.slice(0, 3))
    : (items && items.length > 0 ? items
      : pool.length > 0 ? pool.slice(0, 3)
      : FALLBACK);

  const router = useRouter();
  const openWork = (title: string) => router.push(`/works?work=${encodeURIComponent(title)}`);

  return (
    <section style={{ backgroundColor: '#FAFAF8', padding: '0 52px 72px' }}>
      {/* 헤더 */}
      <motion.div
        className="flex items-end justify-between"
        style={{ paddingTop: 64, paddingBottom: 40 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="flex flex-col gap-2">
          <span className="section-label" style={{ letterSpacing: '4px', lineHeight: 1.44 }}>
            OUR WORKS
          </span>
          <h2
            className="font-light"
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#1A1A1A', lineHeight: 1.44 }}
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

      {/* ── 모바일: 가로 스크롤 캐러셀 (Pencil M·HOME Works) ── */}
      {isMobile ? (
        <div
          className="flex snap-x snap-mandatory overflow-x-auto gap-4 px-6 pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {works.map((w) => (
            <div
              key={w.title}
              className="relative shrink-0 snap-start overflow-hidden cursor-pointer"
              style={{ width: 280, height: 340, backgroundColor: w.color }}
              onClick={() => openWork(w.title)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${w.bg})` }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.67) 100%)' }} />
              <div className="absolute" style={{ left: 20, bottom: 24 }}>
                <p className="section-label mb-1" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '2px' }}>
                  {w.cat} · {w.year}
                </p>
                <p className="font-light" style={{ fontFamily: 'var(--font-serif)', fontSize: 21, color: '#FFFFFF' }}>
                  {w.title}
                </p>
              </div>
            </div>
          ))}
          {/* 끝 카드: 전체 보기 CTA */}
          <Link
            href="/works"
            className="relative shrink-0 snap-start flex flex-col items-center justify-center gap-3 border border-[#E2DDD6]"
            style={{ width: 280, height: 340, backgroundColor: '#FAFAF8' }}
          >
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '4px', color: '#AAAAAA' }}>OUR WORKS</span>
            <span className="font-light" style={{ fontFamily: 'var(--font-serif)', fontSize: 21, color: '#1A1A1A' }}>전체 보기</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: '#999999' }}>→</span>
          </Link>
        </div>
      ) : (
        /* ── 데스크탑: 비대칭 그리드 ── */
        <div className="flex gap-[3px]">
          {/* 왼쪽 큰 카드 */}
          <TiltCard
            className="group relative cursor-pointer overflow-hidden"
            style={{ width: '58.5%', height: 540, backgroundColor: works[0].color, flexShrink: 0 }}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-60px' }}
            onClick={() => openWork(works[0].title)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${works[0].bg})` }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(44,31,16,0) 0%, rgba(44,31,16,0.45) 100%)', mixBlendMode: 'multiply' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-[0.13]" />
            <div className="absolute" style={{ left: 36, bottom: 39, transform: 'translateZ(20px)' }}>
              <p className="section-label mb-[6px]" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '2px' }}>
                {works[0].cat} · {works[0].year}
              </p>
              <p className="font-light" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#FFFFFF' }}>
                {works[0].title}
              </p>
            </div>
          </TiltCard>

          {/* 오른쪽 두 카드 (세로) */}
          <div className="flex flex-col gap-[3px] flex-1">
            {works.slice(1).map((w, i) => (
              <TiltCard
                key={w.title}
                className="group relative cursor-pointer overflow-hidden flex-1"
                style={{ backgroundColor: w.color, height: 268 }}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-60px' }}
                onClick={() => openWork(w.title)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url(${w.bg})` }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(44,31,16,0) 0%, rgba(44,31,16,0.4) 100%)', mixBlendMode: 'multiply' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-[0.13]" />
                <div className="absolute" style={{ left: 28, bottom: 18, transform: 'translateZ(16px)' }}>
                  <p className="section-label mb-1" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '2px' }}>
                    {w.cat} · {w.year}
                  </p>
                  <p className="font-light" style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#FFFFFF' }}>
                    {w.title}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
