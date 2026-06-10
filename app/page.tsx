import HeroSection     from '@/components/home/HeroSection';
import PhilosophyBand  from '@/components/home/PhilosophyBand';
import ContrastSection from '@/components/home/ContrastSection';
import MarqueeBand     from '@/components/home/MarqueeBand';
import HeritageStats   from '@/components/home/HeritageStats';
import WorksGrid       from '@/components/home/WorksGrid';
import ProcessSection  from '@/components/home/ProcessSection';
import CtaSection      from '@/components/home/CtaSection';
import PageIntro       from '@/components/home/PageIntro';
import { getHomeFeatured, getProcessImages, getHeroSlides, getContrastImages } from '@/lib/data/queries';

export default async function HomePage() {
  const [{ random, pinned, pool }, processImages, heroSlides, contrastImages] = await Promise.all([
    getHomeFeatured(),
    getProcessImages(),
    getHeroSlides(),
    getContrastImages(),
  ]);
  return (
    <>
      <PageIntro />
      <HeroSection slides={heroSlides} />
      <PhilosophyBand />
      <ContrastSection leftImage={contrastImages.left} rightImage={contrastImages.right} />
      <MarqueeBand />
      <HeritageStats />
      <WorksGrid items={pinned} pool={pool} random={random} />
      <ProcessSection images={processImages} />
      <CtaSection />
    </>
  );
}
