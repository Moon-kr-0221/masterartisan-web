import { getHistory, getSiteCopy, getHistoryHeaderImage } from '@/lib/data/queries';
import HistoryClient from './HistoryClient';

export default async function HistoryPage() {
  const [eras, copy, headerImage] = await Promise.all([
    getHistory(),
    getSiteCopy(),
    getHistoryHeaderImage(),
  ]);
  return (
    <HistoryClient
      eras={eras}
      header={{
        eyebrow: copy.history_header_eyebrow,
        title: copy.history_header_title,
        desc: copy.history_header_desc,
        image: headerImage,
      }}
    />
  );
}
