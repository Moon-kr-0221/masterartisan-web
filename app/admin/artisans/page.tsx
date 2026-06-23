import { getArtisans } from '@/lib/data/queries';
import ArtisanForm from './ArtisanForm';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

export default async function AdminArtisansPage() {
  const artisans = await getArtisans();

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        장인 소개
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        각 대(代) 장인의 사진과 소개 내용을 수정합니다.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {artisans.map((a) => <ArtisanForm key={a.generation} a={a} />)}
      </div>
    </div>
  );
}
