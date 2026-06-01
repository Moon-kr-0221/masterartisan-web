'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import GlobalLenis from '@/components/ui/GlobalLenis';

// Public site chrome (nav, footer, smooth scroll). Suppressed under /admin so the
// CMS gets a plain, scroll-jank-free surface.
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <GlobalLenis />
      <ScrollProgress />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
