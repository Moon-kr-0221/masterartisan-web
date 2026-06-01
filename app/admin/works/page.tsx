import { getWorks, getHomeWorksRandom } from '@/lib/data/queries';
import { createWork, updateWork, deleteWork, importWorks, setHomeWorksRandom } from '@/lib/admin/actions';
import { categoryLabels } from '@/data/works';
import { TextField, TextArea, SelectField, ImageInput, SubmitButton } from '@/components/admin/ui';
import ImportPanel from '@/components/admin/ImportPanel';

const WORKS_TEMPLATE =
  '﻿제목,분류,연도,설명\n' +
  '예시 - 수원 사찰 대웅전 보수,유지보수,2024,작업 내용을 적으세요\n' +
  '예시 - 전등사 배치 도면,도면,2023,도면 설명을 적으세요\n';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

const catOptions = (['maintenance', 'repair', 'fabrication', 'drawing'] as const).map((c) => ({
  value: c,
  label: categoryLabels[c],
}));

const WORKS_IMG_HINT = '권장 1600 × 1066px · 최소 1200 × 800px (가로 3:2 · JPG/PNG · 5MB 이하)';

// "메인(홈)에 노출" 체크 + 노출 순서. 홈 작업사례 섹션엔 순서 빠른 3개가 노출됩니다.
function FeaturedFields({ checked = false, order = 0 }: { checked?: boolean; order?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      backgroundColor: '#FAFAF8', border: `1px solid ${HAIR}`, padding: '12px 16px' }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: '#555' }}>
        <input type="checkbox" name="featured" defaultChecked={checked} />
        메인(홈) 작업사례에 노출
      </label>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: '#555' }}>
        노출 순서
        <input type="number" name="featured_order" defaultValue={order}
          style={{ width: 64, fontFamily: SANS, fontSize: 13, padding: '6px 8px', border: `1px solid ${HAIR}`, borderRadius: 0 }} />
      </label>
      <span style={{ fontFamily: SANS, fontSize: 11, color: '#999' }}>홈에는 순서가 빠른 3개가 표시됩니다.</span>
    </div>
  );
}

export default async function AdminWorksPage() {
  const [works, homeRandom] = await Promise.all([getWorks(), getHomeWorksRandom()]);

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        작업 사례
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        작업물의 사진·분류·제목을 추가하고 관리합니다.
      </p>

      {/* ── Home showcase mode (random vs. pinned) ── */}
      <form action={setHomeWorksRandom}
        style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, padding: 24, marginBottom: 32 }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#1A1A1A', marginBottom: 14 }}>
          메인(홈) 작업사례 표시 방식
        </p>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 14, color: '#333' }}>
          <input type="checkbox" name="random" defaultChecked={homeRandom} />
          메인 작업사례를 매번 <b>랜덤</b>으로 표시
        </label>
        <p style={{ fontFamily: SANS, fontSize: 12, color: '#999', lineHeight: 1.7, margin: '10px 0 16px' }}>
          체크 시 → 홈 작업사례 3개가 방문할 때마다 무작위로 바뀝니다(아래 “메인 노출” 지정은 무시).
          해제 시 → 아래에서 체크한 작업이 순서대로 노출됩니다.
        </p>
        <SubmitButton variant="ghost">표시 방식 저장</SubmitButton>
      </form>

      {/* ── Bulk Excel/CSV import ── */}
      <ImportPanel
        action={importWorks}
        heading="엑셀/CSV로 일괄 업로드"
        templateFilename="작업사례_업로드_양식.csv"
        templateCsv={WORKS_TEMPLATE}
        replaceLabel="기존 작업을 모두 지우고 이 파일로 교체"
        instructions={
          <>
            양식을 내려받아 <b>제목 · 분류 · 연도 · 설명</b>을 채운 뒤 업로드하세요.
            분류는 <b>유지보수 / 수리 / 제작 / 도면</b> 중 하나로 적습니다(빈칸이면 유지보수).
            사진은 업로드 후 각 항목에서 추가하면 됩니다. 엑셀(.xlsx)·CSV 모두 가능합니다.
          </>
        }
      />

      {/* ── Add new ── */}
      <form action={createWork}
        style={{ backgroundColor: '#FFFFFF', border: '2px solid #1A1A1A', padding: 28, marginBottom: 32 }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#1A1A1A', marginBottom: 20 }}>
          + 새 작업 추가
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ImageInput hint={WORKS_IMG_HINT} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
            <TextField label="제목" name="title" required placeholder="수원 사찰 대웅전 보수" />
            <SelectField label="분류" name="category" options={catOptions} />
            <TextField label="연도" name="year" placeholder="2024" />
          </div>
          <TextArea label="설명" name="description" placeholder="작업 내용을 간단히 적어 주세요." />
          <FeaturedFields />
        </div>
        <div style={{ marginTop: 20 }}>
          <SubmitButton>추가</SubmitButton>
        </div>
      </form>

      {/* ── Existing list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {works.map((w) => (
          <div key={w.id} style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, padding: 24 }}>
            <form action={updateWork}>
              <input type="hidden" name="id" value={w.id} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ImageInput current={w.image} hint={WORKS_IMG_HINT} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
                  <TextField label="제목" name="title" defaultValue={w.title} required />
                  <SelectField label="분류" name="category" defaultValue={w.category} options={catOptions} />
                  <TextField label="연도" name="year" defaultValue={w.year} />
                </div>
                <TextArea label="설명" name="description" defaultValue={w.description} />
                <FeaturedFields checked={w.featured} order={w.featuredOrder} />
              </div>
              <div style={{ marginTop: 20 }}>
                <SubmitButton>저장</SubmitButton>
              </div>
            </form>
            <form action={deleteWork} style={{ marginTop: 12, paddingTop: 16, borderTop: `1px solid ${HAIR}` }}>
              <input type="hidden" name="id" value={w.id} />
              <SubmitButton variant="danger">이 작업 삭제</SubmitButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
