'use client';

import { forwardRef } from 'react';

const ERAS = [
  '~2011',
  '2010~2001',
  '2000~1991',
  '1990~1981',
  '1980~1971',
  '1970~1961',
  '1960~1951',
];

const TOTAL = ERAS.length;
const CX = 260;
const CY = 260;
const R_OUTER = 230;
const R_MID   = 185;
const R_INNER  = 130;
const R_CENTER = 80;
const R_LABEL  = 210;
const R_HAND   = 220;

function eraAngle(i: number) {
  // 12시(−90°)에서 시계방향
  return -90 + (i / TOTAL) * 360;
}

function polar(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

interface Props {
  activeEra: number;   // 0-based index into ERAS
  rotation: number;    // degrees
}

const DialSVG = forwardRef<SVGGElement, Props>(({ activeEra, rotation }, ref) => {
  // active era label position
  const handPt = polar(-90, R_HAND);

  return (
    <svg
      viewBox="0 0 520 520"
      width="100%"
      height="100%"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Center image clip */}
        <clipPath id="centerClip">
          <circle cx={CX} cy={CY} r={R_CENTER - 4} />
        </clipPath>
        {/* Radial fade for center */}
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#FAFAF8" stopOpacity="0" />
          <stop offset="100%" stopColor="#FAFAF8" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* ── 회전 그룹 ── */}
      <g ref={ref} style={{ transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${rotation}deg)` }}>

        {/* 바깥 얇은 원들 */}
        {[R_OUTER, R_MID, R_INNER].map((r, i) => (
          <circle
            key={r}
            cx={CX} cy={CY} r={r}
            fill="none"
            stroke={i === 0 ? '#D0CCC6' : '#E4E0D8'}
            strokeWidth={i === 0 ? 0.8 : 0.5}
          />
        ))}

        {/* 눈금 틱 + 라벨 */}
        {ERAS.map((era, i) => {
          const angle = eraAngle(i);
          const tick0 = polar(angle, R_INNER - 4);
          const tick1 = polar(angle, R_MID + 4);
          const lp = polar(angle, R_LABEL);
          const isActive = i === activeEra;
          return (
            <g key={era}>
              <line
                x1={tick0.x} y1={tick0.y}
                x2={tick1.x} y2={tick1.y}
                stroke={isActive ? '#1A1A1A' : '#CCCCCC'}
                strokeWidth={isActive ? 1.2 : 0.6}
              />
              <text
                x={lp.x} y={lp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isActive ? 10 : 8.5}
                fontFamily="'Noto Sans KR', sans-serif"
                fontWeight={isActive ? '700' : '400'}
                fill={isActive ? '#1A1A1A' : '#AAAAAA'}
                style={{ transform: `rotate(${-(rotation)}deg)`, transformOrigin: `${lp.x}px ${lp.y}px` }}
              >
                {era}
              </text>
            </g>
          );
        })}

        {/* 시곗바늘 — 12시 방향 고정 */}
        <line
          x1={CX} y1={CY - R_CENTER + 2}
          x2={CX} y2={CY - R_HAND}
          stroke="#1A1A1A"
          strokeWidth={0.8}
        />
        {/* 바늘 끝 도트 */}
        <circle cx={CX} cy={CY - R_HAND} r={3} fill="#1A1A1A" />

        {/* 가이드 점선 - 세부 눈금 (5개씩) */}
        {Array.from({ length: 35 }).map((_, i) => {
          const a = -90 + (i / 35) * 360;
          const p0 = polar(a, R_INNER - 2);
          const p1 = polar(a, R_INNER + 3);
          return (
            <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y}
              stroke="#E4E0D8" strokeWidth={0.4} />
          );
        })}
      </g>

      {/* ── 고정 센터 (회전 안 함) ── */}
      {/* 중심 원 배경 */}
      <circle cx={CX} cy={CY} r={R_CENTER} fill="#F4F1EB" stroke="#E4E0D8" strokeWidth={0.8} />

      {/* 중심 텍스트: 활성 연대 */}
      <text
        x={CX} y={CY - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontFamily="'Noto Serif KR', serif"
        fontWeight="300"
        fill="#1A1A1A"
      >
        {ERAS[activeEra]}
      </text>
      <text
        x={CX} y={CY + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={8}
        fontFamily="'Noto Sans KR', sans-serif"
        fill="#AAAAAA"
        letterSpacing={1}
      >
        HISTORY
      </text>

      {/* 12시 방향 고정 기준선 (바깥) */}
      <line
        x1={CX} y1={CY - R_OUTER - 12}
        x2={CX} y2={CY - R_OUTER}
        stroke="#1A1A1A"
        strokeWidth={1.5}
      />
      <circle cx={CX} cy={CY - R_OUTER - 14} r={2} fill="#1A1A1A" />
    </svg>
  );
});

DialSVG.displayName = 'DialSVG';
export default DialSVG;
