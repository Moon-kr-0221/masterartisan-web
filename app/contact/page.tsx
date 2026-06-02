const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

const BANNER_IMG = 'https://images.unsplash.com/photo-1772331274809-4a6ad75c9947?auto=format&fit=crop&w=1600&q=80';
const BANNER_SCRIM = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%)';

const LEFT_ITEMS = [
  { label: '전화', value: '070-7715-4704', href: 'tel:070-7715-4704' },
  { label: '팩스', value: '0504-230-4704', href: null },
  { label: '이메일', value: 'rayarchit@naver.com', href: 'mailto:rayarchit@naver.com' },
];

const ADDRESS = '인천광역시 강화군 송해면 강화대로 778';
const NAVER_MAP_URL = 'https://naver.me/xtNhmH4G';
// 키 없이 동작하는 구글맵 임베드 (네이버는 외부 iframe을 막아 임베드 불가 → 링크는 별도 유지)
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=16&hl=ko&output=embed`;

const LOCATIONS = [
  {
    type: '고려문화재기술원(주)',
    typeEn: 'Office & Workshop',
    address: ADDRESS,
    detail: '사무실·작업장 통합',
    mapUrl: NAVER_MAP_URL,
  },
];

function InfoRow({
  label, value, href,
  paddingBottom = 24,
  height,
  flex,
}: {
  label: string;
  value: string;
  href: string | null;
  paddingBottom?: number;
  height?: number;
  flex?: number;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      paddingBottom,
      borderBottom: '1px solid #F0EEEA',
      ...(height !== undefined ? { height } : {}),
      ...(flex !== undefined ? { flex } : {}),
    }}>
      <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', color: '#AAAAAA' }}>{label}</span>
      {href ? (
        <a href={href} className="transition-opacity hover:opacity-70"
          style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: '#1A1A1A' }}>
          {value}
        </a>
      ) : (
        <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: '#1A1A1A', whiteSpace: 'pre-line' }}>
          {value}
        </span>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingTop: 72 }}>
      {/* ── Page Hero ── */}
      <section style={{ position: 'relative', height: 360, overflow: 'hidden', borderBottom: '1px solid #E8E8E8' }}>
        <img src={BANNER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: BANNER_SCRIM }} />
        <div className="absolute inset-0 flex flex-col justify-end gap-3" style={{ padding: '72px 80px' }}>
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.6)' }}>GET IN TOUCH</span>
          <h1 style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.1, color: '#FFFFFF' }}>찾아오시는 길</h1>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
            전통건축에 관한 문의나 방문을 환영합니다.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFORMATION ── */}
      {/* V58cDN ContactLeft: padding 80, gap 36 */}
      <section style={{ padding: '80px' }}>
        <div>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.3em', color: '#AAAAAA' }}>
            CONTACT INFORMATION
          </span>

          {/* 3열 × 2행 균형 그리드: 전화·팩스·이메일 / 운영시간·회사정보·인증 */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch" style={{ gap: 64, marginTop: 40 }}>
            {/* Row 1 */}
            {LEFT_ITEMS.map((it) => (
              <InfoRow key={it.label} {...it} />
            ))}

            {/* Row 2 — 운영시간 */}
            <InfoRow
              label="운영시간"
              value={'평일 09:00 – 18:00\n토요일 09:00 – 13:00 (일·공휴일 휴무)'}
              href={null}
            />

            {/* Row 2 — Office & Workshop */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 24, borderBottom: '1px solid #F0EEEA' }}>
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', color: '#AAAAAA' }}>
                {LOCATIONS[0].typeEn}
              </span>
              <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 300, color: '#1A1A1A' }}>
                {LOCATIONS[0].type}
              </span>
              <div className="flex items-center flex-wrap" style={{ gap: 10, marginTop: 2 }}>
                <span style={{ fontFamily: SANS, fontSize: 13, color: '#555555' }}>{LOCATIONS[0].address}</span>
                <a href={LOCATIONS[0].mapUrl} target="_blank" rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-60"
                  style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.05em', color: '#8C6D3F' }}>
                  네이버 지도 →
                </a>
              </div>
            </div>

            {/* Row 2 — 인증 */}
            <div style={{ backgroundColor: '#F7F6F3', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 300, color: '#1A1A1A' }}>
                경기무형문화재 제36호
              </span>
              <span style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.8, color: '#666666', whiteSpace: 'pre-line' }}>
                {'전통건축 유지보수·수리·제작에 관한 모든 문의를 환영합니다.\n방문 전 사전 연락을 부탁드립니다.'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 지도 — 화면 좌우 전체 폭(full-bleed), 푸터에 바로 붙음 ── */}
      <section>
        <iframe
          src={MAP_EMBED_SRC}
          title={`${LOCATIONS[0].type} 위치 지도`}
          width="100%"
          height={520}
          style={{ border: 0, display: 'block', width: '100%' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </section>
    </div>
  );
}
