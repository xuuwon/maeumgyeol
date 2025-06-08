'use client';

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';
import MonthAnalysis from './MonthAnalysis';
import clsx from 'clsx';
import { EmotionType, useEmotionReportStore } from '@/stores/emotionReportStore';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a29bfe'];

type EmotionRatioData = {
  name: EmotionType;
  value: number;
};

export default function Page() {
  const { weeklyEmotionTimeline, fetchWeeklyTimeline } = useEmotionReportStore();

  useEffect(() => {
    fetchWeeklyTimeline();
  }, []);

  console.log(weeklyEmotionTimeline);

  const isMobile = useMediaQuery({ maxWidth: 768 }); // 모바일 조건
  const isIphoneSE = useMediaQuery({ maxWidth: 376 });

  // 빈값('') 제외한 감정 배열
  const filteredEmotions = Object.values(weeklyEmotionTimeline).filter((e) => e !== '');

  // 실제 감정 데이터 개수
  const totalDays = filteredEmotions.length;

  // 감정별 개수 초기화
  const emotionCounts: Record<EmotionType, number> = {
    평온: 0,
    행복: 0,
    슬픔: 0,
    불안: 0,
    분노: 0,
    피곤: 0,
    외로움: 0,
    지루함: 0,
    후회: 0,
    희망: 0,
    질투: 0,
    혼란: 0,
    당황: 0,
  };

  filteredEmotions.forEach((emotion) => {
    emotionCounts[emotion]++;
  });

  // 감정 비율 데이터 생성
  const emotionRatioData: EmotionRatioData[] = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({
      name: emotion as EmotionType,
      value: totalDays ? Number(((count / totalDays) * 100).toFixed(1)) : 0,
    }))
    .filter((data) => data.value > 0); // 0% 데이터 제외

  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  const emojiLabel: Record<string, string> = {
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
            {Object.entries(weeklyEmotionTimeline).map(([day, emotion], index) => (
              <div key={day} className="flex justify-between px-4 py-2 border-b last:border-b-0">
                <span className="text-[#ffad20]">{dayNames[index]}</span>
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
              {emotionRatioData.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full text-xl text-gray-500">
                  데이터가 없습니다.
                </div>
              ) : (
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
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
