'use client';

import { useRef, useState, useTransition } from 'react';
import { saveHeroSlides, savePageHeroImages, saveProcessImages, saveContrastImages } from '@/lib/admin/actions';
import type { HeroSlide } from '@/lib/data/queries';
import { ADMIN } from '@/components/admin/ui';

const SANS = 'var(--font-sans)';
const SERIF = 'var(--font-serif)';
const HAIR = '#E4E0D8';

const DEFAULT_META = [
  { h1a: '천년의 기술',  h1b: '삼대의 손',        sub: 'Heritage of Master Artisan' },
  { h1a: '다름이',       h1b: '우리의 방식.',      sub: 'Different Thinking, Different Making' },
  { h1a: '전통을 담아',  h1b: '미래를 짓습니다.',  sub: 'Traditional Craft, Timeless Space' },
  { h1a: '기술이 아닌,', h1b: '예술로 짓습니다.',  sub: 'Crafted Beyond Convention' },
];

const btnBase: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, padding: '9px 20px',
  border: 'none', cursor: 'pointer', letterSpacing: '0.04em', borderRadius: 0,
};

const inputStyle: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, color: ADMIN.ink,
  border: `1px solid ${HAIR}`, padding: '8px 12px', width: '100%',
  backgroundColor: '#FFFFFF', outline: 'none', borderRadius: 0,
};

// ── 홈 히어로 슬라이드 카드 ────────────────────────────────────────────────

