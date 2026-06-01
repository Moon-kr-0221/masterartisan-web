import { getHistoryWorksFlat } from '@/lib/data/queries';
import {
  createHistoryWork, updateHistoryWork, deleteHistoryWork,
  addHistoryMedia, deleteHistoryMedia, importHistory,
} from '@/lib/admin/actions';
import { TextField, SubmitButton } from '@/components/admin/ui';
import ImportPanel from '@/components/admin/ImportPanel';
import HistoryList from './HistoryList';

const HISTORY_TEMPLATE = '﻿연도,제목\n2024,예시 - 강화 전등사 범종각 보수\n2023,예시 - 화성 행궁 별당 수리\n';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

export default async function AdminHistoryPage() {
  const works = await getHistoryWorksFlat();

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        연혁
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        연혁 항목(연도 + 제목)을 추가하고, 항목마다 사진을 첨부할 수 있습니다.
        사진이 첨부된 항목은 사이트에서 “MEDIA” 배지를 눌러 사진을 볼 수 있습니다.
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
            양식을 내려받아 <b>1열=연도(4자리), 2열=제목</b>으로 채운 뒤 업로드하세요.
            엑셀(.xlsx)·CSV 모두 가능하고, 첫 줄 머리글(연도/제목)은 있어도 없어도 됩니다.
            업로드한 연도에 따라 시대 구간과 상단 시계가 자동으로 갱신됩니다.
          </>
        }
      />

      {/* ── Add new ── */}
      <form action={createHistoryWork}
        style={{ backgroundColor: '#FFFFFF', border: '2px solid #1A1A1A', padding: 28, marginBottom: 32 }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#1A1A1A', marginBottom: 20 }}>
          + 새 연혁 추가
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'end' }}>
          <TextField label="연도" name="year" type="number" required placeholder="2024" />
          <TextField label="제목" name="title" required placeholder="예: 강화 전등사 범종각 신축" />
        </div>
        <div style={{ marginTop: 20 }}>
          <SubmitButton>추가</SubmitButton>
        </div>
      </form>

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
