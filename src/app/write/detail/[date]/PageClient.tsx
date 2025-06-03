'use client';

import Button from '@/components/button/Button';
// import { useDiaryStore } from '@/stores/diaryStore';
import { useRouter } from 'next/navigation';
import React from 'react';

const PageClient = ({ date }: { date: string }) => {
  console.log(date);
  // const { diary } = useDiaryStore();
  // console.log(diary);

  const data = {
    date: '2025-05-26',
    weather: 'sunny',
    title: '혼자여서 더 좋았던 날',
    content:
      '<p><span>오랜만에 혼자 영화관에 갔다. </span></p><p><span>큰 기대 없이 본 영화였는데, 울고 웃고 다 하고 나니 마음이 꽤 편해졌다. 옆 사람 신경 안 써도 되는 자리에서, </span><mark class="custom-highlight" style="background-color: #81C784;">혼자만의 시간에 집중</mark><span>할 수 있었던 게 참 좋았다. 영화 끝나고 근처 카페 가서 멍하니 앉아 있다가 </span><span style="color: #283593">책도 좀 읽었다.</span><span> 누구 눈치도 안 보고, 하고 싶은 거 마음대로 한 하루. 오히려 혼자라서 더 자유롭고 좋았다. </span><span style="color: #F57C00"><em>이런 하루, 자주 만들고 싶다.</em></span></p>',
    imageUrls: [],
    emotion: {
      label: 1,
      name: '행복' as EmotionName,
      message: '오늘은 행복한 하루네요!\n기분 좋은 일이 가득하길 바라요',
      mapping: {
        '0': '중립',
        '1': '행복',
        '2': '슬픔',
        '3': '불안',
        '4': '분노',
      },
    },
  };

  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  const router = useRouter();

  type EmotionName = '중립' | '행복' | '슬픔' | '불안' | '분노';

  const emotionToEmoji: Record<EmotionName, string> = {
    중립: '🙂',
    행복: '😊',
    슬픔: '😭',
    불안: '😰',
    분노: '😠',
  };

  return (
    <div className="flex flex-col gap-10 px-4 mx-auto sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-end gap-2 text-xl h-28 iphoneSE:mt-5">
        <p>{formattedDate}</p>
        <p>오늘의 일기</p>
      </div>

      {/* 일기 데이터 */}
      <div className="flex flex-col gap-3 w-full min-h-[197px] border border-1 border-main-yellow bg-bg-yellow rounded-xl p-4">
        <h2 className="text-xl text-[#ffad20]">{data.title}</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />

        {data.imageUrls.length !== 0 && (
          <div className="flex items-center overflow-x-auto overflow-y-hidden w-full h-[120px] gap-3 px-3 py-2 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
            {data.imageUrls.map((url, idx) => (
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
        )}
      </div>

      {/* 감정 분석 결과 */}
      <div className="flex flex-col items-center gap-5">
        <p className="text-lg">분석 결과</p>
        <div className="flex flex-col items-center justify-around w-full h-32 p-4 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
          <p className="text-lg">
            오늘의 감정: {data.emotion.name} {emotionToEmoji[data.emotion.name]}
          </p>
          <p className="text-center whitespace-pre-line">{data.emotion.message}</p>
        </div>
      </div>

      {/* 마음챙김 콘텐츠 배너 자리 */}
      <div
        className="relative flex flex-col items-center justify-around w-full h-16 p-4 border cursor-pointer border-1 border-main-yellow bg-content-yellow rounded-xl hover:bg-main-yellow"
        onClick={() => {
          router.push('/contents/level1');
        }}
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
