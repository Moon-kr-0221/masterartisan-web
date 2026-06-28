import Image from 'next/image';
import { SERIF, SANS, BC_CARD_FONT, C } from '@/lib/tokens';
import { getContact } from '@/lib/data/queries';

const BANNER_IMG   = '/images/contact/exterior.jpg';
const BANNER_SCRIM = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%)';

function InfoRow({ label, value, href, paddingBottom = 24, height, flex }: {
  label: string; value: string; href: string | null;
  paddingBottom?: number; height?: number; flex?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom, borderBottom: `1px solid ${C.hairline}`, ...(height !== undefined ? { height } : {}), ...(flex !== undefined ? { flex } : {}) }}>
      <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', color: C.muted }}>{label}</span>
      {href ? (
        <a href={href} className="transition-opacity hover:opacity-70"
          style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: C.ink }}>{value}</a>
      ) : (
        <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: C.ink, whiteSpace: 'pre-line' }}>{value}</span>
      )}
    </div>
  );
}

export default async function ContactPage() {
  const ct = await getContact();
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(ct.address)}&z=16&hl=ko&output=embed`;

  return (
    <div style={{ backgroundColor: C.canvas }}>

      {/* ════ 데스크탑 — d933990 완전 동일 ════ */}
      <div className="hidden md:block" style={{ paddingTop: 72 }}>
        <section className="relative overflow-hidden" style={{ height: 360, borderBottom: `1px solid ${C.hairline}` }}>
          <Image src={BANNER_IMG} alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: BANNER_SCRIM }} />
          <div className="absolute inset-0 flex flex-col justify-end gap-3" style={{ padding: '72px 80px' }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.6)' }}>GET IN TOUCH</span>
            <h1 style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.1, color: C.canvas }}>찾아오시는 길</h1>
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>전통건축에 관한 문의나 방문을 환영합니다.</p>
          </div>
        </section>
        <section style={{ padding: '80px' }}>
          <div>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.3em', color: C.muted }}>CONTACT INFORMATION</span>
            <div className="grid grid-cols-1 md:grid-cols-3 items-stretch" style={{ columnGap: 64, rowGap: 24, marginTop: 36 }}>
              <InfoRow label="전화" value={ct.phone} href={`tel:${ct.phone}`} />
              <InfoRow label="팩스" value={ct.fax} href={null} />
              <InfoRow label="이메일" value={ct.email} href={`mailto:${ct.email}`} />
              <InfoRow label="운영시간" value={ct.hours} href={null} paddingBottom={12} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 24, borderBottom: `1px solid ${C.hairline}` }}>
                <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', color: C.muted }}>Office &amp; Workshop</span>
                <span style={{ fontFamily: BC_CARD_FONT, fontSize: 22, fontWeight: 300, color: C.ink }}>{ct.office_name}</span>
                <div className="flex items-center flex-wrap" style={{ gap: 10, marginTop: 2 }}>
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.inkSoft }}>{ct.address}</span>
                  <a href={ct.naver_map_url} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60"
                    style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.05em', color: C.accent }}>네이버 지도 →</a>
                </div>
              </div>
              <div style={{ backgroundColor: C.surface, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 300, color: C.ink }}>{ct.cert_title}</span>
                <span style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.8, color: C.inkSoft, whiteSpace: 'pre-line' }}>{ct.cert_desc}</span>
              </div>
            </div>
          </div>
        </section>
        <section>
          <iframe src={mapEmbedSrc} title={`${ct.office_name} 위치 지도`} width="100%" height={520}
            style={{ border: 0, display: 'block', width: '100%' }} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </section>
      </div>

      {/* ════ 모바일 — Pencil BD0PQ / d933990 mobile ════ */}
      <div className="md:hidden" style={{ paddingTop: 56 }}>

        <section className="relative overflow-hidden" style={{ height: 300 }}>
          <Image src={BANNER_IMG} alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute" style={{ top: 150, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.6)' }}>GET IN TOUCH</span>
            <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, lineHeight: 1.2, color: C.canvas }}>찾아오시는 길</h1>
            <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>전통건축에 관한 문의나 방문을 환영합니다.</p>
          </div>
        </section>

        <section style={{ backgroundColor: C.canvas, padding: '64px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 3, color: C.muted }}>CONTACT INFORMATION</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 20, borderBottom: `1px solid ${C.hairline}` }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, color: C.muted }}>전화</span>
            <a href={`tel:${ct.phone}`} style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: C.ink }}>{ct.phone}</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 20, borderBottom: `1px solid ${C.hairline}` }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, color: C.muted }}>팩스</span>
            <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: C.ink }}>{ct.fax}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 20, borderBottom: `1px solid ${C.hairline}` }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, color: C.muted }}>이메일</span>
            <a href={`mailto:${ct.email}`} style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: C.ink }}>{ct.email}</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 20, borderBottom: `1px solid ${C.hairline}` }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, color: C.muted }}>운영시간</span>
            <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: C.ink, whiteSpace: 'pre-line' }}>{ct.hours}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 24, borderBottom: `1px solid ${C.hairline}` }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 2, color: C.muted }}>Office &amp; Workshop</span>
            <span style={{ fontFamily: BC_CARD_FONT, fontSize: 22, fontWeight: 300, color: C.ink }}>{ct.office_name}</span>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.inkSoft }}>{ct.address}</span>
              <a href={ct.naver_map_url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 0.5, color: C.accent }}>네이버 지도 →</a>
            </div>
          </div>
          <div style={{ backgroundColor: C.surface, padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 3, color: C.accent }}>CERTIFICATION</span>
            <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 300, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre-line' }}>{ct.cert_title}</span>
            <span style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.7, color: C.inkSoft, whiteSpace: 'pre-line' }}>{ct.cert_desc}</span>
          </div>
        </section>

        <section style={{ backgroundColor: C.canvas }}>
          <iframe src={mapEmbedSrc} title={`${ct.office_name} 위치 지도`} width="100%" height={200}
            style={{ border: 0, display: 'block', width: '100%' }} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </section>

      </div>
    </div>
  );
}
