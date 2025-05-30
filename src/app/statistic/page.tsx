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
import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a29bfe'];

type EmotionType = '행복 😊' | '슬픔 😢' | '불안 😟' | '중립 😶' | '분노 😠';

const emotionTimeline: Record<string, EmotionType> = {
  '2025-05-01': '행복 😊',
  '2025-05-02': '행복 😊',
  '2025-05-03': '중립 😶',
  '2025-05-04': '불안 😟',
  '2025-05-05': '행복 😊',
  '2025-05-06': '중립 😶',
  '2025-05-07': '슬픔 😢',
  '2025-05-08': '중립 😶',
  '2025-05-09': '불안 😟',
  '2025-05-10': '분노 😠',
  '2025-05-11': '중립 😶',
  '2025-05-12': '행복 😊',
  '2025-05-13': '중립 😶',
  '2025-05-14': '중립 😶',
  '2025-05-15': '불안 😟',
  '2025-05-16': '슬픔 😢',
  '2025-05-17': '중립 😶',
  '2025-05-18': '행복 😊',
  '2025-05-19': '중립 😶',
  '2025-05-20': '불안 😟',
  '2025-05-21': '행복 😊',
  '2025-05-22': '중립 😶',
  '2025-05-23': '중립 😶',
  '2025-05-24': '분노 😠',
  '2025-05-25': '불안 😟',
  '2025-05-26': '슬픔 😢',
  '2025-05-27': '중립 😶',
  '2025-05-28': '중립 😶',
  '2025-05-29': '행복 😊',
  '2025-05-30': '불안 😟',
  '2025-05-31': '중립 😶',
};

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

export default function Page() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // 모바일 조건
  const isIphoneSE = useMediaQuery({ maxWidth: 376 });

  const { weekHappinessData, emotionRatioData } = useMemo(() => {
    const weekStats: Record<string, { total: number; happy: number }> = {};
    const emotionCounts: Record<EmotionType, number> = {
      '행복 😊': 0,
      '슬픔 😢': 0,
      '불안 😟': 0,
      '중립 😶': 0,
      '분노 😠': 0,
    };

    const entries = Object.entries(emotionTimeline).filter(([date]) => date.startsWith('2025-05'));

    for (const [dateStr, emotion] of entries) {
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

    const totalDays = entries.length;
    const emotionRatioData: EmotionRatioData[] = Object.entries(emotionCounts).map(
      ([emotion, count]) => ({
        name: emotion as EmotionType,
        value: Number(((count / totalDays) * 100).toFixed(1)),
      })
    );

    return { weekHappinessData, emotionRatioData };
  }, []);

  const CustomBar = (props: RectangleProps) => {
    const { x = 0, y = 0, width = 0, height = 0, fill } = props;
    const offsetY = 5; // x축에서 띄울 거리

    return <rect x={x} y={y - offsetY} width={width} height={height} fill={fill} rx={5} ry={5} />;
  };

  return (
    <div className="flex flex-col min-h-screen gap-5 px-4 mx-auto mb-[70px] sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-center gap-2 text-xl h-44 iphoneSE:mt-5">
        <p>감정 분석 보고서</p>
      </div>

      <div className="flex flex-col w-full h-auto gap-4 p-4 border border-main-yellow rounded-xl">
        <h2 className="text-lg font-bold">주간 행복도 분석</h2>
        <ResponsiveContainer width="100%" height={250}>
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
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col w-full h-auto gap-4 p-4 mb-10 border border-main-yellow rounded-xl">
        <h2 className="mb-4 text-lg font-bold">월 전체 감정 비율</h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={emotionRatioData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isIphoneSE ? 35 : isMobile ? 50 : 90}
              label={({ name, value }: { name: EmotionType; value: number }) => `${name} ${value}%`}
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
  );
}
