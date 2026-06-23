'use client';

import { useRef, useState, useTransition } from 'react';
import { saveProcessImages } from '@/lib/admin/actions';
import { ADMIN } from '@/components/admin/ui';

const SANS = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';
const HAIR = '#E4E0D8';

const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '9px 20px',
  border: 'none', cursor: 'pointer', letterSpacing: '0.04em', borderRadius: 0,
};

// 슬롯별 레이아웃 정보
const SLOTS = [
  { label: '이미지 1 (좌상)', pos: '좌상', desktopSize: '480 × 298 px', mobileSize: '193 × 144 px', hint: '권장 960×596px · 최소 480×298px' },
  { label: '이미지 2 (우상)', pos: '우상', desktopSize: '478 × 298 px', mobileSize: '193 × 144 px', hint: '권장 956×596px · 최소 478×298px' },
  { label: '이미지 3 (좌하)', pos: '좌하', desktopSize: '480 × 300 px', mobileSize: '193 × 144 px', hint: '권장 960×600px · 최소 480×300px' },
  { label: '이미지 4 (우하)', pos: '우하', desktopSize: '478 × 300 px', mobileSize: '193 × 144 px', hint: '권장 956×600px · 최소 478×300px' },
];

function SlotCard({ idx, currentUrl, file, preview, onFileChange, editing }: {
  idx: number;
  currentUrl: string;
  file: File | null;
  preview: string;
  onFileChange: (f: File | null, url: string) => void;
  editing: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const slot = SLOTS[idx];
  const displayUrl = preview || currentUrl;

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}` }}>
      {/* 이미지 미리보기 */}
      <div style={{ position: 'relative', backgroundColor: '#F5F3EF', aspectRatio: '16/9', overflow: 'hidden' }}>
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted }}>{slot.pos}</span>
          </div>
        )}
        {/* 슬롯 번호 뱃지 */}
        <span style={{ position: 'absolute', top: 8, left: 8, fontFamily: SANS, fontSize: 10,
          backgroundColor: 'rgba(0,0,0,0.55)', color: '#FFF', padding: '3px 7px', letterSpacing: '0.06em' }}>
          {idx + 1}
        </span>
        {/* 새 파일 선택된 경우 뱃지 */}
        {preview && (
          <span style={{ position: 'absolute', top: 8, right: 8, fontFamily: SANS, fontSize: 10,
            backgroundColor: '#2A7A4B', color: '#FFF', padding: '3px 7px' }}>
            새 이미지
          </span>
        )}
      </div>

      {/* 정보 및 컨트롤 */}
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: ADMIN.ink, marginBottom: 8 }}>
          {slot.label}
        </p>

        {/* 최소 사이즈 정보 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
          <div style={{ backgroundColor: '#F5F3EF', padding: '8px 10px' }}>
            <p style={{ fontFamily: SANS, fontSize: 9, color: ADMIN.muted, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 3 }}>데스크탑</p>
            <p style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.ink }}>{slot.desktopSize}</p>
          </div>
          <div style={{ backgroundColor: '#F5F3EF', padding: '8px 10px' }}>
            <p style={{ fontFamily: SANS, fontSize: 9, color: ADMIN.muted, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 3 }}>모바일</p>
            <p style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.ink }}>{slot.mobileSize}</p>
          </div>
        </div>

        <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, marginBottom: 10 }}>{slot.hint}</p>

        {/* 파일 선택 (수정 모드일 때만) */}
        {editing && (
          <>
            <input ref={fileRef} type="file" accept="image/*"
              style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f) {
                  onFileChange(f, URL.createObjectURL(f));
                }
              }} />
            <button type="button" onClick={() => fileRef.current?.click()}
              style={{ ...btnBase, padding: '7px 14px', fontSize: 12,
                backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${HAIR}` }}>
              {displayUrl ? '이미지 교체' : '이미지 선택'}
            </button>
            {preview && (
              <button type="button" onClick={() => onFileChange(null, '')}
                style={{ ...btnBase, padding: '7px 14px', fontSize: 12, marginLeft: 8,
                  backgroundColor: '#FFFFFF', color: '#9B3B3B', border: '1px solid #E3C4C4' }}>
                취소
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProcessImagesClient({ initialUrls }: { initialUrls: string[] }) {
  const [editing, setEditing] = useState(false);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<string[]>(['', '', '', '']);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  function handleFileChange(idx: number, file: File | null, previewUrl: string) {
    setFiles((prev) => { const n = [...prev]; n[idx] = file; return n; });
    setPreviews((prev) => {
      if (prev[idx]) URL.revokeObjectURL(prev[idx]);
      const n = [...prev]; n[idx] = previewUrl; return n;
    });
  }

  function handleCancel() {
    previews.forEach((u) => { if (u) URL.revokeObjectURL(u); });
    setFiles([null, null, null, null]);
    setPreviews(['', '', '', '']);
    setEditing(false);
    setMsg(''); setErr('');
  }

  function handleSave() {
    setMsg(''); setErr('');
    startTransition(async () => {
      try {
        const fd = new FormData();
        for (let i = 0; i < 4; i++) {
          fd.append(`url_${i + 1}`, initialUrls[i] ?? '');
          if (files[i]) fd.append(`image_${i + 1}`, files[i]!);
        }
        await saveProcessImages(fd);
        setMsg('저장되었습니다.');
        previews.forEach((u) => { if (u) URL.revokeObjectURL(u); });
        setFiles([null, null, null, null]);
        setPreviews(['', '', '', '']);
        setEditing(false);
        setTimeout(() => setMsg(''), 4000);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '저장 실패');
      }
    });
  }

  return (
    <div>
      {/* 레이아웃 안내 */}
      <div style={{ backgroundColor: '#F5F3EF', border: `1px solid ${HAIR}`, padding: '16px 20px', marginBottom: 28 }}>
        <p style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.muted, lineHeight: 1.8 }}>
          홈 페이지 <b>「장인의 혼을 담아」</b> 섹션의 2×2 이미지 그리드입니다.
          데스크탑은 2열 각 480px·478px, 모바일은 2열 균등 분할로 표시됩니다.
          이미지를 등록하지 않으면 기본 배경 이미지가 표시됩니다.
        </p>
      </div>

      {/* 2×2 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[0, 1, 2, 3].map((i) => (
          <SlotCard key={i} idx={i}
            currentUrl={initialUrls[i] ?? ''}
            file={files[i]}
            preview={previews[i]}
            onFileChange={(f, u) => handleFileChange(i, f, u)}
            editing={editing} />
        ))}
      </div>

      {/* 버튼 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!editing ? (
          <>
            <button type="button" onClick={() => setEditing(true)}
              style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>
              이미지 수정
            </button>
            {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
          </>
        ) : (
          <>
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            <button type="button" onClick={handleCancel} disabled={pending}
              style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>
              취소
            </button>
            <button type="button" onClick={handleSave} disabled={pending}
              style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF', opacity: pending ? 0.6 : 1 }}>
              {pending ? '저장 중…' : '저장'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
