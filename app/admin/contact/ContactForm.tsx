'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { saveContact } from '@/lib/admin/actions';
import { TextField, TextArea, ADMIN } from '@/components/admin/ui';
import type { ContactInfo } from '@/lib/data/types';

// 카카오 우편번호 SDK 타입
declare global {
  interface Window {
    daum?: {
      Postcode: new (opts: { oncomplete: (data: { address: string; addressEnglish: string }) => void }) => { open(): void };
    };
  }
}

function AddressField({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (document.getElementById('kakao-postcode-sdk')) return;
    const s = document.createElement('script');
    s.id = 'kakao-postcode-sdk';
    s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(s);
  }, []);

  function openSearch() {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete(data) { setValue(data.address); },
    }).open();
  }

  return (
    <div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.08em',
        color: ADMIN.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>주소</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <input name="address" value={value} onChange={(e) => setValue(e.target.value)}
          style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14, color: ADMIN.ink,
            border: `1px solid ${ADMIN.hairline}`, padding: '10px 14px', outline: 'none',
            borderRadius: 0, backgroundColor: '#FFFFFF' }} />
        <button type="button" onClick={openSearch}
          style={{ fontFamily: 'var(--font-sans)', fontSize: 12, padding: '10px 16px',
            backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${ADMIN.hairline}`,
            cursor: 'pointer', borderRadius: 0, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
          주소 검색
        </button>
      </div>
    </div>
  );
}

const SANS = 'var(--font-sans)';

function ViewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: 14, color: ADMIN.ink, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{value}</span>
    </div>
  );
}

export default function ContactForm({ contact }: { contact: ContactInfo }) {
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
        await saveContact(fd);
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
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>기본 연락처</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ViewRow label="전화" value={contact.phone} />
            <ViewRow label="팩스" value={contact.fax} />
            <ViewRow label="이메일" value={contact.email} />
          </div>
        </section>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>운영시간</p>
          <ViewRow label="운영시간" value={contact.hours} />
        </section>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>사무실 · 위치</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ViewRow label="회사명" value={contact.office_name} />
            <ViewRow label="주소" value={contact.address} />
            <ViewRow label="네이버 지도 URL" value={contact.naver_map_url} />
          </div>
        </section>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>인증 · 자격 정보</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ViewRow label="자격 제목" value={contact.cert_title} />
            <ViewRow label="자격 설명" value={contact.cert_desc} />
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
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>기본 연락처</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TextField label="전화" name="phone" defaultValue={contact.phone} />
            <TextField label="팩스" name="fax" defaultValue={contact.fax} />
            <TextField label="이메일" name="email" type="email" defaultValue={contact.email} />
          </div>
        </section>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>운영시간</p>
          <TextArea label="운영시간 (줄바꿈 가능)" name="hours" defaultValue={contact.hours} rows={3} />
        </section>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>사무실 · 위치</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextField label="회사명" name="office_name" defaultValue={contact.office_name} />
            <AddressField defaultValue={contact.address} />
            <TextField label="네이버 지도 URL" name="naver_map_url" defaultValue={contact.naver_map_url} />
          </div>
        </section>
        <section style={{ border: `1px solid ${ADMIN.hairline}`, padding: 28 }}>
          <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 20 }}>인증 · 자격 정보</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextField label="자격 제목" name="cert_title" defaultValue={contact.cert_title} />
            <TextArea label="자격 설명 (줄바꿈 가능)" name="cert_desc" defaultValue={contact.cert_desc} rows={3} />
          </div>
        </section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
      </div>
    </form>
  );
}
