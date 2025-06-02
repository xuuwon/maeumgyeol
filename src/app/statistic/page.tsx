'use client';

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import MonthAnalysis from './MonthAnalysis';
import clsx from 'clsx';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a29bfe'];

type EmotionType = '행복' | '슬픔' | '불안' | '중립' | '분노';

const emotionTimeline: Record<string, EmotionType | ''> = {
  monday: '행복',
  tuesday: '중립',
  wednesday: '슬픔',
  thursday: '분노',
  friday: '불안',
  saturday: '행복',
  sunday: '', // 빈값 포함 예시
};

interface EmotionRatioData {
  name: EmotionType;
  value: number;
}

export default function Page() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // 모바일 조건
  const isIphoneSE = useMediaQuery({ maxWidth: 376 });

  // 빈값('') 제외한 감정 배열
  const filteredEmotions = Object.values(emotionTimeline).filter((e) => e !== '');

  // 실제 감정 데이터 개수
  const totalDays = filteredEmotions.length;

  // 감정별 개수 초기화
  const emotionCounts: Record<EmotionType, number> = {
    행복: 0,
    슬픔: 0,
    불안: 0,
    중립: 0,
    분노: 0,
  };

  filteredEmotions.forEach((emotion) => {
    emotionCounts[emotion]++;
  });

  // 감정 비율 데이터 생성
  const emotionRatioData: EmotionRatioData[] = Object.entries(emotionCounts).map(
    ([emotion, count]) => ({
      name: emotion as EmotionType,
      value: totalDays ? Number(((count / totalDays) * 100).toFixed(1)) : 0,
    })
  );

  // 요일 이름 한글로 변환
  const dayNames: Record<string, string> = {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일',
  };

  const emojiLabel: Record<string, string> = {
    행복: '😊',
    슬픔: '😭',
    불안: '😰',
    중립: '🙂',
    분노: '😠',
  };

  const [isMonth, setIsMonth] = useState<boolean>(false);

  return (
    <>
      {isMonth ? (
        <MonthAnalysis isMonth={isMonth} setIsMonth={setIsMonth} />
      ) : (
        <div className="flex flex-col min-h-screen gap-5 px-4 mx-auto mb-[70px] sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-center h-40 gap-2 pt-6 text-xl">
            <p>감정 분석 리포트</p>
          </div>

          <div className="flex w-full gap-4">
            <span
              className={clsx(
                'flex-1 py-2 text-center border cursor-pointer rounded-xl border-main-yellow',
                !isMonth && 'bg-content-yellow'
              )}
              onClick={() => setIsMonth(false)}
            >
              주간
            </span>
            <span
              className={clsx(
                'flex-1 py-2 text-center border cursor-pointer rounded-xl border-main-yellow',
                isMonth && 'bg-content-yellow'
              )}
              onClick={() => setIsMonth(true)}
            >
              월간
            </span>
          </div>

          {/* 요일별 감정 리스트 */}
          <div className="flex flex-col w-full gap-2 p-4 border border-main-yellow rounded-xl">
            {Object.entries(emotionTimeline).map(([day, emotion]) => (
              <div key={day} className="flex justify-between px-4 py-2 border-b last:border-b-0">
                <span className="text-[#ffad20]">{dayNames[day]}</span>
                <span className="font-semibold">
                  {emotion ? `${emotion} ${emojiLabel[emotion]}` : '감정 없음 🫥'}
                </span>
              </div>
            ))}
          </div>

          {/* 주 전체 감정 비율 (원형 그래프) */}
          <div className="flex flex-col w-full h-auto gap-4 p-4 mb-10 border border-main-yellow rounded-xl">
            <h2 className="mb-4 text-lg font-bold">주 전체 감정 비율</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={emotionRatioData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={isIphoneSE ? 35 : isMobile ? 50 : 90}
                  label={({ name, value }: { name: EmotionType; value: number }) =>
                    `${name} ${value}%`
                  }
                >
                  {emotionRatioData.map((entry, index) => (
                    <Cell key={entry.name as string} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
