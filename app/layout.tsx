import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR, Playfair_Display, Nanum_Myeongjo } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import GlobalLenis from '@/components/ui/GlobalLenis';
import CustomCursor from '@/components/ui/CustomCursor';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MasterArtisan — 경기무형문화재 제36호 전통건축',
  description:
    '3대째 이어온 전통건축 유지보수·수리·제작 전문. 경기무형문화재 제36호 인간문화재가 운영하는 전통건축 전문 회사입니다.',
  keywords: ['전통건축', '경기무형문화재', '인간문화재', '전통건축수리', '문화재복원'],
  openGraph: {
    title: 'MasterArtisan — 경기무형문화재 제36호 전통건축',
    description: '3대째 이어온 전통건축 전문. 경기무형문화재 제36호.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSerifKR.variable} ${playfair.variable} ${nanumMyeongjo.variable}`}>
      <body style={{ fontFamily: 'var(--font-noto-sans-kr), sans-serif' }}>
        <GlobalLenis />
        <ScrollProgress />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}