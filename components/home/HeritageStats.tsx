'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

const SANS  = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';

const stats = [
  { prefix: '', raw: 3,  suffix: '代', label: '장인 계승',     desc: '초대 → 이대 → 삼대, 끊어지지 않은 기술의 계보',    duration: 1.2 },
  { prefix: '', raw: 90, suffix: '+',  label: '년의 경험',     desc: '1936년 창업 이래 현재까지 이어온 전통건축 외길',    duration: 2.0 },
  { prefix: '', raw: 36, suffix: '호', label: '경기무형문화재', desc: '국가가 공인한 전통건축 기술 보유자',                 duration: 1.6 },
];

function CountUp({ prefix, raw, suffix, duration, size }: { prefix: string; raw: number; suffix: string; duration: number; size: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, raw, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [inView, count, raw, duration]);
  return (
    <span ref={ref} className="font-light shrink-0 flex items-end gap-[2px]"
      style={{ fontFamily: SERIF, fontSize: size, color: '#1A1A1A', letterSpacing: '-0.033em', lineHeight: 1 }}>
      {prefix && <span>{prefix}</span>}
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export default function HeritageStats() {
  return (
    <>
      {/* ── 데스크탑 — d933990 완전 동일 ── */}
      <section className="hidden md:flex flex-row" style={{ backgroundColor: '#FFFFFF' }}>
        <motion.div className="flex flex-col justify-center gap-8 shrink-0"
          style={{ width: '520px', padding: '80px 52px', borderRight: '1px solid #ECEAE4' }}
          initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true, margin: '-80px' }}>
          <span className="section-label">WHY MASTERARTISAN</span>
          <h2 className="font-light" style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 4vw, 52px)', color: '#1A1A1A', letterSpacing: '-1px', lineHeight: 1.308 }}>
            시간이 빚어낸<br />가치를 짓습니다
          </h2>
          <p className="text-[14px] leading-[1.9]" style={{ fontFamily: SANS, color: '#888888', maxWidth: '360px' }}>
            1936년부터 3대에 걸쳐 이어온 전통건축 기술.<br />수많은 문화재 복원 프로젝트가 우리의 실력을 말해줍니다.
          </p>
        </motion.div>
        <div className="flex flex-col flex-1" style={{ backgroundColor: '#F7F6F3' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} className="flex items-start gap-0"
              style={{ padding: '48px 52px', borderBottom: i < stats.length - 1 ? '1px solid #ECEAE4' : 'none', backgroundColor: i === 1 ? '#FFFFFF' : '#F7F6F3' }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true, margin: '-60px' }}>
              <CountUp prefix={s.prefix} raw={s.raw} suffix={s.suffix} duration={s.duration} size={64} />
              <div className="flex flex-col gap-2 pt-2 pl-12">
                <span className="text-[10px] font-bold tracking-[0.12em]" style={{ fontFamily: SANS, color: '#1A1A1A' }}>{s.label}</span>
                <p className="text-[12px] leading-[1.8]" style={{ fontFamily: SANS, color: '#AAAAAA' }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 모바일 — Pencil Ca5JX·Iq0dY / d933990 mobile ── */}
      <section className="md:hidden flex flex-col" style={{ backgroundColor: '#FFFFFF', padding: '64px 24px', gap: 32 }}>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 4, color: '#AAAAAA' }}>WHY MASTERARTISAN</span>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, lineHeight: 1.3, letterSpacing: -1, color: '#1A1A1A' }}>
            시간이 빚어낸<br />가치를 짓습니다
          </h2>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: '#999999' }}>
            1936년부터 3대에 걸쳐 이어온 전통건축 기술. 수많은 문화재 복원 프로젝트가 우리의 실력을 말합니다.
          </p>
        </div>
        <div className="flex flex-col">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center justify-between" style={{ padding: '24px 0', borderBottom: '1px solid #ECEAE4' }}>
              <CountUp prefix={s.prefix} raw={s.raw} suffix={s.suffix} duration={s.duration} size={36} />
              <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: 1, color: '#999999' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
