'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import GlobalLenis from '@/components/ui/GlobalLenis';
import ScrollTopButton from '@/components/ui/ScrollTopButton';

// Public site chrome (nav, footer, smooth scroll). Suppressed under /admin so the
// CMS gets a plain, scroll-jank-free surface.
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  // /history는 자체 Lenis + ScrollTrigger 동기화를 직접 관리하므로 전역 Lenis와 중복 실행되면 충돌함
  const hasOwnLenis = pathname?.startsWith('/history');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {!hasOwnLenis && <GlobalLenis />}
      <ScrollProgress />
      <Navigation />
      <main>{children}</main>
      <Footer />
      <ScrollTopButton />
    </>
  );
}
