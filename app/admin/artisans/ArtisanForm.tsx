'use client';

import { useRef, useState, useTransition } from 'react';
import { updateArtisan } from '@/lib/admin/actions';
import { TextField, TextArea, ImageInput, ADMIN } from '@/components/admin/ui';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const genKr = ['', '초대', '이대', '삼대'];

type Artisan = {
  generation: number;
  generationEn: string;
  name: string;
  title: string;
  role: string;
  description: string;
  image?: string;
};

function ViewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: 14, color: ADMIN.ink, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{value || '—'}</span>
    </div>
  );
}

export default function ArtisanForm({ a }: { a: Artisan }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setErr('');
    setSaved(false);
    startTransition(async () => {
      try {
        await updateArtisan(fd);
        setSaved(true);
        setEditing(false);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '저장 실패');
      }
    });
  }

  function handleCancel() {
    setEditing(false);
    setErr('');
    setSaved(false);
    formRef.current?.reset();
  }

  const btnBase: React.CSSProperties = {
    fontFamily: SANS, fontSize: 13, padding: '10px 24px',
    border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
  };

  const header = (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
      <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 300, color: '#1A1A1A' }}>
        {genKr[a.generation] ?? `${a.generation}대`} 장인
      </span>
      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: '#AAA' }}>
        {a.generationEn}
      </span>
    </div>
  );

  if (!editing) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
        {header}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {a.image && (
            <img src={a.image} alt="" style={{ width: 160, height: 120, objectFit: 'cover', border: `1px solid ${ADMIN.hairline}` }} />
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ViewRow label="이름" value={a.name} />
            <ViewRow label="직함" value={a.title} />
          </div>
          <ViewRow label="영문 세대 표기" value={a.generationEn} />
          <ViewRow label="역할 (영문 부제)" value={a.role} />
          <ViewRow label="소개 내용" value={a.description} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
          <button type="button" onClick={() => setEditing(true)}
            style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>
            수정
          </button>
          {saved && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>저장되었습니다.</span>}
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}
      style={{ backgroundColor: '#FFFFFF', border: `2px solid ${ADMIN.ink}`, padding: 28 }}>
      <input type="hidden" name="generation" value={a.generation} />
      {header}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ImageInput current={a.image} hint="권장 1200 × 1040px · 최소 600 × 520px (가로형 · JPG/PNG · 5MB 이하)" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <TextField label="이름" name="name" defaultValue={a.name} required />
          <TextField label="직함" name="title" defaultValue={a.title} placeholder="대목장" />
        </div>
        <TextField label="영문 세대 표기" name="generation_en" defaultValue={a.generationEn} placeholder="1st Generation" />
        <TextField label="역할 (영문 부제)" name="role" defaultValue={a.role} placeholder="The founder of Jangga Woodworks" />
        <TextArea label="소개 내용 (Enter로 줄바꿈)" name="description" defaultValue={a.description} rows={8}
          style={{ whiteSpace: 'pre-wrap' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <button type="submit" disabled={pending}
          style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF', opacity: pending ? 0.6 : 1 }}>
          {pending ? '저장 중…' : '저장'}
        </button>
        <button type="button" onClick={handleCancel} disabled={pending}
          style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${ADMIN.hairline}` }}>
          취소
        </button>
        {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
      </div>
    </form>
  );
}
