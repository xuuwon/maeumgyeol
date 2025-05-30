'use client';

import Button from '@/components/button/Button';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const today = new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dayName = days[today.getDay()];
  const todayDate = `${year}년 ${month}월 ${day}일`;
  const todayDateFormatted = `${year}-${month}-${day}`; // "2025-05-27" 같은 형식

  const router = useRouter();

  return (
    <div
      className={clsx(
        'h-screen bg-[url(/images/background/cherryBlossom_mobile.png)] sm:bg-[url(/images/background/cherryBlossom_tablet.png)] bg-center bg-no-repeat bg-cover px-4 sm:px-6 md:px-8',
        'flex flex-col items-center justify-around py-9'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* 텍스트 */}
        <p className="text-lg">{todayDate}</p>
        <p className="text-lg">{dayName}</p>
        <p className="text-xl">오늘도 즐거운 하루 보내세요!</p>
      </div>

      <div className="drop-shadow-[10px_16px_10px_rgba(0,0,0,0.40)]">
        <Image
          src="/images/characters/basic_character.png" // 예시
          alt="메인 캐릭터"
          width={230}
          height={230}
        />
      </div>

      <div className="flex justify-center w-full">
        <Button
          type="yellow"
          text="일기 작성하기"
          func={() => {
            router.push(`/write/${todayDateFormatted}`);
          }}
        />
      </div>
    </div>
  );
};

export default Page;
