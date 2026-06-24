'use client';

import { useRef, useState, useTransition } from 'react';
import { eraBucket } from '@/lib/data/era';
import type { HistoryWorkItem } from '@/lib/data/types';
import { TextField, ADMIN } from '@/components/admin/ui';

const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';
const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '9px 18px',
  cursor: 'pointer', borderRadius: 0, letterSpacing: '0.03em',
};

type Action = (formData: FormData) => void | Promise<void>;

// ── 사진 추가 폼 (최대 6장 동시 선택) ────────────────────────────────────────
function MediaAddForm({ workId, currentCount, action }: {
  workId: string; currentCount: number; action: Action;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploading, startUpload] = useTransition();
  const [err, setErr] = useState('');
  const maxMore = 6 - currentCount;

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, maxMore);
    const next = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return next;
    });
    // 선택 즉시 업로드
    if (!files.length) return;
    setErr('');
    startUpload(async () => {
      try {
        for (const file of files) {
          const fd = new FormData();
          fd.append('history_work_id', workId);
          fd.append('image', file);
          await action(fd);
        }
        setPreviews([]);
        if (fileRef.current) fileRef.current.value = '';
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '업로드 실패');
      }
    });
  }

  function removePreview(idx: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  }

  return (
    <div style={{ backgroundColor: ADMIN.canvas, border: `1px solid ${HAIR}`, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', color: ADMIN.muted, textTransform: 'uppercase' }}>
          사진 추가 (최대 {maxMore}장 동시 선택)
        </span>
        <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted }}>권장 1320×890px · 3:2 · 5MB 이하</span>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        onChange={handleFiles} />

      {/* 썸네일 미리보기 or 파일 선택 버튼 */}
      {previews.length === 0 ? (
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ ...btnBase, padding: '7px 14px', fontSize: 12,
            backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${ADMIN.hairline}` }}>
          {uploading ? '업로드 중…' : '파일 선택'}
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {previews.map((p, i) => (
            <div key={i} style={{ position: 'relative', width: 100, height: 72 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', border: `1px solid ${HAIR}` }} />
              {uploading && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: SANS, fontSize: 11, color: ADMIN.muted }}>업로드 중</div>
              )}
              {!uploading && (
                <button type="button" onClick={() => removePreview(i)}
                  style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18,
                    borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#FFF', fontSize: 10, cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {err && <p style={{ fontFamily: SANS, fontSize: 12, color: '#9B3B3B', marginTop: 8 }}>{err}</p>}
    </div>
  );
}

// ── 연혁 카드 (수정 모드 포함) ────────────────────────────────────────────────
function HistoryCard({ w, updateHistoryWork, deleteHistoryWork, addHistoryMedia, deleteHistoryMedia }: {
  w: HistoryWorkItem;
  updateHistoryWork: Action; deleteHistoryWork: Action;
  addHistoryMedia: Action; deleteHistoryMedia: Action;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState(false);
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();
  const [delConfirm, setDelConfirm] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [err, setErr] = useState('');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    if (w.media.length > 6) {
      alert(`사진이 ${w.media.length}장입니다.\n사진은 최대 6장까지만 등록할 수 있습니다.\n초과된 사진을 삭제한 후 다시 시도해 주세요.`);
      return;
    }

    const fd = new FormData(formRef.current);
    setErr(''); setSaveMsg('');
    startSave(async () => {
      try {
        await updateHistoryWork(fd);
        setSaveMsg('수정되었습니다.');
        setEditing(false);
        setTimeout(() => setSaveMsg(''), 3000);
      } catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : '수정 실패'); }
    });
  }

  function handleCancel() {
    formRef.current?.reset();
    setEditing(false);
    setErr('');
  }

  function handleDelete() {
    if (!delConfirm) { setDelConfirm(true); return; }
    const fd = new FormData(); fd.append('id', w.id);
    startDel(async () => {
      try { await deleteHistoryWork(fd); }
      catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : '삭제 실패'); setDelConfirm(false); }
    });
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}` }}>

      {/* ── 카드 헤더 ── */}
      <div style={{ padding: '12px 24px', borderBottom: `1px solid ${HAIR}`, backgroundColor: ADMIN.canvas }}>
        <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.1em', color: ADMIN.muted }}>
          시대 구간 {eraBucket(w.year).label}
        </span>
      </div>

      <form ref={formRef} onSubmit={handleSave}>
        <input type="hidden" name="id" value={w.id} />

        <div style={{ position: 'relative' }}>

          <div style={{ padding: '20px 24px 0', display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
            <TextField label="연도" name="year" type="number" defaultValue={w.year} required
              readOnly={!editing}
              style={{ backgroundColor: editing ? '#FFFFFF' : '#F0F0F0', pointerEvents: editing ? 'auto' : 'none' }} />
            <TextField label="제목" name="title" defaultValue={w.title} required
              readOnly={!editing}
              style={{ backgroundColor: editing ? '#FFFFFF' : '#F0F0F0', pointerEvents: editing ? 'auto' : 'none' }} />
          </div>

          {/* ── 사진 섹션 ── */}
          <div style={{ padding: '18px 24px 0', borderTop: `1px solid ${HAIR}`, marginTop: 20 }}>
            <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', color: ADMIN.muted,
              textTransform: 'uppercase', marginBottom: 12 }}>
              사진 ({w.media.length} / 6)
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
                    {m.id && editing && (
                      <button type="button"
                        onClick={() => {
                          const fd = new FormData(); fd.append('id', m.id!);
                          deleteHistoryMedia(fd);
                        }}
                        style={{ ...btnBase, padding: '5px 10px', fontSize: 11, marginTop: 6,
                          backgroundColor: '#FFFFFF', color: '#9B3B3B', border: '1px solid #E3C4C4' }}>
                        삭제
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {editing && w.media.length < 6 && (
              <MediaAddForm workId={w.id} currentCount={w.media.length} action={addHistoryMedia} />
            )}
            {editing && w.media.length >= 6 && (
              <div style={{ backgroundColor: ADMIN.canvas, border: `1px solid ${HAIR}`, padding: 14 }}>
                <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, margin: 0 }}>
                  사진은 최대 6장까지 추가할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── 카드 푸터 ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', marginTop: 16, borderTop: `1px solid ${HAIR}` }}>
          {/* 좌: 삭제 */}
          <div style={{ display: 'flex', gap: 8 }}>
            {!delConfirm ? (
              <button type="button" onClick={handleDelete} disabled={delPending}
                style={{ ...btnBase, backgroundColor: '#FFFFFF', color: '#9B3B3B', border: '1px solid #E3C4C4' }}>
                이 연혁 항목 삭제
              </button>
            ) : (
              <>
                <button type="button" onClick={handleDelete} disabled={delPending}
                  style={{ ...btnBase, backgroundColor: '#9B3B3B', color: '#FFFFFF', opacity: delPending ? 0.6 : 1 }}>
                  {delPending ? '삭제 중…' : '정말 삭제'}
                </button>
                <button type="button" onClick={() => setDelConfirm(false)}
                  style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>
                  취소
                </button>
              </>
            )}
          </div>

          {/* 우: 수정/완료/취소 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {saveMsg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{saveMsg}</span>}
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            {editing ? (
              <>
                <button type="button" onClick={handleCancel} disabled={savePending}
                  style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>
                  취소
                </button>
                <button type="submit" disabled={savePending}
                  style={{ ...btnBase,
                    backgroundColor: w.media.length > 6 ? '#9B3B3B' : ADMIN.ink,
                    color: '#FFFFFF', opacity: savePending ? 0.6 : 1 }}
                  title={w.media.length > 6 ? `사진 ${w.media.length}장 → 6장 이하로 줄여야 완료 가능` : undefined}>
                  {savePending ? '저장 중…' : w.media.length > 6 ? `완료 불가 (${w.media.length}장)` : '완료'}
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditing(true)}
                style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>
                수정
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// ── 메인 리스트 ───────────────────────────────────────────────────────────────
export default function HistoryList({
  works, updateHistoryWork, deleteHistoryWork, addHistoryMedia, deleteHistoryMedia,
}: {
  works: HistoryWorkItem[];
  updateHistoryWork: Action; deleteHistoryWork: Action;
  addHistoryMedia: Action; deleteHistoryMedia: Action;
}) {
  const eras = Array.from(
    new Map(works.map((w) => {
      const b = eraBucket(w.year);
      return [b.idx, b.label] as const;
    })).entries(),
  ).sort((a, b) => b[0] - a[0]);

  const [active, setActive] = useState<number | 'all'>('all');
  const shown = active === 'all' ? works : works.filter((w) => eraBucket(w.year).idx === active);
  const countOf = (idx: number | 'all') =>
    idx === 'all' ? works.length : works.filter((w) => eraBucket(w.year).idx === idx).length;

  const tab = (key: number | 'all', label: string) => {
    const on = active === key;
    return (
      <button key={key} type="button" onClick={() => setActive(key)}
        style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.04em',
          padding: '8px 16px', cursor: 'pointer',
          backgroundColor: on ? '#1A1A1A' : '#FFFFFF',
          color: on ? '#FFFFFF' : '#777',
          border: `1px solid ${on ? '#1A1A1A' : HAIR}`, borderRadius: 0 }}>
        {label} ({countOf(key)})
      </button>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {tab('all', '전체')}
        {eras.map(([idx, label]) => tab(idx, label))}
      </div>

      {shown.length === 0 ? (
        <p style={{ fontFamily: SANS, fontSize: 14, color: '#999', padding: '40px 0', textAlign: 'center' }}>
          해당 시대 구간의 연혁이 없습니다.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {shown.map((w) => (
            <HistoryCard key={w.id} w={w}
              updateHistoryWork={updateHistoryWork}
              deleteHistoryWork={deleteHistoryWork}
              addHistoryMedia={addHistoryMedia}
              deleteHistoryMedia={deleteHistoryMedia} />
          ))}
        </div>
      )}
    </div>
  );
}
