import HeroSection     from '@/components/home/HeroSection';
import PhilosophyBand  from '@/components/home/PhilosophyBand';
import ContrastSection from '@/components/home/ContrastSection';
import MarqueeBand     from '@/components/home/MarqueeBand';
import HeritageStats   from '@/components/home/HeritageStats';
import WorksGrid       from '@/components/home/WorksGrid';
import ProcessSection  from '@/components/home/ProcessSection';
import CtaSection      from '@/components/home/CtaSection';
import PageIntro       from '@/components/home/PageIntro';
import { getHomeFeatured } from '@/lib/data/queries';

export default async function HomePage() {
  const { random, pinned, pool } = await getHomeFeatured();
  return (
    <>
      <PageIntro />
      <HeroSection />
      <PhilosophyBand />
      <ContrastSection />
      <MarqueeBand />
      <HeritageStats />
      <WorksGrid items={pinned} pool={pool} random={random} />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
