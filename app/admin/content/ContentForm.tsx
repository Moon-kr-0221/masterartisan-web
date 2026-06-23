'use client';

import { useRef, useState, useTransition } from 'react';
import { saveSiteCopy, saveHistoryHeaderImage } from '@/lib/admin/actions';
import { TextField, TextArea, ImageInput, ADMIN } from '@/components/admin/ui';
import type { SiteCopy } from '@/lib/data/queries';

const SANS = 'var(--font-sans)';

function ViewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: 14, color: ADMIN.ink, whiteSpace: 'pre-line' }}>{value}</span>
    </div>
  );
}

export default function ContentForm({ copy, headerImage }: { copy: SiteCopy; headerImage: string }) {
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
        await saveSiteCopy(fd);
        const imageFile = fd.get('history_header_image');
        if (imageFile instanceof File && imageFile.size > 0) {
          const imgFd = new FormData();
          imgFd.append('image', imageFile);
          await saveHistoryHeaderImage(imgFd);
        }
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

  if (!editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>
            홈 — 다릅니다 · 바릅니다
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ViewRow label="좌측 — 영문 라벨" value={copy.contrast_left_eyebrow} />
              <ViewRow label="좌측 — 제목" value={copy.contrast_left_title} />
              <ViewRow label="좌측 — 설명" value={copy.contrast_left_desc} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ViewRow label="우측 — 영문 라벨" value={copy.contrast_right_eyebrow} />
              <ViewRow label="우측 — 제목" value={copy.contrast_right_title} />
              <ViewRow label="우측 — 설명" value={copy.contrast_right_desc} />
            </div>
          </div>
        </section>

        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>
            홈 — THE PROCESS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
            <ViewRow label="영문 라벨" value={copy.process_eyebrow} />
            <ViewRow label="제목" value={copy.process_title} />
            <ViewRow label="설명" value={copy.process_desc} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <ViewRow label="STEP 01" value={copy.process_step_1} />
            <ViewRow label="STEP 02" value={copy.process_step_2} />
            <ViewRow label="STEP 03" value={copy.process_step_3} />
            <ViewRow label="STEP 04" value={copy.process_step_4} />
          </div>
        </section>

        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>
            연혁 — 페이지 상단 헤더
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <ViewRow label="영문 라벨" value={copy.history_header_eyebrow} />
              <ViewRow label="제목" value={copy.history_header_title} />
              <ViewRow label="설명" value={copy.history_header_desc} />
            </div>
            <div style={{ width: 200, height: 140, flexShrink: 0, overflow: 'hidden',
              backgroundColor: ADMIN.surface, border: `1px solid ${ADMIN.hairline}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={headerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
    <form ref={formRef} onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>
            홈 — 다릅니다 · 바릅니다
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <TextField label="좌측 — 영문 라벨" name="contrast_left_eyebrow" defaultValue={copy.contrast_left_eyebrow} />
              <TextField label="좌측 — 제목" name="contrast_left_title" defaultValue={copy.contrast_left_title} />
              <TextArea label="좌측 — 설명 (줄바꿈 가능)" name="contrast_left_desc" defaultValue={copy.contrast_left_desc} rows={3} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <TextField label="우측 — 영문 라벨" name="contrast_right_eyebrow" defaultValue={copy.contrast_right_eyebrow} />
              <TextField label="우측 — 제목" name="contrast_right_title" defaultValue={copy.contrast_right_title} />
              <TextArea label="우측 — 설명 (줄바꿈 가능)" name="contrast_right_desc" defaultValue={copy.contrast_right_desc} rows={3} />
            </div>
          </div>
        </section>

        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>
            홈 — THE PROCESS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
            <TextField label="영문 라벨" name="process_eyebrow" defaultValue={copy.process_eyebrow} />
            <TextField label="제목" name="process_title" defaultValue={copy.process_title} />
            <TextArea label="설명 (줄바꿈 가능)" name="process_desc" defaultValue={copy.process_desc} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <TextField label="STEP 01" name="process_step_1" defaultValue={copy.process_step_1} />
            <TextField label="STEP 02" name="process_step_2" defaultValue={copy.process_step_2} />
            <TextField label="STEP 03" name="process_step_3" defaultValue={copy.process_step_3} />
            <TextField label="STEP 04" name="process_step_4" defaultValue={copy.process_step_4} />
          </div>
        </section>

        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>
            연혁 — 페이지 상단 헤더
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
            <TextField label="영문 라벨" name="history_header_eyebrow" defaultValue={copy.history_header_eyebrow} />
            <TextArea label="제목 (줄바꿈 가능)" name="history_header_title" defaultValue={copy.history_header_title} rows={3} />
            <TextArea label="설명" name="history_header_desc" defaultValue={copy.history_header_desc} rows={2} />
          </div>
          <ImageInput name="history_header_image" current={headerImage} label="헤더 사진" />
        </section>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
          <button type="button" onClick={handleCancel} disabled={pending}
            style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${ADMIN.hairline}` }}>
            취소
          </button>
          <button type="submit" disabled={pending}
            style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF', opacity: pending ? 0.6 : 1 }}>
            {pending ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </form>
  );
}
