'use client';

import Button from '@/components/button/Button';
import { useRouter } from 'next/navigation';
import React from 'react';

const PageClient = ({ date }: { date: string }) => {
  console.log(date);

  const data = {
    date: '2025-05-26',
    weather: 'sunny',
    title: '별 거 없는 하루',
    content:
      '<p>오늘은 <mark class="custom-highlight" style="background-color: #81C784;">캡스톤 팀원들</mark>과 떡볶이를 먹었다. 아주 맛있고 배불렀다. 😋</p><p>분식집에 앉아 이런저런 이야기를 나누며 오랜만에 웃을 일이 많았다. 프로젝트 이야기도 자연스럽게 풀리면서 팀워크도 더 끈끈해진 느낌이었다.</p><p>그리고 오버워치도 했는데 많이 이기고<span style="color: #F57C00"> 적팀에게 칭찬도 받아서</span> 기분이 아주 좋다.</p><p>예전에 실수할까봐 위축됐던 내 플레이가 <span style="color: #283593"><em>오늘은 꽤 날카롭고 과감했다.</em></span> 나도 모르게 마이크로 "<s>나 좀 잘하는데?</s>"라는 말이 나올 정도였다.</p><p>이런 사소한 하루가 나중에 돌아보면 가장 그리울지도 모른다는 생각이 든다.</p><p><mark class="custom-highlight" style="background-color: #81C784;">매일이 오늘 같으면 좋겠다.</mark></p><p></p>',
    imageUrls: [
      'https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg',
      'https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg',
      'https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg',
      'https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg',
      'https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg',
    ],
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
      <div className="flex flex-col items-center justify-center h-32 gap-2 text-xl iphoneSE:mt-5">
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
