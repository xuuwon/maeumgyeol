'use client';

import {
  BarChart,
  Bar,
  XAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  RectangleProps,
  LabelList,
} from 'recharts';
import { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { EmotionType, useEmotionReportStore } from '@/stores/emotionReportStore';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a29bfe'];

function getWeekLabel(dateStr: string): string | null {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based

  if (year !== 2025 || month !== 4) return null; // 5월만 포함 (0=Jan, 4=May)

  const firstMonday = new Date(year, month, 1);
  while (firstMonday.getDay() !== 1) {
    firstMonday.setDate(firstMonday.getDate() + 1);
  }

  const diffDays = Math.floor((date.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return `${weekNumber + 1}주차`;
}

interface WeekHappinessData {
  week: string;
  happinessRate: number;
}

interface EmotionRatioData {
  name: EmotionType;
  value: number;
}

export default function MonthAnalysis({
  isMonth,
  setIsMonth,
}: {
  isMonth: boolean;
  setIsMonth: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { monthlyEmotionTimeline, fetchMonthlyTimeline, monthlyAdvice } = useEmotionReportStore();

  useEffect(() => {
    fetchMonthlyTimeline();
  }, []);

  console.log(monthlyEmotionTimeline);

  const { weekHappinessData, emotionRatioData } = useMemo(() => {
    const weekStats: Record<string, { total: number; happy: number }> = {};
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

    const entries = Object.entries(monthlyEmotionTimeline).filter(([date]) =>
      date.startsWith('2025-05')
    );

    // 빈값 없는 항목만 필터링
    const filteredEntries = entries.filter(([, emotion]) => emotion);

    for (const [dateStr, emotion] of entries) {
      if (!emotion) continue; // 빈값 건너뛰기

      const weekLabel = getWeekLabel(dateStr);
      if (!weekLabel) continue;

      if (!weekStats[weekLabel]) {
        weekStats[weekLabel] = { total: 0, happy: 0 };
      }

      weekStats[weekLabel].total++;
      if (emotion.includes('행복')) {
        weekStats[weekLabel].happy++;
      }
      emotionCounts[emotion]++;
    }

    const weekHappinessData: WeekHappinessData[] = Object.entries(weekStats).map(
      ([week, stat]) => ({
        week,
        happinessRate: stat.total ? Number(((stat.happy / stat.total) * 100).toFixed(1)) : 0,
      })
    );

    // 주차 순서 정렬
    weekHappinessData.sort(
      (a, b) => Number(a.week.replace(/\D/g, '')) - Number(b.week.replace(/\D/g, ''))
    );

    const totalDays = filteredEntries.length; // 빈값 제외한 날짜 수

    // 감정 비율 데이터 생성
    const emotionRatioData: EmotionRatioData[] = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({
        name: emotion as EmotionType,
        value: totalDays ? Number(((count / totalDays) * 100).toFixed(1)) : 0,
      }))
      .filter((data) => data.value > 0); // 0% 데이터 제외

    return { weekHappinessData, emotionRatioData };
  }, []);

  const CustomBar = (props: RectangleProps) => {
    const { x = 0, y = 0, width = 0, height = 0, fill } = props;
    const offsetY = 5; // x축에서 띄울 거리

    return <rect x={x} y={y - offsetY} width={width} height={height} fill={fill} rx={5} ry={5} />;
  };

  return (
    <div className="flex flex-col min-h-screen gap-5 px-4 mx-auto mb-[70px] sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-center h-40 gap-2 pt-6 text-xl iphoneSE:mt-5">
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

      <div className="flex flex-col w-full h-auto gap-4 p-4 border border-main-yellow rounded-xl">
        <h2 className="text-lg font-bold">주간 행복도 분석</h2>
        <ResponsiveContainer width="100%" height={250}>
          {weekHappinessData.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full text-xl text-gray-500">
              데이터가 없습니다.
            </div>
          ) : (
            <BarChart data={weekHappinessData}>
              <XAxis dataKey="week" />
              <Bar dataKey="happinessRate" barSize={30} shape={<CustomBar />} fill="#FFD939">
                <LabelList
                  dataKey="happinessRate"
                  position="top"
                  formatter={(value: number) => `${value}%`}
                  fill="#ffad20"
                />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col w-full h-auto gap-4 p-4 border border-main-yellow rounded-xl">
        <h2 className="mb-4 text-lg font-bold">월 전체 감정 비율</h2>
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
                outerRadius={90}
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

      <div className="flex flex-col items-center w-full h-auto gap-4 p-4 mb-10 border bg-bg-yellow border-main-yellow rounded-xl">
        <p>{monthlyAdvice}</p>
      </div>
    </div>
  );
}
