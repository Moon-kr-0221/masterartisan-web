/**
 * Clearly-marked placeholder for an image slot.
 * Swap for a real <img src="..."> when the correct asset is ready.
 */
export default function ImagePlaceholder({
  label = 'IMAGE',
  dark = false,
  className,
  style,
}: {
  label?: string;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const bg = dark ? '#2E2E2E' : '#E0E0E0';
  const fg = dark ? 'rgba(255,255,255,0.35)' : '#AAAAAA';
  return (
    <div
      className={className}
      style={{
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          letterSpacing: '0.25em',
          color: fg,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
}
