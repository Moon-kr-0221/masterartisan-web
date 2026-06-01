'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { ADMIN, TextField, SubmitButton } from '@/components/admin/ui';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('Supabase가 아직 연결되지 않았습니다. 프로젝트 키를 .env.local에 설정해 주세요.');
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    router.push(params.get('redirect') || '/admin');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: ADMIN.canvas,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.36em',
          color: ADMIN.muted, textTransform: 'uppercase', marginBottom: 14 }}>
          MASTERARTISAN ADMIN
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 300, color: ADMIN.ink, marginBottom: 32 }}>
          관리자 로그인
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField label="이메일" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="rayarchit@naver.com" />
          <TextField label="비밀번호" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

          {error && (
            <p style={{ fontFamily: SANS, fontSize: 12, color: '#B23B3B', lineHeight: 1.6 }}>{error}</p>
          )}

          <div style={{ marginTop: 8 }}>
            <SubmitButton>로그인</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
