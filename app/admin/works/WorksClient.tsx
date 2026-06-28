'use client';

import { useRef, useTransition, useState } from 'react';
import { categoryLabels } from '@/data/works';
import { TextField, TextArea, SelectField, ImageInput, ADMIN } from '@/components/admin/ui';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

type Action = (formData: FormData) => void | Promise<void>;

const catOptions = (['maintenance', 'repair', 'fabrication', 'drawing'] as const).map((c) => ({
  value: c, label: categoryLabels[c],
}));

const WORKS_IMG_HINT = '권장 1600 × 1066px · 최소 1200 × 800px (가로 3:2 · JPG/PNG · 5MB 이하)';

const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '10px 24px',
  border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
};

// ── 커스텀 파일 버튼 ───────────────────────────────────────────────────────
function FileButton({ name, accept, required }: { name: string; accept?: string; required?: boolean }) {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <input ref={inputRef} type="file" name={name} accept={accept} required={required}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
      <button type="button" onClick={() => inputRef.current?.click()}
        style={{ fontFamily: SANS, fontSize: 13, padding: '9px 18px', cursor: 'pointer',
          backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${ADMIN.hairline}`,
          borderRadius: 0, letterSpacing: '0.03em' }}>
        파일 선택
      </button>
      <span style={{ fontFamily: SANS, fontSize: 13, color: fileName ? ADMIN.ink : ADMIN.muted }}>
        {fileName || '선택된 파일 없음'}
      </span>
    </div>
  );
}

// ── 메인 표시 방식 저장 ─────────────────────────────────────────────────────
export function HomeRandomForm({ action, defaultChecked }: { action: Action; defaultChecked: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setMsg(''); setErr('');
    const isRandom = fd.get('random') === 'on';
    start(async () => {
      try {
        await action(fd);
        setMsg(isRandom ? '메인 랜덤 노출이 켜졌습니다.' : '메인 랜덤 노출이 해제되었습니다.');
        setTimeout(() => setMsg(''), 4000);
      }
      catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : '저장 실패'); }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}
      style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, padding: 24, marginBottom: 32 }}>
      <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#1A1A1A', marginBottom: 14 }}>
        메인(홈) 작업사례 표시 방식
      </p>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 14, color: '#333' }}>
        <input type="checkbox" name="random" defaultChecked={defaultChecked} />
        메인 작업사례를 매번 <b>랜덤</b>으로 표시
      </label>
      <p style={{ fontFamily: SANS, fontSize: 12, color: '#999', lineHeight: 1.7, margin: '10px 0 16px' }}>
        체크 시 → 홈 작업사례 3개가 방문할 때마다 무작위로 바뀝니다(아래 “메인 노출” 지정은 무시).
        해제 시 → 아래에서 체크한 작업이 순서대로 노출됩니다.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="submit" disabled={pending}
          style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${HAIR}`, opacity: pending ? 0.6 : 1 }}>
          {pending ? '저장 중…' : '표시 방식 저장'}
        </button>
        {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
        {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
      </div>
    </form>
  );
}

// ── 새 작업 추가 ───────────────────────────────────────────────────────────
function FeaturedFields({ takenOrders = [] }: { takenOrders?: number[] }) {
  const [on, setOn] = useState(false);
  const firstFree = [1, 2, 3].find((n) => !takenOrders.includes(n)) ?? 0;
  const [order, setOrder] = useState(firstFree);
  const allSlotsFull = !on && takenOrders.length >= 3;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      backgroundColor: '#FAFAF8', border: `1px solid ${HAIR}`, padding: '12px 16px' }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13,
        color: allSlotsFull ? '#BBB' : '#555', cursor: allSlotsFull ? 'not-allowed' : 'pointer' }}>
        <input type="checkbox" name="featured" checked={on}
          disabled={allSlotsFull}
          onChange={(e) => {
            const checked = e.target.checked;
            setOn(checked);
            // Auto-pick the first free slot so we never submit an invalid order.
            if (checked && (order === 0 || takenOrders.includes(order))) setOrder(firstFree);
          }} />
        메인(홈) 작업사례에 노출
        {allSlotsFull && <span style={{ fontFamily: SANS, fontSize: 11, color: '#BBB', marginLeft: 4 }}>(1·2·3번 모두 사용중)</span>}
      </label>
      <span style={{ fontFamily: SANS, fontSize: 13, color: on ? '#555' : '#BBB' }}>노출 순서</span>
      {[1, 2, 3].map((n) => {
        const taken = takenOrders.includes(n);
        const disabled = !on || taken;
        return (
          <label key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: SANS, fontSize: 13,
            color: disabled ? '#BBB' : '#555', cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <input type="radio" name="featured_order" value={n}
              checked={order === n} disabled={disabled}
              onChange={() => setOrder(n)} />
            {n}번{taken ? ' (사용중)' : ''}
          </label>
        );
      })}
    </div>
  );
}

export function AddWorkForm({ action, takenOrders = [] }: { action: Action; takenOrders?: number[] }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setMsg(''); setErr('');
    start(async () => {
      try {
        await action(fd);
        const title = fd.get('title') as string;
        setMsg(`"${title}" 작업이 추가되었습니다.`);
        formRef.current?.reset();
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
        <span>+ 새 작업 추가</span>
        <span style={{ fontFamily: SANS, fontSize: 14, color: ADMIN.muted, display: 'inline-block',
          transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>

      {/* 아코디언 본문 */}
      {open && (
        <form ref={formRef} onSubmit={handleSubmit}
          style={{ borderTop: `1px solid ${HAIR}`, padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ImageInput hint={WORKS_IMG_HINT} />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
              <TextField label="제목" name="title" required placeholder="수원 사찰 대웅전 보수" />
              <SelectField label="분류" name="category" options={catOptions} />
              <TextField label="연도" name="year" placeholder="2024" />
            </div>
            <TextArea label="설명" name="description" placeholder="작업 내용을 간단히 적어 주세요." />
            <FeaturedFields takenOrders={takenOrders} />
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            <button type="button" onClick={() => setOpen(false)}
              style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>
              취소
            </button>
            <button type="submit" disabled={pending}
              style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF', opacity: pending ? 0.6 : 1 }}>
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

// ── Import Panel ───────────────────────────────────────────────────────────
export function ImportPanelClient({
  action, heading, instructions, templateCsv, templateFilename, replaceLabel,
}: {
  action: Action;
  heading: string;
  instructions: React.ReactNode;
  templateCsv: string;
  templateFilename: string;
  replaceLabel: string;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

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
        setTimeout(() => setMsg(''), 4000);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '업로드 실패');
      }
    });
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${ADMIN.hairline}`, padding: 28, marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: ADMIN.ink }}>{heading}</p>
        <button type="button" onClick={downloadTemplate}
          style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.04em', color: ADMIN.ink,
            border: `1px solid ${ADMIN.hairline}`, borderRadius: 0, padding: '7px 14px',
            backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
          양식 내려받기 ↓
        </button>
      </div>
      <p style={{ fontFamily: SANS, fontSize: 13, color: '#777', lineHeight: 1.7, marginBottom: 18 }}>
        {instructions}
      </p>
      <form ref={formRef} onSubmit={handleSubmit}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <FileButton name="file" accept=".xlsx,.xls,.csv" required />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: ADMIN.inkSoft }}>
          <input type="checkbox" name="replace" />
          {replaceLabel}
        </label>
        <button type="submit" disabled={pending}
          style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF', opacity: pending ? 0.6 : 1 }}>
          {pending ? '업로드 중…' : '업로드'}
        </button>
        {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
        {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
      </form>
    </div>
  );
}