function SlideCard({
  idx, slide, file, preview, editing,
  onChange,
}: {
  idx: number;
  slide: HeroSlide;
  file: File | null;
  preview: string;
  editing: boolean;
  onChange: (field: 'h1a' | 'h1b' | 'sub' | 'image', value: string | File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const displayUrl = preview || slide.image;
  const def = DEFAULT_META[idx];

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}` }}>
      {/* 배경 이미지 프리뷰 */}
      <div style={{ position: 'relative', backgroundColor: '#1A1A1A', aspectRatio: '16/9', overflow: 'hidden' }}>
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.7 }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>슬라이드 {idx + 1}</span>
          </div>
        )}
        {/* 텍스트 오버레이 미리보기 */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: '#FFFFFF', lineHeight: 1.4, margin: 0 }}>
            {slide.h1a || def.h1a}<br />{slide.h1b || def.h1b}
          </p>
          <p style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>
            {slide.sub || def.sub}
          </p>
        </div>
        <span style={{ position: 'absolute', top: 8, left: 8, fontFamily: SANS, fontSize: 10,
          backgroundColor: 'rgba(0,0,0,0.55)', color: '#FFF', padding: '3px 7px' }}>
          {idx + 1}
        </span>
        {preview && (
          <span style={{ position: 'absolute', top: 8, right: 8, fontFamily: SANS, fontSize: 10,
            backgroundColor: '#2A7A4B', color: '#FFF', padding: '3px 7px' }}>새 이미지</span>
        )}
      </div>

      {/* 필드 편집 영역 */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* 이미지 */}
        <div>
          <p style={{ fontFamily: SANS, fontSize: 10, color: ADMIN.muted, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 4 }}>배경 이미지</p>
          <p style={{ fontFamily: SANS, fontSize: 10, color: ADMIN.muted, marginBottom: editing ? 8 : 0 }}>
            권장 1600×900px · 최소 960×540px · 비율 16:9
          </p>
          {editing && (
            <>
              <input ref={ref} type="file" accept="image/*"
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f) { onChange('image', f); }
                }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => ref.current?.click()}
                  style={{ ...btnBase, padding: '6px 12px', fontSize: 11,
                    backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${HAIR}` }}>
                  {displayUrl ? '이미지 교체' : '이미지 선택'}
                </button>
                {preview && (
                  <button type="button" onClick={() => onChange('image', null)}
                    style={{ ...btnBase, padding: '6px 12px', fontSize: 11,
                      backgroundColor: '#FFFFFF', color: '#9B3B3B', border: '1px solid #E3C4C4' }}>취소</button>
                )}
              </div>
            </>
          )}
        </div>

        {/* 텍스트 필드 */}
        {editing ? (
          <>
            <div>
              <label style={{ fontFamily: SANS, fontSize: 10, color: ADMIN.muted, letterSpacing: '0.08em',
                textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>헤드라인 1줄</label>
              <input style={inputStyle} value={slide.h1a} placeholder={def.h1a}
                onChange={(e) => onChange('h1a', e.target.value)} />
            </div>
            <div>
              <label style={{ fontFamily: SANS, fontSize: 10, color: ADMIN.muted, letterSpacing: '0.08em',
                textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>헤드라인 2줄</label>
              <input style={inputStyle} value={slide.h1b} placeholder={def.h1b}
                onChange={(e) => onChange('h1b', e.target.value)} />
            </div>
            <div>
              <label style={{ fontFamily: SANS, fontSize: 10, color: ADMIN.muted, letterSpacing: '0.08em',
                textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>서브카피 (영문)</label>
              <input style={inputStyle} value={slide.sub} placeholder={def.sub}
                onChange={(e) => onChange('sub', e.target.value)} />
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <p style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 300, color: ADMIN.ink, margin: 0 }}>
              {slide.h1a || <span style={{ color: ADMIN.muted }}>{def.h1a}</span>}&nbsp;/&nbsp;
              {slide.h1b || <span style={{ color: ADMIN.muted }}>{def.h1b}</span>}
            </p>
            <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, margin: 0 }}>
              {slide.sub || def.sub}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 홈 히어로 섹션 ────────────────────────────────────────────────────────

function HomeHeroSection({ initialSlides }: { initialSlides: HeroSlide[] }) {
  const [editing, setEditing] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides.map((s) => ({ ...s })));
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<string[]>(['', '', '', '']);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  function handleChange(idx: number, field: 'h1a' | 'h1b' | 'sub' | 'image', value: string | File | null) {
    if (field === 'image') {
      if (value instanceof File) {
        const url = URL.createObjectURL(value);
        setFiles((prev) => { const n = [...prev]; n[idx] = value; return n; });
        setPreviews((prev) => {
          if (prev[idx]) URL.revokeObjectURL(prev[idx]);
          const n = [...prev]; n[idx] = url; return n;
        });
      } else {
        setFiles((prev) => { const n = [...prev]; n[idx] = null; return n; });
        setPreviews((prev) => {
          if (prev[idx]) URL.revokeObjectURL(prev[idx]);
          const n = [...prev]; n[idx] = ''; return n;
        });
      }
    } else {
      setSlides((prev) => {
        const n = prev.map((s) => ({ ...s }));
        n[idx] = { ...n[idx], [field]: value as string };
        return n;
      });
    }
  }

  function handleCancel() {
    previews.forEach((u) => { if (u) URL.revokeObjectURL(u); });
    setSlides(initialSlides.map((s) => ({ ...s })));
    setFiles([null, null, null, null]);
    setPreviews(['', '', '', '']);
    setEditing(false); setMsg(''); setErr('');
  }

  function handleSave() {
    setMsg(''); setErr('');
    startTransition(async () => {
      try {
        const fd = new FormData();
        for (let i = 0; i < 4; i++) {
          fd.append(`url_${i + 1}`, slides[i].image ?? '');
          fd.append(`h1a_${i + 1}`, slides[i].h1a ?? '');
          fd.append(`h1b_${i + 1}`, slides[i].h1b ?? '');
          fd.append(`sub_${i + 1}`, slides[i].sub ?? '');
          if (files[i]) fd.append(`image_${i + 1}`, files[i]!);
        }
        await saveHeroSlides(fd);
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
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: ADMIN.ink, marginBottom: 6 }}>
        홈 히어로 슬라이드
      </h2>
      <p style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.muted, marginBottom: 20 }}>
        홈 페이지 상단 전체화면 슬라이드 4장의 배경 이미지와 카피라이팅을 수정합니다.
        비워두면 기본값이 표시됩니다.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[0, 1, 2, 3].map((i) => (
          <SlideCard key={i} idx={i} slide={slides[i]} file={files[i]} preview={previews[i]}
            editing={editing} onChange={(f, v) => handleChange(i, f, v)} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!editing ? (
          <>
            <button type="button" onClick={() => setEditing(true)}
              style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>수정</button>
            {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
          </>
        ) : (
          <>
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            <button type="button" onClick={handleCancel} disabled={pending}
              style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>취소</button>
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

// ── 페이지 히어로 (장인소개, 작업사례) ───────────────────────────────────

const PAGE_SLOTS = [
  {
    key: 'masterartisan' as const,
    imgField: 'image_masterartisan',
    urlField: 'url_masterartisan',
    label: '장인소개 페이지 히어로',
    hint: '권장 1440×360px · 최소 1440×180px · 비율 4:1',
  },
  {
    key: 'works' as const,
    imgField: 'image_works',
    urlField: 'url_works',
    label: '작업사례 히어로 (데스크탑)',
    hint: '권장 1600×360px · 최소 1440×180px · 비율 4:1',
  },
  {
    key: 'worksMobile' as const,
    imgField: 'image_works_mobile',
    urlField: 'url_works_mobile',
    label: '작업사례 히어로 (모바일)',
    hint: '권장 390×300px · 최소 390×150px · 비율 1.3:1',
  },
];

function PageHeroSlot({
  label, hint, currentUrl, preview, onFileChange, editing,
}: {
  label: string; hint: string; currentUrl: string; preview: string;
  onFileChange: (f: File | null, url: string) => void;
  editing: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const displayUrl = preview || currentUrl;
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, display: 'flex' }}>
      <div style={{ position: 'relative', backgroundColor: '#1A1A1A', width: 200, flexShrink: 0, overflow: 'hidden', minHeight: 112 }}>
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: SANS, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>미등록</span>
          </div>
        )}
        {preview && (
          <span style={{ position: 'absolute', top: 6, right: 6, fontFamily: SANS, fontSize: 9,
            backgroundColor: '#2A7A4B', color: '#FFF', padding: '2px 6px' }}>새 이미지</span>
        )}
      </div>
      <div style={{ padding: '16px 20px', flex: 1 }}>
        <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: ADMIN.ink, marginBottom: 6 }}>{label}</p>
        <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, marginBottom: editing ? 12 : 0 }}>{hint}</p>
        {editing && (
          <>
            <input ref={ref} type="file" accept="image/*"
              style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f) onFileChange(f, URL.createObjectURL(f));
              }} />
            <button type="button" onClick={() => ref.current?.click()}
              style={{ ...btnBase, padding: '6px 14px', fontSize: 12,
                backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${HAIR}` }}>
              {displayUrl ? '이미지 교체' : '이미지 선택'}
            </button>
            {preview && (
              <button type="button" onClick={() => onFileChange(null, '')}
                style={{ ...btnBase, padding: '6px 14px', fontSize: 12, marginLeft: 8,
                  backgroundColor: '#FFFFFF', color: '#9B3B3B', border: '1px solid #E3C4C4' }}>취소</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PageHeroSection({ initialUrls }: { initialUrls: { masterartisan: string; works: string; worksMobile: string } }) {
  const [editing, setEditing] = useState(false);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  function handleFileChange(key: string, file: File | null, previewUrl: string) {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key]);
      return { ...prev, [key]: previewUrl };
    });
  }

  function handleCancel() {
    Object.values(previews).forEach((u) => { if (u) URL.revokeObjectURL(u); });
    setFiles({}); setPreviews({});
    setEditing(false); setMsg(''); setErr('');
  }

  function handleSave() {
    setMsg(''); setErr('');
    startTransition(async () => {
      try {
        const fd = new FormData();
        for (const s of PAGE_SLOTS) {
          fd.append(s.urlField, initialUrls[s.key] ?? '');
          if (files[s.key]) fd.append(s.imgField, files[s.key]!);
        }
        await savePageHeroImages(fd);
        setMsg('저장되었습니다.');
        Object.values(previews).forEach((u) => { if (u) URL.revokeObjectURL(u); });
        setFiles({}); setPreviews({});
        setEditing(false);
        setTimeout(() => setMsg(''), 4000);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '저장 실패');
      }
    });
  }

  return (
    <div>
      <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: ADMIN.ink, marginBottom: 6 }}>
        페이지 히어로
      </h2>
      <p style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.muted, marginBottom: 20 }}>
        장인소개·작업사례 페이지 상단 배너 이미지를 교체합니다.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {PAGE_SLOTS.map((s) => (
          <PageHeroSlot key={s.key}
            label={s.label} hint={s.hint}
            currentUrl={initialUrls[s.key] ?? ''} preview={previews[s.key] ?? ''}
            onFileChange={(f, u) => handleFileChange(s.key, f, u)} editing={editing} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!editing ? (
          <>
            <button type="button" onClick={() => setEditing(true)}
              style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>수정</button>
            {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
          </>
        ) : (
          <>
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            <button type="button" onClick={handleCancel} disabled={pending}
              style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>취소</button>
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

// ── 콘트라스트 섹션 이미지 (다릅니다 / 바릅니다) ────────────────────────

const CONTRAST_SLOTS = [
  { key: 'left' as const,  label: '왼쪽 패널 (다릅니다)', hint: '권장 960×700px · 비율 자유 · 어두운 배경 권장' },
  { key: 'right' as const, label: '오른쪽 패널 (바릅니다)', hint: '권장 960×700px · 비율 자유 · 어두운 배경 권장' },
];

function ContrastSection({ initialUrls }: { initialUrls: { left: string; right: string } }) {
  const [editing, setEditing] = useState(false);
  const [files, setFiles]     = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  function handleFileChange(key: string, file: File | null, previewUrl: string) {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key]);
      return { ...prev, [key]: previewUrl };
    });
  }

  function handleCancel() {
    Object.values(previews).forEach((u) => { if (u) URL.revokeObjectURL(u); });
    setFiles({}); setPreviews({});
    setEditing(false); setMsg(''); setErr('');
  }

  function handleSave() {
    setMsg(''); setErr('');
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append('url_left',  initialUrls.left  ?? '');
        fd.append('url_right', initialUrls.right ?? '');
        if (files.left)  fd.append('image_left',  files.left);
        if (files.right) fd.append('image_right', files.right);
        await saveContrastImages(fd);
        setMsg('저장되었습니다.');
        Object.values(previews).forEach((u) => { if (u) URL.revokeObjectURL(u); });
        setFiles({}); setPreviews({});
        setEditing(false);
        setTimeout(() => setMsg(''), 4000);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '저장 실패');
      }
    });
  }

  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: ADMIN.ink, marginBottom: 6 }}>
        콘트라스트 섹션 이미지
      </h2>
      <p style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.muted, marginBottom: 20 }}>
        홈 페이지 「다릅니다 / 바릅니다」 섹션의 좌·우 패널 배경 이미지를 교체합니다.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {CONTRAST_SLOTS.map((s) => {
          const ref = { current: null } as React.MutableRefObject<HTMLInputElement | null>;
          const displayUrl = previews[s.key] || initialUrls[s.key];
          return (
            <div key={s.key} style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}` }}>
              <div style={{ position: 'relative', backgroundColor: '#1A1A1A', aspectRatio: '16/9', overflow: 'hidden' }}>
                {displayUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.8 }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{s.label}</span>
                  </div>
                )}
                {previews[s.key] && (
                  <span style={{ position: 'absolute', top: 8, right: 8, fontFamily: SANS, fontSize: 10,
                    backgroundColor: '#2A7A4B', color: '#FFF', padding: '3px 7px' }}>새 이미지</span>
                )}
              </div>
              <div style={{ padding: '12px 16px' }}>
                <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: ADMIN.ink, marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, marginBottom: editing ? 10 : 0 }}>{s.hint}</p>
                {editing && (
                  <ContrastUploadButton
                    displayUrl={displayUrl}
                    preview={previews[s.key] ?? ''}
                    refObj={ref}
                    onFile={(f, u) => handleFileChange(s.key, f, u)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!editing ? (
          <>
            <button type="button" onClick={() => setEditing(true)}
              style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>수정</button>
            {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
          </>
        ) : (
          <>
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            <button type="button" onClick={handleCancel} disabled={pending}
              style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>취소</button>
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

function ContrastUploadButton({ displayUrl, preview, refObj, onFile }: {
  displayUrl: string; preview: string;
  refObj: React.MutableRefObject<HTMLInputElement | null>;
  onFile: (f: File | null, url: string) => void;
}) {
  return (
    <>
      <input ref={refObj} type="file" accept="image/*"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0] ?? null; if (f) onFile(f, URL.createObjectURL(f)); }} />
      <button type="button" onClick={() => refObj.current?.click()}
        style={{ ...btnBase, padding: '6px 12px', fontSize: 11,
          backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${HAIR}` }}>
        {displayUrl ? '이미지 교체' : '이미지 선택'}
      </button>
      {preview && (
        <button type="button" onClick={() => onFile(null, '')}
          style={{ ...btnBase, padding: '6px 12px', fontSize: 11, marginLeft: 8,
            backgroundColor: '#FFFFFF', color: '#9B3B3B', border: '1px solid #E3C4C4' }}>취소</button>
      )}
    </>
  );
}

// ── 프로세스 이미지 (장인의 혼을 담아 2×2 그리드) ───────────────────────

const PROCESS_SLOTS = [
  { label: '이미지 1 (좌상)', pos: '좌상', hint: '권장 960×596px · 최소 480×298px' },
  { label: '이미지 2 (우상)', pos: '우상', hint: '권장 956×596px · 최소 478×298px' },
  { label: '이미지 3 (좌하)', pos: '좌하', hint: '권장 960×600px · 최소 480×300px' },
  { label: '이미지 4 (우하)', pos: '우하', hint: '권장 956×600px · 최소 478×300px' },
];

function ProcessSlotCard({ idx, currentUrl, file, preview, onFileChange, editing }: {
  idx: number; currentUrl: string; file: File | null; preview: string;
  onFileChange: (f: File | null, url: string) => void; editing: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const slot = PROCESS_SLOTS[idx];
  const displayUrl = preview || currentUrl;
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}` }}>
      <div style={{ position: 'relative', backgroundColor: '#F5F3EF', aspectRatio: '16/9', overflow: 'hidden' }}>
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted }}>{slot.pos}</span>
          </div>
        )}
        <span style={{ position: 'absolute', top: 8, left: 8, fontFamily: SANS, fontSize: 10,
          backgroundColor: 'rgba(0,0,0,0.55)', color: '#FFF', padding: '3px 7px' }}>{idx + 1}</span>
        {preview && (
          <span style={{ position: 'absolute', top: 8, right: 8, fontFamily: SANS, fontSize: 10,
            backgroundColor: '#2A7A4B', color: '#FFF', padding: '3px 7px' }}>새 이미지</span>
        )}
      </div>
      <div style={{ padding: '12px 16px' }}>
        <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: ADMIN.ink, marginBottom: 4 }}>{slot.label}</p>
        <p style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, marginBottom: editing ? 10 : 0 }}>{slot.hint}</p>
        {editing && (
          <>
            <input ref={ref} type="file" accept="image/*"
              style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0] ?? null; if (f) onFileChange(f, URL.createObjectURL(f)); }} />
            <button type="button" onClick={() => ref.current?.click()}
              style={{ ...btnBase, padding: '6px 12px', fontSize: 11,
                backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${HAIR}` }}>
              {displayUrl ? '이미지 교체' : '이미지 선택'}
            </button>
            {preview && (
              <button type="button" onClick={() => onFileChange(null, '')}
                style={{ ...btnBase, padding: '6px 12px', fontSize: 11, marginLeft: 8,
                  backgroundColor: '#FFFFFF', color: '#9B3B3B', border: '1px solid #E3C4C4' }}>취소</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProcessSection({ initialUrls }: { initialUrls: string[] }) {
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
    setFiles([null, null, null, null]); setPreviews(['', '', '', '']);
    setEditing(false); setMsg(''); setErr('');
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
        setFiles([null, null, null, null]); setPreviews(['', '', '', '']);
        setEditing(false);
        setTimeout(() => setMsg(''), 4000);
      } catch (ex: unknown) {
        setErr(ex instanceof Error ? ex.message : '저장 실패');
      }
    });
  }

  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: ADMIN.ink, marginBottom: 6 }}>
        홈 프로세스 이미지
      </h2>
      <p style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.muted, marginBottom: 20 }}>
        홈 페이지 「장인의 혼을 담아」 섹션의 2×2 이미지 그리드입니다.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[0, 1, 2, 3].map((i) => (
          <ProcessSlotCard key={i} idx={i}
            currentUrl={initialUrls[i] ?? ''} file={files[i]} preview={previews[i]}
            onFileChange={(f, u) => handleFileChange(i, f, u)} editing={editing} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!editing ? (
          <>
            <button type="button" onClick={() => setEditing(true)}
              style={{ ...btnBase, backgroundColor: ADMIN.ink, color: '#FFFFFF' }}>수정</button>
            {msg && <span style={{ fontFamily: SANS, fontSize: 13, color: '#2A7A4B' }}>{msg}</span>}
          </>
        ) : (
          <>
            {err && <span style={{ fontFamily: SANS, fontSize: 13, color: '#9B3B3B' }}>{err}</span>}
            <button type="button" onClick={handleCancel} disabled={pending}
              style={{ ...btnBase, backgroundColor: '#FFFFFF', color: ADMIN.inkSoft, border: `1px solid ${HAIR}` }}>취소</button>
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

// ── 메인 export ──────────────────────────────────────────────────────────

export default function HeroImagesClient({
  initialSlides,
  initialPageHeroes,
  initialProcessUrls,
  initialContrastUrls,
}: {
  initialSlides: HeroSlide[];
  initialPageHeroes: { masterartisan: string; works: string; worksMobile: string };
  initialProcessUrls: string[];
  initialContrastUrls: { left: string; right: string };
}) {
  return (
    <div>
      <HomeHeroSection initialSlides={initialSlides} />
      <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 40, marginBottom: 48 }}>
        <PageHeroSection initialUrls={initialPageHeroes} />
      </div>
      <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 40 }}>
        <ContrastSection initialUrls={initialContrastUrls} />
      </div>
      <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 40 }}>
        <ProcessSection initialUrls={initialProcessUrls} />
      </div>
    </div>
  );
}
