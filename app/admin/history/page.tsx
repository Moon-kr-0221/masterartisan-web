import { getHistoryWorksFlat } from '@/lib/data/queries';
import {
  createHistoryWork, updateHistoryWork, deleteHistoryWork,
  addHistoryMedia, deleteHistoryMedia, importHistory,
} from '@/lib/admin/actions';
import ImportPanel from '@/components/admin/ImportPanel';
import HistoryList from './HistoryList';
import AddHistoryForm from './AddHistoryForm';

const HISTORY_TEMPLATE = '﻿연도,제목,사진1,사진2,사진3\n2024,예시 - 강화 전등사 범종각 보수,img1.jpg,,\n2023,예시 - 화성 행궁 별당 수리,,,\n';

const SERIF = 'var(--font-serif)';
const SANS  = 'var(--font-sans)';

export default async function AdminHistoryPage() {
  const works = await getHistoryWorksFlat();

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        연혁
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        연혁 항목(연도 + 제목)을 추가하고, 항목마다 사진을 최대 3장 첨부할 수 있습니다.
        시대 구간은 연도에 따라 자동으로 묶입니다.
      </p>

      {/* ── Bulk Excel/CSV import ── */}
      <ImportPanel
        action={importHistory}
        heading="엑셀/CSV로 일괄 업로드"
        templateFilename="연혁_업로드_양식.csv"
        templateCsv={HISTORY_TEMPLATE}
        replaceLabel="기존 연혁을 모두 지우고 이 파일로 교체"
        instructions={
          <>
            양식을 내려받아 <b>1열=연도, 2열=제목, 3~5열=사진1·사진2·사진3(파일명)</b>으로 채우세요.
            사진을 포함할 때는 엑셀/CSV와 사진 파일들을 <b>하나의 ZIP으로 묶어</b> 업로드하세요.
            사진 없이 텍스트만 올릴 때는 엑셀(.xlsx)·CSV 단독 업로드도 됩니다.
            연도에 따라 시대 구간과 상단 시계가 자동으로 갱신됩니다.
          </>
        }
      />

      {/* ── Add new ── */}
      <AddHistoryForm createHistoryWork={createHistoryWork} addHistoryMedia={addHistoryMedia} />

      {/* ── Existing list (시대 구간 탭으로 필터) ── */}
      <HistoryList
        works={works}
        updateHistoryWork={updateHistoryWork}
        deleteHistoryWork={deleteHistoryWork}
        addHistoryMedia={addHistoryMedia}
        deleteHistoryMedia={deleteHistoryMedia}
      />
    </div>
  );
}
