'use client';

import { useState } from 'react';
import { eraBucket } from '@/lib/data/era';
import type { HistoryWorkItem } from '@/lib/data/types';
import { TextField, SubmitButton, ADMIN } from '@/components/admin/ui';

const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

type Action = (formData: FormData) => void | Promise<void>;

export default function HistoryList({
  works, updateHistoryWork, deleteHistoryWork, addHistoryMedia, deleteHistoryMedia,
}: {
  works: HistoryWorkItem[];
  updateHistoryWork: Action;
  deleteHistoryWork: Action;
  addHistoryMedia: Action;
  deleteHistoryMedia: Action;
}) {
  // 데이터에 존재하는 시대 구간(10년 단위)만 탭으로, 최신순.
  const eras = Array.from(
    new Map(works.map((w) => {
      const b = eraBucket(w.year);
      return [b.idx, b.label] as const;
    })).entries(),
  ).sort((a, b) => b[0] - a[0]); // idx 내림차순(최신 시대 먼저)

  const [active, setActive] = useState<number | 'all'>('all');
  const shown = active === 'all' ? works : works.filter((w) => eraBucket(w.year).idx === active);

  const countOf = (idx: number | 'all') =>
    idx === 'all' ? works.length : works.filter((w) => eraBucket(w.year).idx === idx).length;

  const tab = (key: number | 'all', label: string) => {
    const on = active === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setActive(key)}
        style={{
          fontFamily: SANS, fontSize: 12, letterSpacing: '0.04em',
          padding: '8px 16px', cursor: 'pointer',
          backgroundColor: on ? '#1A1A1A' : '#FFFFFF',
          color: on ? '#FFFFFF' : '#777',
          border: `1px solid ${on ? '#1A1A1A' : HAIR}`,
          borderRadius: 0,
        }}
      >
        {label} ({countOf(key)})
      </button>
    );
  };

  return (
    <div>
      {/* ── Era tabs ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {tab('all', '전체')}
        {eras.map(([idx, label]) => tab(idx, label))}
      </div>

      {/* ── Filtered list ── */}
      {shown.length === 0 ? (
        <p style={{ fontFamily: SANS, fontSize: 14, color: '#999', padding: '40px 0', textAlign: 'center' }}>
          해당 시대 구간의 연혁이 없습니다.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {shown.map((w) => (
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
      )}
    </div>
  );
}
