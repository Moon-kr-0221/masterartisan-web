import Link from 'next/link';
import { getArtisans, getWorks, getHistory } from '@/lib/data/queries';
import { isSupabaseConfigured } from '@/lib/supabase/env';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

export default async function AdminDashboard() {
  const [artisans, works, history] = await Promise.all([getArtisans(), getWorks(), getHistory()]);
  const historyCount = history.reduce((n, e) => n + e.works.length, 0);

  const cards = [
    { href: '/admin/artisans', label: '장인 소개', count: artisans.length, unit: '명', desc: '초대·이대·삼대 장인의 사진과 소개 글을 수정합니다.' },
    { href: '/admin/works', label: '작업 사례', count: works.length, unit: '건', desc: '작업물의 사진·분류·제목을 추가하고 관리합니다.' },
    { href: '/admin/history', label: '연혁', count: historyCount, unit: '건', desc: '연혁 항목을 추가하고 항목별 사진을 첨부합니다.' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        대시보드
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        편집할 항목을 선택하세요. 저장하면 사이트에 바로 반영됩니다.
      </p>

      {!isSupabaseConfigured && (
        <div style={{ border: '1px solid #E3C4C4', backgroundColor: '#FBF3F3', padding: 20, marginBottom: 32 }}>
          <p style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B', lineHeight: 1.7 }}>
            아직 Supabase 프로젝트 키가 연결되지 않았습니다. 현재는 기본(샘플) 데이터를 보여주고 있으며,
            저장 기능은 키 연결 후 동작합니다.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href}
            style={{ display: 'block', textDecoration: 'none', backgroundColor: '#FFFFFF',
              border: `1px solid ${HAIR}`, padding: 24, transition: 'border-color 0.2s' }}
            className="hover:border-[#1A1A1A]">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: '#1A1A1A' }}>{c.label}</span>
              <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 300, color: '#1A1A1A' }}>
                {c.count}<span style={{ fontFamily: SANS, fontSize: 12, color: '#999', marginLeft: 3 }}>{c.unit}</span>
              </span>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 13, color: '#777', lineHeight: 1.7 }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
