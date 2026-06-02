import { getWorks } from '@/lib/data/queries';
import WorksClient from './WorksClient';

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ work?: string }>;
}) {
  const [works, sp] = await Promise.all([getWorks(), searchParams]);
  return <WorksClient works={works} initialWork={sp.work} />;
}
