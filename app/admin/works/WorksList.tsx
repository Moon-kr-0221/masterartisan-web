'use client';

import { useTransition, useState, useRef } from 'react';
import { categoryLabels, type WorkCategory } from '@/data/works';
import type { Work } from '@/lib/data/types';
import { TextField, TextArea, SelectField, ImageInput, ADMIN } from '@/components/admin/ui';
import { addWorkImage, deleteWorkImage, reorderWorks } from '@/lib/admin/actions';

const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

const catOptions = (['maintenance', 'repair', 'fabrication', 'drawing'] as const).map((c) => ({
  value: c, label: categoryLabels[c],
}));

const TABS: WorkCategory[] = ['all', 'maintenance', 'repair', 'fabrication', 'drawing'];
const WORKS_IMG_HINT = '권장 1600 × 1066px · 최소 1200 × 800px (가로 3:2 · JPG/PNG · 5MB 이하)';

export type FeatState = Record<string, { featured: boolean; order: number }>;
export type Action = (formData: FormData) => void | Promise<void>;

const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '10px 24px',
  border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
};

function FeaturedFields({ featured, order, takenOrders, onFeaturedChange, onOrderChange }: {
  featured: boolean; order: number; takenOrders: number[];
  onFeaturedChange: (v: boolean) => void; onOrderChange: (v: number) => void;
}) {
  const allSlotsFull = !featured && takenOrders.length >= 3;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      backgroundColor: '#FAFAF8', border: `1px solid ${HAIR}`, padding: '12px 16px' }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13,
        color: allSlotsFull ? '#BBB' : '#555', cursor: allSlotsFull ? 'not-allowed' : 'pointer' }}>
        <input type="checkbox" name="featured" checked={featured} disabled={allSlotsFull}
          onChange={(e) => onFeaturedChange(e.target.checked)} />
        메인(홈) 작업사례에 노출
        {allSlotsFull && <span style={{ fontFamily: SANS, fontSize: 11, color: '#BBB', marginLeft: 4 }}>(1·2·3번 모두 사용중)</span>}
      </label>
      <span style={{ fontFamily: SANS, fontSize: 13, color: featured ? '#555' : '#BBB' }}>노출 순서</span>
      {[1, 2, 3].map((n) => {
        const taken = takenOrders.includes(n);          // 다른 카드가 사용 중
        const usedByThis = featured && order === n;      // 이 카드가 선택·사용 중
        const disabled = !featured || taken;
        return (
          <label key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: SANS, fontSize: 13, color: disabled ? '#BBB' : '#555',
            cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <input type="radio" name="featured_order" value={n} checked={order === n}
              disabled={disabled} onChange={() => onOrderChange(n)} />
            {n}번{(taken || usedByThis) ? ' (사용중)' : ''}
          </label>
        );
      })}
    </div>
  );
}

