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

// Pencil: Num 64px #1A1A1A letterSpacing -2 lineHeight 1 / Unit 32px #AAAAAA lineHeight 1.6 / gap 5
function CountUp({ prefix, raw, suffix, duration, size, suffixSize, align = 'end', numLetterSpacing = '-2px' }: {
  prefix: string; raw: number; suffix: string; duration: number; size: number;
  suffixSize?: number; align?: 'center' | 'end'; numLetterSpacing?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, raw, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [inView, count, raw, duration]);
  const unitSize = suffixSize ?? size / 2;
  return (
    <span ref={ref} className="font-light shrink-0 flex"
      style={{ fontFamily: SERIF, gap: '5px', letterSpacing: numLetterSpacing, lineHeight: 1, alignItems: align }}>
      {prefix && <span style={{ fontSize: size, color: '#1A1A1A' }}>{prefix}</span>}
      <motion.span style={{ fontSize: size, color: '#1A1A1A' }}>{rounded}</motion.span>
      {suffix && <span style={{ fontSize: unitSize, color: '#AAAAAA', lineHeight: 1.6, letterSpacing: 0 }}>{suffix}</span>}
    </span>
  );
}

export default function HeritageStats() {
  return (
    <>
      {/* ── 데스크탑 — Pencil YgfOX ── */}
      <section className="hidden md:flex flex-row" style={{ backgroundColor: '#FFFFFF' }}>
        {/* S4Left: width 520, height 480, padding [80,52], gap 34 */}
        <motion.div className="flex flex-col justify-center shrink-0"
          style={{ width: '520px', height: '480px', padding: '80px 52px', gap: '34px', borderRight: '1px solid #ECEAE4' }}
          initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true, margin: '-80px' }}>
          {/* S4Label: 9px, #AAAAAA, letterSpacing 4 */}
          <span style={{ fontFamily: SANS, fontSize: '9px', color: '#AAAAAA', letterSpacing: '4px', textTransform: 'uppercase' }}>WHY MASTERARTISAN</span>
          {/* S4Title: 52px, weight 300, letterSpacing -1, lineHeight 1.5, #1A1A1A */}
          <h2 className="font-light" style={{ fontFamily: SERIF, fontSize: '52px', color: '#1A1A1A', letterSpacing: '-1px', lineHeight: 1.5 }}>
            시간이 빚어낸<br />가치를 짓습니다
          </h2>
          {/* S4Desc: 14px, normal, lineHeight 1.5, #999999, width 400 */}
          <p style={{ fontFamily: SANS, fontSize: '14px', lineHeight: 1.5, color: '#999999', maxWidth: '400px' }}>
            1936년부터 3대에 걸쳐 이어온 전통건축 기술.<br />수많은 문화재 복원 프로젝트가 우리의 실력을 말해줍니다.
          </p>
        </motion.div>
        {/* S4Right: layout vertical, fill #F7F6F3 */}
        <div className="flex flex-col flex-1" style={{ backgroundColor: '#F7F6F3' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} className="flex items-center"
              style={{ padding: '48px 52px', borderBottom: i < stats.length - 1 ? '1px solid #ECEAE4' : 'none', backgroundColor: i === 1 ? '#FFFFFF' : '#F7F6F3' }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true, margin: '-60px' }}>
              {/* NumGroup: width 180 */}
              <div style={{ width: '180px', flexShrink: 0 }}>
                <CountUp prefix={s.prefix} raw={s.raw} suffix={s.suffix} duration={s.duration} size={64} />
              </div>
              {/* Info: padding [8,0,0,48], gap 6 */}
              <div className="flex flex-col" style={{ gap: '6px', paddingTop: '8px', paddingLeft: '48px', flex: 1 }}>
                {/* ILabel: 14px, normal, letterSpacing 2, #1A1A1A */}
                <span style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 'normal', letterSpacing: '2px', color: '#1A1A1A' }}>{s.label}</span>
                {/* IDesc: 11px, normal, lineHeight 1.7, #AAAAAA, width 340 */}
                <p style={{ fontFamily: SANS, fontSize: '11px', lineHeight: 1.7, color: '#AAAAAA', maxWidth: '340px' }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 모바일 — Pencil Ca5JX·Iq0dY ── */}
      <section className="md:hidden flex flex-col" style={{ backgroundColor: '#FFFFFF', padding: '64px 24px', gap: 32 }}>
        {/* Head: gap 10, label 10px ls:3, title 32px lh:1.5, desc 14px lh:1.5 */}
        <div className="flex flex-col" style={{ gap: 10 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 3, color: '#AAAAAA', textTransform: 'uppercase' }}>WHY MASTERARTISAN</span>
          <h2 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, lineHeight: 1.5, color: '#1A1A1A', maxWidth: 342 }}>
            시간이 빚어낸<br />가치를 짓습니다
          </h2>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.5, color: '#999999' }}>
            1960년대부터 3대에 걸쳐 이어온 전통건축 기술. <br />수백 개의 문화재 복원 프로젝트가 우리의 실력을 말합니다.
          </p>
        </div>
        {/* StatRows: num 36px, unit 20px, ILabel 16px ls:2 #1A1A1A, IDesc 12px lh:1.7 #AAAAAA */}
        <div className="flex flex-col">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center justify-between" style={{ padding: '24px 0', borderBottom: '1px solid #ECEAE4' }}>
              <CountUp prefix={s.prefix} raw={s.raw} suffix={s.suffix} duration={s.duration} size={36} suffixSize={20} align="center" numLetterSpacing="0" />
              {/* Info: Pencil BCsVE — fill_container, height 45, gap 2, alignItems end */}
              <div className="flex flex-col justify-center" style={{ gap: 2, flex: 1, height: 45, alignItems: 'flex-end' }}>
                <span style={{ fontFamily: SANS, fontSize: 14, letterSpacing: 2, color: '#1A1A1A', textAlign: 'right' }}>{s.label}</span>
                <p style={{ fontFamily: SANS, fontSize: 11, lineHeight: 1.5, color: '#AAAAAA', textAlign: 'right' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
