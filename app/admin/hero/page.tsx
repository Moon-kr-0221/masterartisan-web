import { getHeroSlides, getPageHeroImages, getProcessImages, getContrastImages } from '@/lib/data/queries';
import HeroImagesClient from './HeroImagesClient';

const SERIF = 'var(--font-serif)';
const SANS  = 'var(--font-sans)';

export default async function AdminHeroPage() {
  const [heroSlides, pageHeroes, processUrls, contrastUrls] = await Promise.all([
    getHeroSlides(),
    getPageHeroImages(),
    getProcessImages(),
    getContrastImages(),
  ]);

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        이미지 관리
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        홈 히어로 슬라이드·프로세스 이미지 및 각 페이지 상단 배경 이미지를 관리합니다.<br />
        이미지를 등록하기 전에 반드시 표기된 권장 사이즈를 확인하세요.
      </p>

      <HeroImagesClient
        initialSlides={heroSlides}
        initialPageHeroes={pageHeroes}
        initialProcessUrls={processUrls}
        initialContrastUrls={contrastUrls}
      />
    </div>
  );
}
