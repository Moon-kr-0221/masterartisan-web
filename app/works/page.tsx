import { getWorks, getPageHeroImages, getWorksOrderMode } from '@/lib/data/queries';
import WorksClient from './WorksClient';

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ work?: string }>;
}) {
  const [works, sp, pageHeroes, orderMode] = await Promise.all([getWorks(), searchParams, getPageHeroImages(), getWorksOrderMode()]);
  return <WorksClient works={works} initialWork={sp.work} heroImage={pageHeroes.works} heroImageMobile={pageHeroes.worksMobile} orderMode={orderMode} />;
}
