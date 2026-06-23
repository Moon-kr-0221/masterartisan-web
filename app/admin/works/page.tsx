import { getWorks, getHomeWorksRandom, getWorksOrderMode } from '@/lib/data/queries';
import { createWork, updateWork, deleteWork, importWorks, setHomeWorksRandom, saveWorksOrderMode } from '@/lib/admin/actions';
import WorksManager from './WorksManager';
import ImportPanel from '@/components/admin/ImportPanel';

const WORKS_TEMPLATE =
  '﻿제목,분류,연도,설명,사진파일명\n' +
  '예시 - 수원 사찰 대웅전 보수,유지보수,2024,작업 내용을 적으세요,photo1.jpg\n' +
  '예시 - 전등사 배치 도면,도면,2023,도면 설명을 적으세요,\n';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

export default async function AdminWorksPage() {
  const [works, homeRandom, orderMode] = await Promise.all([getWorks(), getHomeWorksRandom(), getWorksOrderMode()]);

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        작업 사례
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        작업물의 사진·분류·제목을 추가하고 관리합니다.
      </p>

      <ImportPanel
        action={importWorks}
        heading="엑셀/CSV로 일괄 업로드"
        templateFilename="작업사례_업로드_양식.csv"
        templateCsv={WORKS_TEMPLATE}
        replaceLabel="기존 작업을 모두 지우고 이 파일로 교체"
        instructions={
          <>
            <b>방법 1 — 엑셀/CSV만:</b> 양식을 내려받아 제목·분류·연도·설명을 채운 뒤 업로드. 사진은 업로드 후 각 항목에서 따로 추가합니다.<br />
            <b>방법 2 — ZIP (사진 포함):</b> 양식의 <b>사진파일명</b> 열에 파일명(예: photo1.jpg)을 입력하고, CSV와 사진 파일들을 함께 ZIP으로 묶어 업로드하면 사진이 자동으로 등록됩니다.<br />
            분류는 <b>유지보수 / 수리 / 제작 / 도면</b> 중 하나. 엑셀(.xlsx)·CSV·ZIP 모두 가능합니다.
          </>
        }
      />

      <WorksManager works={works} updateWork={updateWork} deleteWork={deleteWork}
        createWork={createWork}
        homeRandomAction={setHomeWorksRandom} defaultHomeRandom={homeRandom}
        orderModeAction={saveWorksOrderMode} defaultOrderMode={orderMode} />
    </div>
  );
}
