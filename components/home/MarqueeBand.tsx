export default function MarqueeBand() {
  const text = 'MASTERARTISAN · 경기무형문화재 제36호 · TRADITIONAL ARCHITECTURE · 전통건축 · SINCE 1960s · ';
  const repeated = text.repeat(6);

  return (
    <div className="overflow-hidden h-16 flex items-center" style={{ backgroundColor: '#111111' }}>
      <div className="animate-marquee">
        <span
          className="whitespace-nowrap text-[12px] tracking-[0.25em] pr-4"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.22)' }}
        >
          {repeated}
        </span>
        <span
          className="whitespace-nowrap text-[12px] tracking-[0.25em] pr-4"
          aria-hidden
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.22)' }}
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}
