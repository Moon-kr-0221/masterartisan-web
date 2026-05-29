export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between w-full"
      style={{
        backgroundColor: '#1A1A1A',
        borderTop: '1px solid #2A2A2A',
        height: '74px',
        padding: '0 80px',
      }}
    >
      <span
        className="text-[13px] font-bold"
        style={{ fontFamily: 'var(--font-sans)', color: '#FFFFFF', letterSpacing: '2px' }}
      >
        MASTERARTISAN
      </span>
      <span
        className="text-[10px]"
        style={{ fontFamily: 'var(--font-sans)', color: '#555555' }}
      >
        © {new Date().getFullYear()} MasterArtisan. All rights reserved.
      </span>
    </footer>
  );
}
