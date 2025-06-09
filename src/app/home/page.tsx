'use client';

import Button from '@/components/button/Button';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useMediaQuery } from 'react-responsive';

const Page = () => {
  const user = useAuthStore((state) => state.user);
  const equippedAccessory = user?.equipped_accessory_image_url;
  const equippedBackground = user?.equipped_background_image_url;

  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth(); // 0부터 시작하니까
  const day = now.getDate();

  const today = new Date(year, month, day); // 한국 시간 기준 오늘 자정

  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = days[today.getDay()];

  const todayDate = `${year}년 ${month + 1}월 ${day}일`;
  const todayDateFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const router = useRouter();

  const isMobile = useMediaQuery({ maxWidth: 500 });
  const isTablet = useMediaQuery({ minWidth: 501 });

  // background 이미지 결정 로직
  let bgUrl: string | undefined;

  if (equippedBackground) {
    if (equippedBackground.includes('cherryBlossom')) {
      if (isTablet) {
        bgUrl = '/images/background/cherryBlossom_tablet.png';
      } else if (isMobile) {
        bgUrl = '/images/background/cherryBlossom_mobile.png';
      } else {
        bgUrl = equippedBackground;
      }
    } else if (equippedBackground.includes('beach')) {
      if (isTablet) {
        bgUrl = '/images/background/beach_tablet.png';
      } else if (isMobile) {
        bgUrl = '/images/background/beach_mobile.png';
      } else {
        bgUrl = equippedBackground;
      }
    } else {
      bgUrl = equippedBackground;
    }
  }

  return (
    <div
      className={clsx(
        'h-screen px-4 sm:px-6 md:px-8 flex flex-col items-center justify-around py-9'
      )}
      style={
        bgUrl
          ? {
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top center',
            }
          : undefined
      }
    >
      <div className="flex flex-col items-center gap-4">
        {/* 텍스트 */}
        <p className="text-lg">{todayDate}</p>
        <p className="text-lg">{dayName}</p>
        <p className="text-xl">오늘도 즐거운 하루 보내세요!</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div
          className="relative max-w-xs px-5 py-3 text-white cursor-pointer bg-main-yellow rounded-2xl"
          onClick={() => {
            router.push('/contents/level3');
          }}
        >
          오늘의 마음 챙김 콘텐츠를 확인해 봐!🐾
          {/* 꼬리 */}
          <div className="absolute w-4 h-4 rotate-45 bg-main-yellow -bottom-2 left-16"></div>
        </div>
        <Image
          src={equippedAccessory ? equippedAccessory : '/images/characters/basic_character.png'} // 예시
          alt="메인 캐릭터"
          width={230}
          height={230}
          className="drop-shadow-[10px_16px_10px_rgba(0,0,0,0.40)]"
        />
      </div>

      <div className="flex justify-center w-full mb-5">
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
