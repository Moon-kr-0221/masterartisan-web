'use client';

import { motion } from 'framer-motion';

const stats = [
  { num: '3代', label: '장인 계승', desc: '초대 → 이대 → 삼대, 끊어지지 않은 기술의 계보' },
  { num: '60+', label: '년의 경험', desc: '1960년대 창업부터 현재까지 이어온 전통건축 외길' },
  { num: 'No.36', label: '경기무형문화재', desc: '국가가 공인한 전통건축 기술 보유자' },
];

export default function HeritageStats() {
  return (
    <section className="flex flex-col md:flex-row" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 왼쪽 설명 */}
      <motion.div
        className="flex flex-col justify-center gap-8 px-12 py-20 md:w-[44%]"
        initial={{ opacity: 0, x: -32 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-80px' }}
        style={{ borderRight: '1px solid #E8E4DE' }}
      >
        <span className="section-label">WHY MASTERARTISAN</span>
        <h2
          className="font-light leading-[1.2]"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 4vw, 52px)', color: '#1A1A1A' }}
        >
          숫자로<br />증명합니다
        </h2>
        <p className="text-[14px] leading-[1.9]" style={{ fontFamily: 'var(--font-sans)', color: '#888888', maxWidth: '360px' }}>
          1960년대부터 3대에 걸쳐 이어온 전통건축 기술.<br />수백 개의 문화재 복원 프로젝트가 우리의 실력을 말해줍니다.
        </p>
      </motion.div>

      {/* 오른쪽 수치 */}
      <div className="flex flex-col flex-1" style={{ backgroundColor: '#F7F6F3' }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex items-start gap-0 px-14 py-12"
            style={{
              borderBottom: i < stats.length - 1 ? '1px solid #E8E4DE' : 'none',
              backgroundColor: i === 1 ? '#FFFFFF' : '#F7F6F3',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <span
              className="font-light shrink-0 w-44"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 4vw, 52px)', color: '#1A1A1A', letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              {s.num}
            </span>
            <div className="flex flex-col gap-2 pt-1 pl-12">
              <span className="text-[10px] font-bold tracking-[0.12em]" style={{ fontFamily: 'var(--font-sans)', color: '#1A1A1A' }}>
                {s.label}
              </span>
              <p className="text-[12px] leading-[1.8]" style={{ fontFamily: 'var(--font-sans)', color: '#AAAAAA' }}>
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
