'use client';

import Button from '@/components/button/Button';
import { useContentStore } from '@/stores/contentStore';
import { useDiaryStore } from '@/stores/diaryStore';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const PageClient = ({ date }: { date: string }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { diary, fetchDiary } = useDiaryStore();

  useEffect(() => {
    if (id) {
      fetchDiary(id);
    }
  }, [id, fetchDiary]);

  const data = diary;

  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  const router = useRouter();

  type EmotionName =
    | '평온'
    | '행복'
    | '슬픔'
    | '불안'
    | '분노'
    | '피곤'
    | '외로움'
    | '지루함'
    | '후회'
    | '희망'
    | '질투'
    | '혼란'
    | '당황';
  type WeatherName = '맑음' | '흐림' | '비' | '눈';

  const emotionToEmoji: Record<EmotionName, string> = {
    평온: '😐',
    행복: '😊',
    슬픔: '🥲',
    불안: '😳',
    분노: '😠',
    피곤: '😩',
    외로움: '😔',
    지루함: '😑',
    후회: '😞',
    희망: '🤩',
    질투: '😒',
    혼란: '🤯',
    당황: '😳',
  };

  const weatherToEmoji: Record<WeatherName, string> = {
    맑음: '☀️',
    흐림: '☁️',
    비: '🌧️',
    눈: '❄️',
  };

  const { fetchContent } = useContentStore();

  const handleFetchContent = async () => {
    if (!id) return;

    try {
      const content = await fetchContent(Number(id));
      if (!content) {
        console.warn('콘텐츠 없음');
        return;
      }

      const level = content.level;

      if (level === 3) {
        router.push(`/contents/level3?id=${id}`);
      } else {
        if (level === 1) {
          router.push(`/contents/level1?id=${id}`);
        } else if (level === 2) {
          router.push(`/contents/level2?id=${id}`);
        } else {
          console.warn('알 수 없는 레벨');
        }
      }
    } catch (error) {
      console.error('콘텐츠 호출 중 오류:', error);
    }
  };

  return (
    <div className="flex flex-col gap-10 px-4 mx-auto sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-end gap-2 text-xl h-28 iphoneSE:mt-5">
        <p>{formattedDate}</p>
        <p>오늘의 일기</p>
      </div>

      {/* 일기 데이터 */}
      <div className="flex flex-col gap-3 w-full min-h-[197px] border border-1 border-main-yellow bg-bg-yellow rounded-xl p-4">
        <h2 className="text-xl text-[#ffad20]">
          {weatherToEmoji[data?.weather ?? '맑음']} {data?.title}{' '}
          {weatherToEmoji[data?.weather ?? '맑음']}
        </h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: diary?.content ?? '' }}
        />

        {data?.image_urls?.length && data?.image_urls?.length > 0 ? (
          <div className="flex items-center overflow-x-auto overflow-y-hidden w-full h-[120px] gap-3 px-3 py-2 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
            {data.image_urls.map((url, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 h-24 overflow-hidden w-28 rounded-xl"
              >
                <img
                  src={url}
                  alt={`일기 이미지 ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* 감정 분석 결과 */}
      <div className="flex flex-col items-center gap-5">
        <p className="text-lg">분석 결과</p>
        <div className="flex flex-col items-center justify-around w-full h-32 p-4 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
          <p className="text-lg">
            오늘의 감정: {data?.analyzed_emotion.korean_name}{' '}
            {emotionToEmoji[data?.analyzed_emotion.korean_name ?? '행복']}
          </p>
          <p className="text-center whitespace-pre-line">{data?.analyzed_emotion.message}</p>
        </div>
      </div>

      {/* 마음챙김 콘텐츠 배너 자리 */}
      <div
        className="relative flex flex-col items-center justify-around w-full h-16 p-4 border cursor-pointer border-1 border-main-yellow bg-content-yellow rounded-xl hover:bg-main-yellow"
        onClick={handleFetchContent}
      >
        <div className="absolute p-1 px-2 text-sm -top-2 -left-3 bg-[#ffad20] rounded-xl text-white">
          Click!
        </div>
        <p>✉️ 오늘의 마음 챙김 콘텐츠가 도착했습니다.</p>
      </div>

      {/* 홈으로 버튼 */}
      <div className="flex justify-center mt-auto mb-8">
        <Button
          type="yellow"
          text="홈으로"
          func={() => {
            router.push('/home');
          }}
        />
      </div>
    </div>
  );
};

export default PageClient;
