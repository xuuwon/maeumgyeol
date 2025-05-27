'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import NavBar from '@/components/navBar/NavBar';
import Header from '@/components/header/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavBarList = ['/home', '/calendar', '/statistic', '/profile'];
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/images/icon.png" />
        <link rel="apple-touch-icon" href="/images/icon.png" />
      </head>
      <body className="bg-gray-100">
        <div className="w-full max-w-[768px] mx-auto min-h-screen bg-main-background">
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
