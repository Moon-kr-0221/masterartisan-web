'use client';

import { useRef, useState, useTransition } from 'react';
import { ADMIN } from '@/components/admin/ui';

const SANS = 'var(--font-sans)';
const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '9px 18px',
  cursor: 'pointer', borderRadius: 0, letterSpacing: '0.03em',
};

export default function ImportPanel({
  action, heading, instructions, templateCsv, templateFilename, replaceLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  heading: string;
  instructions: React.ReactNode;
  templateCsv: string;
  templateFilename: string;
  replaceLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  function downloadTemplate() {
    const blob = new Blob([templateCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = templateFilename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setMsg(''); setErr('');
    start(async () => {
      try {
        await action(fd);
        setMsg('업로드되었습니다.');
        formRef.current?.reset();
        setFileName('');
        setTimeout(() => setMsg(''), 4000);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '업로드 실패');
      }
    });
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${ADMIN.hairline}`, padding: 28, marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 300, color: ADMIN.ink }}>
          {heading}
        </p>
        <button type="button" onClick={downloadTemplate}
          style={{ ...btnBase, fontSize: 12, color: ADMIN.ink, border: `1px solid ${ADMIN.hairline}`, backgroundColor: '#FFFFFF', padding: '7px 14px' }}>
          양식 내려받기 ↓
        </button>
      </div>
      <p style={{ fontFamily: SANS, fontSize: 13, color: '#777', lineHeight: 1.7, marginBottom: 18 }}>
        {instructions}
      </p>

      <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input ref={fileRef} type="file" name="file" accept=".xlsx,.xls,.csv,.zip" required
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />

        {/* 1행: 파일 선택 + 파일명 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => fileRef.current?.click()}
            style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${ADMIN.hairline}`, flexShrink: 0 }}>
            파일 선택
          </button>
          <span style={{ fontFamily: SANS, fontSize: 13, color: fileName ? ADMIN.ink : ADMIN.muted }}>
            {fileName || '선택된 파일 없음'}
          </span>
        </div>

        {/* 2행: 체크박스(좌) + 메시지+업로드(우끝) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: ADMIN.inkSoft, flex: 1 }}>
            <input type="checkbox" name="replace" />
            {replaceLabel}
          </label>
          {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
          {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
          <button type="submit" disabled={pending}
            style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF', border: 'none', opacity: pending ? 0.6 : 1, marginLeft: 'auto' }}>
            {pending ? '업로드 중…' : '업로드'}
          </button>
        </div>
      </form>
    </div>
  );
}
