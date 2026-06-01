import { getHistoryWorksFlat } from '@/lib/data/queries';
import { eraBucket } from '@/lib/data/era';
import {
  createHistoryWork, updateHistoryWork, deleteHistoryWork,
  addHistoryMedia, deleteHistoryMedia, importHistory,
} from '@/lib/admin/actions';
import { TextField, SubmitButton, ADMIN } from '@/components/admin/ui';
import ImportPanel from '@/components/admin/ImportPanel';

const HISTORY_TEMPLATE = '﻿연도,제목\n2024,예시 - 강화 전등사 범종각 보수\n2023,예시 - 화성 행궁 별당 수리\n';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

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

      {/* ── Existing list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {works.map((w) => (
          <div key={w.id} style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, padding: 24 }}>
            {/* edit year + title */}
            <form action={updateHistoryWork}>
              <input type="hidden" name="id" value={w.id} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.1em', color: ADMIN.muted }}>
                  시대 구간 {eraBucket(w.year).label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 16, alignItems: 'end' }}>
                <TextField label="연도" name="year" type="number" defaultValue={w.year} required />
                <TextField label="제목" name="title" defaultValue={w.title} required />
                <SubmitButton>저장</SubmitButton>
              </div>
            </form>

            {/* media */}
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${HAIR}` }}>
              <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', color: ADMIN.muted,
                textTransform: 'uppercase', marginBottom: 12 }}>
                사진 ({w.media.length})
              </p>

              {w.media.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  {w.media.map((m) => (
                    <div key={m.id ?? m.image_url} style={{ width: 130 }}>
                      <div style={{ width: 130, height: 92, overflow: 'hidden', backgroundColor: ADMIN.surface,
                        border: `1px solid ${HAIR}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image_url} alt={m.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      {m.caption && (
                        <p style={{ fontFamily: SANS, fontSize: 11, color: '#888', marginTop: 4, lineHeight: 1.4 }}>
                          {m.caption}
                        </p>
                      )}
                      {m.id && (
                        <form action={deleteHistoryMedia} style={{ marginTop: 6 }}>
                          <input type="hidden" name="id" value={m.id} />
                          <SubmitButton variant="danger">사진 삭제</SubmitButton>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* add media */}
              <form action={addHistoryMedia}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end',
                  backgroundColor: ADMIN.canvas, border: `1px solid ${HAIR}`, padding: 16 }}>
                <input type="hidden" name="history_work_id" value={w.id} />
                <label style={{ display: 'block' }}>
                  <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', color: ADMIN.muted,
                    textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>사진 파일</span>
                  <input type="file" name="image" accept="image/*" required
                    style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.inkSoft }} />
                  <span style={{ display: 'block', fontFamily: SANS, fontSize: 11, color: ADMIN.ink, marginTop: 5 }}>
                    권장 1600 × 1066px · 최소 1200 × 800px (가로 3:2 · 5MB 이하)
                  </span>
                </label>
                <TextField label="설명 (선택)" name="caption" placeholder="사진 설명" style={{ minWidth: 220 }} />
                <SubmitButton variant="ghost">사진 추가</SubmitButton>
              </form>
            </div>

            {/* delete whole entry */}
            <form action={deleteHistoryWork} style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${HAIR}` }}>
              <input type="hidden" name="id" value={w.id} />
              <SubmitButton variant="danger">이 연혁 항목 삭제</SubmitButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
