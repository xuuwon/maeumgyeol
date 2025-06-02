'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import NavBar from '@/components/navBar/NavBar';
import Header from '@/components/header/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavBarList = ['/home', '/calendar', '/statistic', '/profile', '/shopping', '/store'];
  const showNavBar = showNavBarList.includes(pathname);

  // ✅ 서비스워커 등록
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((reg) => console.log('✅ Service Worker registered:', reg))
          .catch((err) => console.error('❌ Service Worker registration failed:', err));
      });
    }
  }, []);

  return (
    <html lang="ko">
      <head>
        {/* ✅ PWA 관련 태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="마음결" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="apple-touch-icon" href="/images/icon-180.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-100">
        <div className="w-full max-w-[700px] mx-auto min-h-screen bg-main-background">
          <div className="relative h-full">
            {showNavBar && <Header />}
            {children}
            {showNavBar && <NavBar />}
          </div>
        </div>
      </body>
    </html>
  );
}
