'use client';

import { useRef, useTransition, useState } from 'react';
import type { Work } from '@/lib/data/types';
import WorksList, { type FeatState, type Action } from './WorksList';
import { AddWorkForm } from './WorksClient';
import { ADMIN } from '@/components/admin/ui';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '9px 20px',
  border: 'none', cursor: 'pointer', letterSpacing: '0.04em', borderRadius: 0,
};

export default function WorksManager({ works, updateWork, deleteWork, createWork, homeRandomAction, defaultHomeRandom }: {
  works: Work[]; updateWork: Action; deleteWork: Action; createWork: Action;
  homeRandomAction: Action; defaultHomeRandom: boolean;
}) {
  const [featState, setFeatState] = useState<FeatState>(() =>
    Object.fromEntries(works.map((w) => [w.id, { featured: w.featured, order: w.featuredOrder }]))
  );

  // ── 랜덤 폼 상태 ──
  const [editing, setEditing] = useState(false);
  const [isRandom, setIsRandom] = useState(defaultHomeRandom);
  const [randomPending, startRandom] = useTransition();
  const [randomMsg, setRandomMsg] = useState('');
  const [randomErr, setRandomErr] = useState('');

  const workMap = Object.fromEntries(works.map((w) => [w.id, w]));

  // 노출 중인 작업 목록 (order 순 정렬)
  const featuredList = Object.entries(featState)
    .filter(([, s]) => s.featured)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([id, s]) => ({ work: workMap[id], order: s.order }))
    .filter((item) => item.work != null) as { work: Work; order: number }[];

  const canSave = isRandom || featuredList.length === 3;

  function handleRandomChange(checked: boolean) {
    if (!checked && featuredList.length < 3) {
      alert('랜덤 노출을 해제하려면 아래 작업 카드에서 메인 노출할 작업 3개를 먼저 지정해 주세요.');
      return;
    }
    setIsRandom(checked);
  }

  function handleSave() {
    if (!canSave) return;
    const fd = new FormData();
    if (isRandom) fd.append('random', 'on');
    setRandomMsg(''); setRandomErr('');
    startRandom(async () => {
      try {
        await homeRandomAction(fd);
        setRandomMsg(isRandom ? '랜덤 노출로 저장되었습니다.' : '지정 노출로 저장되었습니다.');
        setEditing(false);
        setTimeout(() => setRandomMsg(''), 4000);
      } catch (ex: unknown) { setRandomErr(ex instanceof Error ? ex.message : '저장 실패'); }
    });
  }

  function handleCancel() {
    setIsRandom(defaultHomeRandom);
    setEditing(false);
    setRandomMsg(''); setRandomErr('');
  }

  function clearById(id: string) {
    setFeatState((prev) => ({ ...prev, [id]: { featured: false, order: 0 } }));
  }

  function scrollToWork(id: string) {
    const el = document.getElementById(`work-card-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── 드래그 앤 드롭 순서 변경 ──
  const dragId = useRef<string | null>(null);

  function handleDragStart(id: string) { dragId.current = id; }

  function handleDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (!dragId.current || dragId.current === overId) return;
    const fromId = dragId.current;
    const fromOrder = featState[fromId]?.order;
    const toOrder   = featState[overId]?.order;
    if (fromOrder == null || toOrder == null) return;
    setFeatState((prev) => ({
      ...prev,
      [fromId]: { ...prev[fromId], order: toOrder },
      [overId]:  { ...prev[overId],  order: fromOrder },
    }));
    dragId.current = overId;
  }

  function handleDragEnd() { dragId.current = null; }

  const takenOrders = Object.values(featState)
    .filter((s) => s.featured)
    .map((s) => s.order);

  return (
    <div>
      {/* ── 메인(홈) 작업사례 표시 방식 ── */}
      <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, padding: 24, marginBottom: 32 }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: ADMIN.ink, marginBottom: 14 }}>
          메인(홈) 작업사례 표시 방식
        </p>

        {/* 체크박스 — 수정 모드일 때만 클릭 가능 */}
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 14,
          color: editing ? '#333' : ADMIN.muted, cursor: editing ? 'pointer' : 'default' }}>
          <input type="checkbox" checked={isRandom} disabled={!editing}
            onChange={(e) => handleRandomChange(e.target.checked)} />
          메인 작업사례를 매번 <b>랜덤</b>으로 표시
        </label>
        <p style={{ fontFamily: SANS, fontSize: 12, color: '#999', lineHeight: 1.7, margin: '10px 0 16px' }}>
          체크 시 → 홈 작업사례 3개가 방문할 때마다 무작위로 바뀝니다(아래 "메인 노출" 지정은 무시).
          해제 시 → 아래에서 체크한 작업 3개가 순서대로 노출됩니다.
        </p>

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!editing ? (
            <>
              <button type="button" onClick={() => setEditing(true)}
                style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>
                표시 방식 수정
              </button>
              {randomMsg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{randomMsg}</span>}
            </>
          ) : (
            <>
              {!canSave && (
                <span style={{ fontFamily: SANS, fontSize: 12, color: '#9B3B3B' }}>
                  노출할 작업 3개를 지정해야 저장할 수 있습니다 ({featuredList.length}/3)
                </span>
              )}
              {randomErr && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{randomErr}</span>}
              <button type="button" onClick={handleCancel} disabled={randomPending}
                style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>
                취소
              </button>
              <button type="button" onClick={handleSave} disabled={!canSave || randomPending}
                style={{ ...btnBase, backgroundColor: canSave ? ADMIN.ink : '#CCC', color: '#FFFFFF',
                  cursor: canSave ? 'pointer' : 'not-allowed', opacity: randomPending ? 0.6 : 1 }}>
                {randomPending ? '저장 중…' : '저장'}
              </button>
            </>
          )}
        </div>

        {/* ── 메인 노출 중인 카드 목록 ── */}
        {featuredList.length > 0 && (
          <div style={{ marginTop: 20, borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
            <p style={{ fontFamily: SANS, fontSize: 12, color: ADMIN.muted, letterSpacing: '0.06em', marginBottom: 10 }}>
              메인 노출 중 ({featuredList.length}개)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {featuredList.map(({ work: w, order }) => (
                <div key={w.id}
                  draggable
                  onDragStart={() => handleDragStart(w.id)}
                  onDragOver={(e) => handleDragOver(e, w.id)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', alignItems: 'center', gap: 10,
                    border: `1px solid ${HAIR}`, padding: '10px 14px', backgroundColor: '#FAFAF8',
                    cursor: 'grab', userSelect: 'none' }}>
                  <span style={{ color: ADMIN.muted, fontSize: 12, flexShrink: 0, cursor: 'grab', lineHeight: 1 }}>⠿</span>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.ink,
                    letterSpacing: '0.08em', flexShrink: 0, minWidth: 28 }}>
                    {order}번
                  </span>
                  <button type="button" onClick={() => scrollToWork(w.id)}
                    style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.ink, background: 'none',
                      border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', flex: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    {w.title}
                  </button>
                  <button type="button" onClick={() => clearById(w.id)}
                    style={{ fontFamily: SANS, fontSize: 11, padding: '4px 10px', cursor: 'pointer',
                      backgroundColor: '#FFFFFF', color: '#9B3B3B', border: `1px solid #E3C4C4`,
                      borderRadius: 0, flexShrink: 0 }}>
                    해제
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddWorkForm action={createWork} takenOrders={takenOrders} />

      <WorksList
        works={works} updateWork={updateWork} deleteWork={deleteWork}
        featState={featState}
        onFeaturedChange={(id, v) => setFeatState((prev) => ({ ...prev, [id]: { ...prev[id], featured: v } }))}
        onOrderChange={(id, v) => setFeatState((prev) => ({ ...prev, [id]: { ...prev[id], order: v } }))}
      />
    </div>
  );
}
