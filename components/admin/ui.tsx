'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

const SANS = 'var(--font-sans)';

export const ADMIN = {
  ink: '#1A1A1A',
  inkSoft: '#555555',
  muted: '#999999',
  hairline: '#E4E0D8',
  canvas: '#FAFAF8',
  surface: '#F4F1EB',
} as const;

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.08em',
      color: ADMIN.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
      {children}
    </span>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: SANS,
  fontSize: 14,
  color: ADMIN.ink,
  padding: '10px 12px',
  backgroundColor: '#FFFFFF',
  border: `1px solid ${ADMIN.hairline}`,
  borderRadius: 0,
  outline: 'none',
};

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, ...rest } = props;
  return (
    <label style={{ display: 'block' }}>
      {label && <Label>{label}</Label>}
      <input {...rest} style={{ ...fieldStyle, ...(rest.style || {}) }} />
    </label>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const { label, ...rest } = props;
  return (
    <label style={{ display: 'block' }}>
      {label && <Label>{label}</Label>}
      <textarea {...rest} style={{ ...fieldStyle, minHeight: 90, resize: 'vertical', lineHeight: 1.7, ...(rest.style || {}) }} />
    </label>
  );
}

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] },
) {
  const { label, options, ...rest } = props;
  return (
    <label style={{ display: 'block' }}>
      {label && <Label>{label}</Label>}
      <select {...rest} style={{ ...fieldStyle, ...(rest.style || {}) }}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export function SubmitButton({ children, variant = 'primary' }: {
  children: React.ReactNode; variant?: 'primary' | 'ghost' | 'danger';
}) {
  const { pending } = useFormStatus();
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: ADMIN.ink, color: '#FFFFFF', border: `1px solid ${ADMIN.ink}` },
    ghost: { backgroundColor: '#FFFFFF', color: ADMIN.ink, border: `1px solid ${ADMIN.hairline}` },
    danger: { backgroundColor: '#FFFFFF', color: '#B23B3B', border: '1px solid #E3C4C4' },
  };
  return (
    <button type="submit" disabled={pending}
      style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.08em',
        padding: '10px 22px', borderRadius: 0, cursor: pending ? 'wait' : 'pointer',
        opacity: pending ? 0.6 : 1, transition: 'opacity 0.2s', ...styles[variant] }}>
      {pending ? '처리 중…' : children}
    </button>
  );
}

// File picker with live preview; keeps current image as a hidden fallback.
export function ImageInput({ name = 'image', current, label = '사진', hint }: {
  name?: string; current?: string; label?: string; hint?: string;
}) {
  const [preview, setPreview] = useState<string | null>(current || null);
  const [fileName, setFileName] = useState<string>('선택된 파일 없음');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Label>{label}</Label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 200, height: 140, flexShrink: 0, overflow: 'hidden',
          backgroundColor: ADMIN.surface, border: `1px solid ${ADMIN.hairline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {preview ? (
            <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted }}>없음</span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setPreview(URL.createObjectURL(f)); setFileName(f.name); }
            }}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.ink, cursor: 'pointer',
                border: `1px solid ${ADMIN.hairline}`, backgroundColor: '#FFFFFF',
                padding: '6px 12px', borderRadius: 0 }}>
              파일 선택
            </button>
            <span style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.muted }}>
              {fileName}
            </span>
          </div>
          {hint && (
            <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, lineHeight: 1.6 }}>
              {hint}
            </span>
          )}
          <span style={{ fontFamily: SANS, fontSize: 11, color: ADMIN.muted, lineHeight: 1.6 }}>
            새 사진을 고르지 않으면 기존 사진이 그대로 유지됩니다.
          </span>
        </div>
      </div>
    </div>
  );
}
