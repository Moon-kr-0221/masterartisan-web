import HeroSection     from '@/components/home/HeroSection';
import PhilosophyBand  from '@/components/home/PhilosophyBand';
import ContrastSection from '@/components/home/ContrastSection';
import MarqueeBand     from '@/components/home/MarqueeBand';
import HeritageStats   from '@/components/home/HeritageStats';
import WorksGrid       from '@/components/home/WorksGrid';
import ProcessSection  from '@/components/home/ProcessSection';
import CtaSection      from '@/components/home/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PhilosophyBand />
      <ContrastSection />
      <MarqueeBand />
      <HeritageStats />
      <WorksGrid />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