function ExtraImages({ w }: { w: Work }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [addPending, startAdd] = useTransition();
  const [delPending, startDel] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // images[0] = 대표(main), extras = images[1..]
  // ma_work_images에는 extra만 들어가므로 w.images[1..]이 extras
  const extras = w.images.slice(1);

  function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('work_id', w.id);
    fd.append('image', file);
    setMsg(''); setErr('');
    startAdd(async () => {
      try {
        await addWorkImage(fd);
        setMsg('사진이 추가되었습니다.');
        setTimeout(() => setMsg(''), 3000);
      } catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : '추가 실패'); }
      if (fileRef.current) fileRef.current.value = '';
    });
  }

  function handleDel(url: string) {
    const fd = new FormData();
    fd.append('image_url', url);
    fd.append('work_id', w.id);
    setErr('');
    startDel(async () => {
      try { await deleteWorkImage(fd); }
      catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : '삭제 실패'); }
    });
  }

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${HAIR}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.muted, letterSpacing: '0.04em' }}>
          추가 사진 ({extras.length}장)
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {msg && <span style={{ fontFamily: SANS, fontSize: 12, color: '#2A7A4B' }}>{msg}</span>}
          {err && <span style={{ fontFamily: SANS, fontSize: 12, color: '#9B3B3B' }}>{err}</span>}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAdd} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={addPending}
            style={{ ...btnBase, padding: '7px 14px', backgroundColor: '#FFFFFF', color: ADMIN.ink,
              border: `1px solid ${HAIR}`, fontSize: 12, opacity: addPending ? 0.6 : 1 }}>
            {addPending ? '업로드 중…' : '+ 사진 추가'}
          </button>
        </div>
      </div>
      {extras.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
          {extras.map((url, i) => (
            <div key={url} style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden',
              border: `1px solid ${HAIR}`, backgroundColor: '#F5F3EF' }}>
              <img src={url} alt={`추가 사진 ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => handleDel(url)} disabled={delPending}
                style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20,
                  backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', border: 'none',
                  cursor: 'pointer', fontSize: 10, borderRadius: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkCard({ w, position, updateWork, deleteWork, takenOrders, featured, order, onFeaturedChange, onOrderChange }: {
  w: Work; position: number; updateWork: Action; deleteWork: Action;
  takenOrders: number[]; featured: boolean; order: number;
  onFeaturedChange: (v: boolean) => void; onOrderChange: (v: number) => void;
}) {
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();
  const [saveMsg, setSaveMsg] = useState('');
  const [delConfirm, setDelConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setErr(''); setSaveMsg('');
    startSave(async () => {
      try {
        await updateWork(fd);
        setSaveMsg('수정되었습니다.');
        setOpen(false);
        setTimeout(() => setSaveMsg(''), 3000);
      } catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : '수정 실패'); }
    });
  }

  function handleCancel() {
    formRef.current?.reset();
    setOpen(false);
    setErr('');
  }

  function handleDelete() {
    if (!delConfirm) { setDelConfirm(true); return; }
    const fd = new FormData(); fd.append('id', w.id);
    setErr('');
    startDel(async () => {
      try { await deleteWork(fd); }
      catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : '삭제 실패'); setDelConfirm(false); }
    });
  }

  return (
    <div id={`work-card-${w.id}`} style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, scrollMarginTop: 24 }}>
      {/* ── 아코디언 헤더 (접힌 요약: 대표사진·제목·분류 + 노출순서 번호) ── */}
      <button type="button" onClick={() => setOpen((v) => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <div style={{ width: 72, height: 48, flexShrink: 0, overflow: 'hidden', backgroundColor: '#EEE',
          border: `1px solid ${HAIR}` }}>
          {w.image
            ? <img src={w.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', backgroundColor: '#DDD' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: SANS, fontSize: 14, color: ADMIN.ink, margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</p>
          <p style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.muted, margin: '3px 0 0' }}>
            {categoryLabels[w.category]}{w.year ? ` · ${w.year}` : ''}
          </p>
        </div>
        {saveMsg && <span style={{ fontFamily: SANS, fontSize: 12, color: '#2A7A4B', flexShrink: 0 }}>{saveMsg}</span>}
        {/* 노출순서 번호 — 우측 작게 */}
        <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.04em', color: ADMIN.muted, flexShrink: 0 }}>
          노출 {position}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.muted, flexShrink: 0,
          display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>

      {/* ── 펼친 편집 폼 ── */}
      {open && (
        <form ref={formRef} onSubmit={handleSave} style={{ borderTop: `1px solid ${HAIR}`, padding: 24 }}>
          <input type="hidden" name="id" value={w.id} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ImageInput current={w.image} hint={WORKS_IMG_HINT} />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
              <TextField label="제목" name="title" defaultValue={w.title} required />
              <SelectField label="분류" name="category" defaultValue={w.category} options={catOptions} />
              <TextField label="연도" name="year" defaultValue={w.year} />
            </div>
            <TextArea label="설명" name="description" defaultValue={w.description} />
            <FeaturedFields featured={featured} order={order} takenOrders={takenOrders}
              onFeaturedChange={onFeaturedChange} onOrderChange={onOrderChange} />
            <ExtraImages w={w} />
          </div>
          {/* 카드 하단 푸터: 삭제(좌) + 취소·완료(우) */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${HAIR}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!delConfirm ? (
                <button type="button" onClick={handleDelete} disabled={delPending}
                  style={{ ...btnBase, backgroundColor: '#FFFFFF', color: '#9B3B3B', border: `1px solid #E3C4C4` }}>
                  이 작업 삭제
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
              <button type="button" onClick={handleCancel} disabled={savePending}
                style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>
                취소
              </button>
              <button type="submit" disabled={savePending}
                style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF', opacity: savePending ? 0.6 : 1 }}>
                {savePending ? '저장 중…' : '완료'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ── 순서 변경 모드 리스트 아이템 ────────────────────────────────────────────
function ReorderItem({ item, idx, total, onMove, onDelete, isDragging, onDragStart, onDragOver, onDragEnd }: {
  item: Work; idx: number; total: number;
  onMove: (from: number, to: number) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        backgroundColor: isDragging ? '#F0EDE6' : '#FFFFFF',
        border: `1px solid ${isDragging ? ADMIN.ink : HAIR}`,
        padding: '10px 14px', cursor: 'grab', userSelect: 'none',
        opacity: isDragging ? 0.7 : 1, transition: 'background 0.15s',
      }}>
      {/* 드래그 핸들 */}
      <span style={{ color: '#CCC', fontSize: 16, flexShrink: 0, cursor: 'grab', lineHeight: 1 }}>⠿</span>

      {/* 순번 */}
      <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, minWidth: 24, flexShrink: 0 }}>
        {idx + 1}
      </span>

      {/* 썸네일 */}
      <div style={{ width: 60, height: 44, flexShrink: 0, overflow: 'hidden', backgroundColor: '#EEE' }}>
        {item.image
          ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', backgroundColor: '#DDD' }} />}
      </div>

      {/* 제목 + 분류·연도 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
          {item.title}
        </p>
        <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, margin: '2px 0 0' }}>
          {categoryLabels[item.category]} · {item.year}
        </p>
      </div>

      {/* 위 / 아래 버튼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
        <button type="button" onClick={() => onMove(idx, idx - 1)} disabled={idx === 0}
          style={{ fontFamily: SANS, fontSize: 11, padding: '3px 8px', cursor: idx === 0 ? 'not-allowed' : 'pointer',
            backgroundColor: '#FFFFFF', color: idx === 0 ? '#CCC' : ADMIN.ink,
            border: `1px solid ${idx === 0 ? '#EEE' : HAIR}`, borderRadius: 0, lineHeight: 1 }}>
          ↑
        </button>
        <button type="button" onClick={() => onMove(idx, idx + 1)} disabled={idx === total - 1}
          style={{ fontFamily: SANS, fontSize: 11, padding: '3px 8px', cursor: idx === total - 1 ? 'not-allowed' : 'pointer',
            backgroundColor: '#FFFFFF', color: idx === total - 1 ? '#CCC' : ADMIN.ink,
            border: `1px solid ${idx === total - 1 ? '#EEE' : HAIR}`, borderRadius: 0, lineHeight: 1 }}>
          ↓
        </button>
      </div>

      {/* 삭제 */}
      <button type="button" onClick={() => {
        if (window.confirm(`"${item.title}"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
          onDelete(item.id);
        }
      }}
        style={{ fontFamily: SANS, fontSize: 11, padding: '6px 12px', cursor: 'pointer', flexShrink: 0,
          backgroundColor: '#FFFFFF', color: '#9B3B3B', border: `1px solid #E3C4C4`, borderRadius: 0 }}>
        삭제
      </button>
    </div>
  );
}

export default function WorksList({ works, updateWork, deleteWork, featState, onFeaturedChange, onOrderChange, orderModeAction, defaultOrderMode }: {
  works: Work[]; updateWork: Action; deleteWork: Action;
  featState: FeatState;
  onFeaturedChange: (id: string, v: boolean) => void;
  onOrderChange: (id: string, v: number) => void;
  orderModeAction: Action; defaultOrderMode: 'fixed' | 'random';
}) {
  const [active, setActive] = useState<WorkCategory>('all');
  const countOf = (cat: WorkCategory) =>
    cat === 'all' ? works.length : works.filter((w) => w.category === cat).length;

  // ── 순서 변경 모드 ──
  const [reordering, setReordering] = useState(false);
  const [reorderList, setReorderList] = useState<Work[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [savePending, startSave] = useTransition();
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');
  const dragIdx = useRef<number | null>(null);
  // 렌더 중 ref를 읽지 않도록 드래그 중인 인덱스는 state로 관리(시각 피드백 정상 동작)
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  function enterReorder() {
    setReorderList([...works]);
    setDeletedIds(new Set());
    setReordering(true);
    setSaveMsg(''); setSaveErr('');
  }

  function cancelReorder() {
    setReordering(false);
  }

  // ── 노출 순서: 고정 / 랜덤 ──
  const [orderMode, setOrderMode] = useState(defaultOrderMode);
  const [, startOrderMode] = useTransition();
  const [orderModeErr, setOrderModeErr] = useState('');

  function handleOrderModeChange(mode: 'fixed' | 'random') {
    if (mode === orderMode) return;
    setOrderMode(mode);
    if (mode === 'random' && reordering) setReordering(false);
    const fd = new FormData();
    fd.append('mode', mode);
    setOrderModeErr('');
    startOrderMode(async () => {
      try { await orderModeAction(fd); }
      catch (ex: unknown) { setOrderModeErr(ex instanceof Error ? ex.message : '저장 실패'); setOrderMode(defaultOrderMode); }
    });
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= reorderList.length) return;
    setReorderList((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function markDelete(id: string) {
    setDeletedIds((prev) => { const s = new Set(prev); s.add(id); return s; });
    setReorderList((prev) => prev.filter((w) => w.id !== id));
  }

  function handleDragStart(idx: number) { dragIdx.current = idx; setDraggingIdx(idx); }

  function handleDragOver(e: React.DragEvent, overIdx: number) {
    e.preventDefault();
    if (dragIdx.current == null || dragIdx.current === overIdx) return;
    moveItem(dragIdx.current, overIdx);
    dragIdx.current = overIdx;
    setDraggingIdx(overIdx);
  }

  function handleDragEnd() { dragIdx.current = null; setDraggingIdx(null); }

  function commitReorder() {
    startSave(async () => {
      try {
        // 삭제
        for (const id of deletedIds) {
          const fd = new FormData(); fd.append('id', id);
          await deleteWork(fd);
        }
        // 순서 저장 — ids를 쉼표 구분 문자열로 전달
        const fd = new FormData();
        fd.append('ids', reorderList.map((w) => w.id).join(','));
        await reorderWorks(fd);
        setSaveMsg('순서가 저장되었습니다.');
        setTimeout(() => { setSaveMsg(''); setReordering(false); }, 1500);
      } catch (ex: unknown) {
        setSaveErr(ex instanceof Error ? ex.message : '저장 실패');
      }
    });
  }

  const filteredWorks = active === 'all' ? works : works.filter((w) => w.category === active);

  function getTakenOrders(excludeId: string) {
    return Object.entries(featState)
      .filter(([id, s]) => id !== excludeId && s.featured)
      .map(([, s]) => s.order);
  }

  // 노출(표시) 순서 번호 — works는 sort_order 기준 정렬이므로 전체 목록 내 위치(1-based)
  const orderOf = new Map(works.map((w, i) => [w.id, i + 1]));

  return (
    <div>
      {/* ── 탭 + 순서 변경 버튼 ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TABS.map((cat) => {
            const on = active === cat;
            return (
              <button key={cat} type="button" onClick={() => setActive(cat)} disabled={reordering}
                style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.04em',
                  padding: '8px 16px', cursor: reordering ? 'not-allowed' : 'pointer',
                  backgroundColor: on ? '#1A1A1A' : '#FFFFFF',
                  color: on ? '#FFFFFF' : '#777',
                  border: `1px solid ${on ? '#1A1A1A' : HAIR}`, borderRadius: 0,
                  opacity: reordering ? 0.4 : 1 }}>
                {categoryLabels[cat]} ({countOf(cat)})
              </button>
            );
          })}
        </div>

        {/* 노출 순서: 고정 / 랜덤 + 순서 변경 / 완료·취소 버튼 */}
        {!reordering ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {([['fixed', '노출순서 고정'], ['random', '노출순서 랜덤']] as const).map(([mode, label]) => (
                <label key={mode} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: SANS, fontSize: 12, color: '#555', cursor: 'pointer' }}>
                  <input type="radio" name="works_order_mode" value={mode}
                    checked={orderMode === mode} onChange={() => handleOrderModeChange(mode)} />
                  {label}
                </label>
              ))}
              {orderModeErr && <span style={{ fontFamily: SANS, fontSize: 12, color: '#9B3B3B' }}>{orderModeErr}</span>}
            </div>
            <button type="button" onClick={enterReorder} disabled={orderMode === 'random'}
              style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, padding: '8px 18px',
                cursor: orderMode === 'random' ? 'not-allowed' : 'pointer',
                backgroundColor: orderMode === 'random' ? '#F5F3EF' : '#FFFFFF',
                color: orderMode === 'random' ? '#BBB' : ADMIN.ink,
                border: `1.5px solid ${orderMode === 'random' ? HAIR : ADMIN.ink}`, borderRadius: 0,
                letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>↕</span> 순서 변경
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {saveMsg && <span style={{ fontFamily: SANS, fontSize: 12, color: '#2A7A4B' }}>{saveMsg}</span>}
            {saveErr && <span style={{ fontFamily: SANS, fontSize: 12, color: '#9B3B3B' }}>{saveErr}</span>}
            <button type="button" onClick={cancelReorder} disabled={savePending}
              style={{ fontFamily: SANS, fontSize: 12, padding: '8px 18px', cursor: 'pointer',
                backgroundColor: '#FFFFFF', color: ADMIN.inkSoft,
                border: `1px solid ${HAIR}`, borderRadius: 0 }}>
              취소
            </button>
            <button type="button" onClick={commitReorder} disabled={savePending}
              style={{ fontFamily: SANS, fontSize: 12, padding: '8px 18px', cursor: 'pointer',
                backgroundColor: ADMIN.ink, color: '#FFFFFF',
                border: 'none', borderRadius: 0, opacity: savePending ? 0.6 : 1 }}>
              {savePending ? '저장 중…' : '완료'}
            </button>
          </div>
        )}
      </div>

      {/* ── 순서 변경 모드: 리스트 뷰 ── */}
      {reordering ? (
        <div>
          <p style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.muted, marginBottom: 12, lineHeight: 1.7 }}>
            드래그하거나 ↑↓ 버튼으로 순서를 변경하세요. <b>완료</b>를 눌러야 저장됩니다.
          </p>
          {reorderList.length === 0 ? (
            <p style={{ fontFamily: SANS, fontSize: 13, color: '#999', padding: '32px 0', textAlign: 'center' }}>
              작업이 없습니다.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {reorderList.map((w, i) => (
                <ReorderItem
                  key={w.id} item={w} idx={i} total={reorderList.length}
                  onMove={moveItem}
                  onDelete={markDelete}
                  isDragging={draggingIdx === i}
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── 일반 카드 뷰 ── */
        filteredWorks.length === 0 ? (
          <p style={{ fontFamily: SANS, fontSize: 14, color: '#999', padding: '40px 0', textAlign: 'center' }}>
            해당 분류의 작업이 없습니다.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredWorks.map((w) => {
              const st = featState[w.id] ?? { featured: w.featured, order: w.featuredOrder };
              return (
                <WorkCard key={w.id} w={w} position={orderOf.get(w.id) ?? 0}
                  updateWork={updateWork} deleteWork={deleteWork}
                  takenOrders={getTakenOrders(w.id)}
                  featured={st.featured} order={st.order}
                  onFeaturedChange={(v) => onFeaturedChange(w.id, v)}
                  onOrderChange={(v) => onOrderChange(w.id, v)} />
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
