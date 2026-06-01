import { getHistory } from '@/lib/data/queries';
import HistoryClient from './HistoryClient';

export default async function HistoryPage() {
  const eras = await getHistory();
  return <HistoryClient eras={eras} />;
}
