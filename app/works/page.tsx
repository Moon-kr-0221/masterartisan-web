import { getWorks } from '@/lib/data/queries';
import WorksClient from './WorksClient';

export default async function WorksPage() {
  const works = await getWorks();
  return <WorksClient works={works} />;
}
