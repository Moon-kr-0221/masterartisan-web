import HeroSection     from '@/components/home/HeroSection';
import ContrastSection from '@/components/home/ContrastSection';
import MarqueeBand     from '@/components/home/MarqueeBand';
import HeritageStats   from '@/components/home/HeritageStats';
import WorksGrid       from '@/components/home/WorksGrid';
import ProcessSection  from '@/components/home/ProcessSection';
import CtaSection      from '@/components/home/CtaSection';
import PageIntro       from '@/components/home/PageIntro';

export default function HomePage() {
  return (
    <>
      <PageIntro />
      <HeroSection />
      <ContrastSection />
      <MarqueeBand />
      <HeritageStats />
      <WorksGrid />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
