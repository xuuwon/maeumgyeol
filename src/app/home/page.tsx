'use client';

import Button from '@/components/button/Button';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCalendarStore } from '@/stores/calendarStore';
import { useContentStore } from '@/stores/contentStore';

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
  const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}`;

  const router = useRouter();

  // background 이미지 결정 로직
  let bgUrl: string | undefined;

  if (equippedBackground) {
    if (equippedBackground.includes('cherryBlossom')) {
      bgUrl = '/images/background/cherryBlossom_tablet.jpg';
    } else if (equippedBackground.includes('beach')) {
      bgUrl = '/images/background/beach_tablet.jpg';
    } else if (equippedBackground.includes('city')) {
      bgUrl = '/images/background/city_tablet.jpg';
    } else if (equippedBackground.includes('forest')) {
      bgUrl = '/images/background/forest_tablet.jpg';
    } else {
      bgUrl = equippedBackground;
    }
  }

  // 일기 존재하는지 확인용
  const { fetchEmotions } = useCalendarStore();
  const { fetchContent } = useContentStore();

  const [hasContent, setHasContent] = useState(false);
  const [contentLevel, setContentLevel] = useState<number | null>(null);
  const [diaryId, setDiaryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTodayContent = async () => {
      try {
        setIsLoading(true);

        // 1. 이 달의 감정 데이터를 가져옴
        await fetchEmotions(formattedMonth);

        // const hasDiary = !!useCalendarStore.getState().emotions[todayDateFormatted];
        const emotionMap = useCalendarStore.getState().emotions;
        console.log(emotionMap);
        const todayEmotion = emotionMap[todayDateFormatted];

        if (todayEmotion && todayEmotion.id) {
          const currentDiaryId = todayEmotion.id;
          setDiaryId(currentDiaryId);

          // 2. 콘텐츠 가져오기 시도
          const content = await fetchContent(currentDiaryId);

          if (content) {
            setHasContent(true);
            setContentLevel(content.level);
          }
        } else {
          console.log('오늘 감정 데이터 또는 diary_id가 없습니다.');
        }
      } catch (error) {
        console.error('오늘 콘텐츠 확인 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTodayContent();
  }, []);

  // 말풍선 클릭 핸들러
  const handleBubbleClick = async () => {
    if (hasContent && diaryId) {
      // 이미 작성된 콘텐츠 보기
      if (contentLevel === 3) {
        router.push(`/contents/level3?id=${diaryId}`);
      } else if (contentLevel === 1) {
        router.push(`/contents/level1?id=${diaryId}`);
      } else if (contentLevel === 2) {
        router.push(`/contents/level2?id=${diaryId}`);
      }
    } else {
      // 새로운 콘텐츠 작성
      router.push('/contents/level3');
    }
  };

  // 말풍선 텍스트 결정
  const getBubbleText = () => {
    if (isLoading) return '확인 중...';
    if (hasContent) {
      return '오늘의 마음 챙김 콘텐츠를 확인해 봐! 🐾';
    }
    return '오늘의 일기를 작성해 봐! 🐾';
  };

  return (
    <div
      className={clsx(
        'h-screen px-4 sm:px-6 md:px-8 flex flex-col items-center justify-around py-9'
      )}
    >
      {/* 배경 오버레이 */}
      {bgUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            opacity: 0.5, // 투명도 설정
          }}
        />
      )}
      <div className="z-10 flex flex-col items-center gap-4">
        {/* 텍스트 */}
        <p className="text-lg">{todayDate}</p>
        <p className="text-lg">{dayName}</p>
        <p className="text-xl">오늘도 즐거운 하루 보내세요!</p>
      </div>

      <div className="z-10 flex flex-col items-center gap-3">
        <div
          className={clsx(
            'relative max-w-xs px-5 py-3 text-white cursor-pointer rounded-2xl bg-main-yellow'
          )}
          onClick={handleBubbleClick}
        >
          <p>{getBubbleText()}</p>
          {/* 꼬리 */}
          <div
            className={clsx('absolute w-4 h-4 rotate-45 -bottom-2 left-16 bg-main-yellow')}
          ></div>
        </div>
        <Image
          src={equippedAccessory ? equippedAccessory : '/images/characters/basic_character.png'} // 예시
          alt="메인 캐릭터"
          width={230}
          height={230}
          className="drop-shadow-[10px_16px_10px_rgba(0,0,0,0.40)]"
        />
      </div>

      <div className="z-10 flex justify-center w-full mb-5">
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
