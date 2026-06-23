import { getSiteCopy, getHistoryHeaderImage } from '@/lib/data/queries';
import ContentForm from './ContentForm';

const SERIF = 'var(--font-serif)';
const SANS  = 'var(--font-sans)';

export default async function AdminContentPage() {
  const [copy, headerImage] = await Promise.all([
    getSiteCopy(),
    getHistoryHeaderImage(),
  ]);
  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        카피 관리
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        홈 「다릅니다·바릅니다」 섹션, 「THE PROCESS」 섹션, 연혁 페이지 상단 헤더의 문구와 사진을 수정합니다.
      </p>
      <ContentForm copy={copy} headerImage={headerImage} />
    </div>
  );
}
