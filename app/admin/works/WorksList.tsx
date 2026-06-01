'use client';

import { useState } from 'react';
import { categoryLabels, type WorkCategory } from '@/data/works';
import type { Work } from '@/lib/data/types';
import { TextField, TextArea, SelectField, ImageInput, SubmitButton } from '@/components/admin/ui';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

const catOptions = (['maintenance', 'repair', 'fabrication', 'drawing'] as const).map((c) => ({
  value: c,
  label: categoryLabels[c],
}));

const TABS: WorkCategory[] = ['all', 'maintenance', 'repair', 'fabrication', 'drawing'];

const WORKS_IMG_HINT = '권장 1600 × 1066px · 최소 1200 × 800px (가로 3:2 · JPG/PNG · 5MB 이하)';

type Action = (formData: FormData) => void | Promise<void>;

// "메인(홈)에 노출" 체크 + 노출 순서. 홈 작업사례 섹션엔 순서 빠른 3개가 노출됩니다.
function FeaturedFields({ checked = false, order = 0 }: { checked?: boolean; order?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      backgroundColor: '#FAFAF8', border: `1px solid ${HAIR}`, padding: '12px 16px' }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: '#555' }}>
        <input type="checkbox" name="featured" defaultChecked={checked} />
        메인(홈) 작업사례에 노출
      </label>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: '#555' }}>
        노출 순서
        <input type="number" name="featured_order" defaultValue={order}
          style={{ width: 64, fontFamily: SANS, fontSize: 13, padding: '6px 8px', border: `1px solid ${HAIR}`, borderRadius: 0 }} />
      </label>
      <span style={{ fontFamily: SANS, fontSize: 11, color: '#999' }}>홈에는 순서가 빠른 3개가 표시됩니다.</span>
    </div>
  );
}

export default function WorksList({ works, updateWork, deleteWork }: {
  works: Work[];
  updateWork: Action;
  deleteWork: Action;
}) {
  const [active, setActive] = useState<WorkCategory>('all');
  const shown = active === 'all' ? works : works.filter((w) => w.category === active);

  const countOf = (cat: WorkCategory) =>
    cat === 'all' ? works.length : works.filter((w) => w.category === cat).length;

  return (
    <div>
      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {TABS.map((cat) => {
          const on = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              style={{
                fontFamily: SANS, fontSize: 12, letterSpacing: '0.04em',
                padding: '8px 16px', cursor: 'pointer',
                backgroundColor: on ? '#1A1A1A' : '#FFFFFF',
                color: on ? '#FFFFFF' : '#777',
                border: `1px solid ${on ? '#1A1A1A' : HAIR}`,
                borderRadius: 0,
              }}
            >
              {categoryLabels[cat]} ({countOf(cat)})
            </button>
          );
        })}
      </div>

      {/* ── Filtered list ── */}
      {shown.length === 0 ? (
        <p style={{ fontFamily: SANS, fontSize: 14, color: '#999', padding: '40px 0', textAlign: 'center' }}>
          해당 분류의 작업이 없습니다.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {shown.map((w) => (
            <div key={w.id} style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, padding: 24 }}>
              <form action={updateWork}>
                <input type="hidden" name="id" value={w.id} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <ImageInput current={w.image} hint={WORKS_IMG_HINT} />
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
                    <TextField label="제목" name="title" defaultValue={w.title} required />
                    <SelectField label="분류" name="category" defaultValue={w.category} options={catOptions} />
                    <TextField label="연도" name="year" defaultValue={w.year} />
                  </div>
                  <TextArea label="설명" name="description" defaultValue={w.description} />
                  <FeaturedFields checked={w.featured} order={w.featuredOrder} />
                </div>
                <div style={{ marginTop: 20 }}>
                  <SubmitButton>저장</SubmitButton>
                </div>
              </form>
              <form action={deleteWork} style={{ marginTop: 12, paddingTop: 16, borderTop: `1px solid ${HAIR}` }}>
                <input type="hidden" name="id" value={w.id} />
                <SubmitButton variant="danger">이 작업 삭제</SubmitButton>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
