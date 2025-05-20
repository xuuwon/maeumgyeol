'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import NavBar from '@/components/navBar/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavBarList = ['/home', '/calendar', '/statistic', '/profile'];
  const showNavBar = showNavBarList.includes(pathname);

  return (
    <html lang="ko">
      <body className="bg-gray-100">
        <div className="w-full max-w-[768px] mx-auto h-screen bg-main-background">
          <div className="relative h-full">
            {children}
            {showNavBar && <NavBar />}
          </div>
        </div>
      </body>
    </html>
  );
}
