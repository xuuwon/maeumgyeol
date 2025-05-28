'use client';

import { CalendarDays, ChartColumn, House, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const router = useRouter();

  const iconStyle = 'hover:text-[#ffad20] cursor-pointer';

  return (
    <div className="fixed bottom-0 left-0 flex items-center justify-between w-full h-[70px] px-8 sm:px-10 md:px-12">
      <House className={iconStyle} onClick={() => router.push('/home')} />
      <CalendarDays className={iconStyle} onClick={() => router.push('/calendar')} />
      <ChartColumn className={iconStyle} onClick={() => router.push('/statistic')} />
      <User className={iconStyle} onClick={() => router.push('/profile')} />
    </div>
  );
};

export default NavBar;
