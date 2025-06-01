'use client';

import clsx from 'clsx';
import { CalendarDays, ChartColumn, House, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const router = useRouter();

  const iconStyle = 'hover:text-[#ffad20] cursor-pointer';

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 flex items-start justify-between w-full h-[70px] pt-5 px-8 sm:px-10 md:px-12 bg-main-background'
      )}
      style={{
        maxWidth: '768px',
        margin: '0 auto',
        width: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <House className={iconStyle} onClick={() => router.push('/home')} />
      <CalendarDays className={iconStyle} onClick={() => router.push('/calendar')} />
      <ChartColumn className={iconStyle} onClick={() => router.push('/statistic')} />
      <User className={iconStyle} onClick={() => router.push('/profile')} />
    </div>
  );
};

export default NavBar;
