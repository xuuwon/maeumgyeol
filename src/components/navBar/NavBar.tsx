'use client';

import { CalendarDays, ChartColumn, House, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const router = useRouter();

  const iconStyle = 'hover:text-[#ffad20] cursor-pointer';

  return (
    <div className="absolute bottom-0 left-0 flex items-center justify-between w-full h-16 px-4 sm:px-6 md:px-8">
      <House className={iconStyle} onClick={() => router.push('/home')} />
      <CalendarDays className={iconStyle} onClick={() => router.push('/calendar')} />
      <ChartColumn className={iconStyle} onClick={() => router.push('/statistic')} />
      <User className={iconStyle} onClick={() => router.push('/profile')} />
    </div>
  );
};

export default NavBar;
