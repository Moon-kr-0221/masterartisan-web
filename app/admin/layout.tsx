import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'KCHI 고려문화재기술원-경기무형문화재 36호 관리자',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let email = '';
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email ?? '';
  }

  // No session (login page, or env not yet set) → render the page bare.
  if (!email) {
    return <div style={{ backgroundColor: '#FAFAF8', minHeight: '100vh' }}>{children}</div>;
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#FAFAF8', minHeight: '100vh' }}>
      <AdminNav email={email} />
      <div style={{ flex: 1, minWidth: 0, padding: '40px 48px 80px', maxWidth: 1000 }}>
        {children}
      </div>
    </div>
  );
}
