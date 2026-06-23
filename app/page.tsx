import HeroSection     from '@/components/home/HeroSection';
import PhilosophyBand  from '@/components/home/PhilosophyBand';
import ContrastSection from '@/components/home/ContrastSection';
import MarqueeBand     from '@/components/home/MarqueeBand';
import HeritageStats   from '@/components/home/HeritageStats';
import WorksGrid       from '@/components/home/WorksGrid';
import ProcessSection  from '@/components/home/ProcessSection';
import CtaSection      from '@/components/home/CtaSection';
import PageIntro       from '@/components/home/PageIntro';
import { getHomeFeatured, getProcessImages, getHeroSlides, getContrastImages, getSiteCopy } from '@/lib/data/queries';

export default async function HomePage() {
  const [{ random, pinned, pool }, processImages, heroSlides, contrastImages, copy] = await Promise.all([
    getHomeFeatured(),
    getProcessImages(),
    getHeroSlides(),
    getContrastImages(),
    getSiteCopy(),
  ]);
  return (
    <>
      <PageIntro />
      <HeroSection slides={heroSlides} />
      <PhilosophyBand />
      <ContrastSection
        leftImage={contrastImages.left}
        rightImage={contrastImages.right}
        copy={{
          leftEyebrow: copy.contrast_left_eyebrow,
          leftTitle: copy.contrast_left_title,
          leftDesc: copy.contrast_left_desc,
          rightEyebrow: copy.contrast_right_eyebrow,
          rightTitle: copy.contrast_right_title,
          rightDesc: copy.contrast_right_desc,
        }}
      />
      <MarqueeBand />
      <HeritageStats />
      <WorksGrid items={pinned} pool={pool} random={random} />
      <ProcessSection
        images={processImages}
        copy={{
          eyebrow: copy.process_eyebrow,
          title: copy.process_title,
          desc: copy.process_desc,
          steps: [copy.process_step_1, copy.process_step_2, copy.process_step_3, copy.process_step_4],
        }}
      />
      <CtaSection />
    </>
  );
}
