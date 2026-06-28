'use client';

import { useRef, useState, useTransition } from 'react';
import { ADMIN } from '@/components/admin/ui';

const SANS = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';
const HAIR = '#E4E0D8';
const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '9px 18px',
  cursor: 'pointer', borderRadius: 0, letterSpacing: '0.03em',
};
const fieldStyle: React.CSSProperties = {
  fontFamily: SANS, fontSize: 14, color: ADMIN.ink,
  border: `1px solid ${HAIR}`, padding: '10px 14px',
  outline: 'none', borderRadius: 0, width: '100%', boxSizing: 'border-box',
  backgroundColor: '#FFFFFF',
};

type CreateAction = (fd: FormData) => Promise<{ id: string }>;
type UploadAction = (fd: FormData) => Promise<void>;

export default function AddHistoryForm({
  createHistoryWork, addHistoryMedia,
}: {
  createHistoryWork: CreateAction;
  addHistoryMedia: UploadAction;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setPreviews((prev) => { prev.forEach((p) => URL.revokeObjectURL(p.url)); return []; });
    setPreviews(files.map((f) => ({ file: f, url: URL.createObjectURL(f) })));
  }

  function removePreview(i: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!year || !title.trim()) return;
    setErr(''); setMsg('');
    start(async () => {
      try {
        const fd = new FormData();
        fd.append('year', year);
        fd.append('title', title.trim());
        const { id } = await createHistoryWork(fd);

        for (const { file } of previews) {
          const mfd = new FormData();
          mfd.append('history_work_id', id);
          mfd.append('image', file);
          await addHistoryMedia(mfd);
        }

        setMsg(`"${title.trim()}" 추가되었습니다.`);
        setYear(''); setTitle('');
        setPreviews([]);
        if (fileRef.current) fileRef.current.value = '';
        setOpen(false);
        setTimeout(() => setMsg(''), 4000);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '추가 실패');
      }
    });
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, marginBottom: 32 }}>
      {/* 아코디언 헤더 */}
      <button type="button" onClick={() => setOpen((v) => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#1A1A1A', textAlign: 'left' }}>
        <span>+ 새 연혁 추가</span>
        <span style={{ fontFamily: SANS, fontSize: 14, color: ADMIN.muted, transition: 'transform 0.2s',
          display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>

      {/* 아코디언 본문 */}
      {open && (
        <form onSubmit={handleSubmit}
          style={{ borderTop: `1px solid ${HAIR}`, padding: 24 }}>

          {/* 연도 + 제목 */}
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
            <div>
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', color: ADMIN.muted,
                textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>연도</span>
              <input type="number" value={year} onChange={(e) => setYear(e.target.value)}
                placeholder="2024" required style={fieldStyle} />
            </div>
            <div>
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', color: ADMIN.muted,
                textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>제목</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 강화 전등사 범종각 신축" required style={fieldStyle} />
            </div>
          </div>

          {/* 사진 추가 */}
          <div style={{ marginTop: 20, backgroundColor: ADMIN.canvas, border: `1px solid ${HAIR}`, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em', color: ADMIN.muted, textTransform: 'uppercase' }}>
                사진 (선택 · 최대 3장)
              </span>
              <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted }}>권장 1320×890px · 3:2 · 5MB 이하</span>
            </div>

            <input ref={fileRef} type="file" accept="image/*" multiple
              style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
              onChange={handleFiles} />

            {previews.length === 0 ? (
              <button type="button" onClick={() => fileRef.current?.click()}
                style={{ ...btnBase, padding: '7px 14px', fontSize: 12,
                  backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${HAIR}` }}>
                파일 선택
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {previews.map((p, i) => (
                  <div key={i} style={{ position: 'relative', width: 100, height: 72 }}>
                    <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', border: `1px solid ${HAIR}` }} />
                    <button type="button" onClick={() => removePreview(i)}
                      style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18,
                        borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#FFF', fontSize: 10, cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ✕
                    </button>
                  </div>
                ))}
                {previews.length < 3 && (
                  <button type="button" onClick={() => fileRef.current?.click()}
                    style={{ width: 100, height: 72, border: `1px dashed ${HAIR}`, backgroundColor: '#FFFFFF',
                      cursor: 'pointer', fontFamily: SANS, fontSize: 11, color: ADMIN.muted, borderRadius: 0 }}>
                    + 추가
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 하단 */}
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            <button type="button" onClick={() => setOpen(false)}
              style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>
              취소
            </button>
            <button type="submit" disabled={pending}
              style={{ ...btnBase, backgroundColor: '#1A1A1A', color: '#FFFFFF', opacity: pending ? 0.6 : 1 }}>
              {pending ? '추가 중…' : '추가'}
            </button>
          </div>
        </form>
      )}

      {/* 닫힌 상태 성공 메시지 */}
      {!open && msg && (
        <div style={{ padding: '8px 24px', borderTop: `1px solid ${HAIR}` }}>
          <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>
        </div>
      )}
    </div>
  );
}
