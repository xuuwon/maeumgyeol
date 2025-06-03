import { create } from 'zustand';

type EmotionType = '중립' | '행복' | '슬픔' | '불안' | '분노' | '';

interface EmotionState {
  weeklyEmotionTimeline: Record<string, EmotionType | ''>;
  monthlyEmotionTimeline: Record<string, EmotionType | ''>;
  fetchWeeklyTimeline: () => Promise<void>;
  fetchMonthlyTimeline: () => Promise<void>;
  setWeeklyTimeline: (data: Record<string, EmotionType | ''>) => void;
  setMonthlyTimeline: (data: Record<string, EmotionType | ''>) => void;
}

export const useEmotionReportStore = create<EmotionState>((set) => ({
  weeklyEmotionTimeline: {},
  monthlyEmotionTimeline: {},

  setWeeklyTimeline: (data) => set({ weeklyEmotionTimeline: data }),
  setMonthlyTimeline: (data) => set({ monthlyEmotionTimeline: data }),

  fetchWeeklyTimeline: async () => {
    try {
      const res = await fetch('https://your-api.com/emotions/weekly'); // 주소 변경

      if (!res.ok) throw new Error('주간 데이터 받아오기 실패');

      const data: Record<string, EmotionType | ''> = await res.json();

      set({ weeklyEmotionTimeline: data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchMonthlyTimeline: async () => {
    try {
      const res = await fetch('https://your-api.com/emotions/monthly');

      if (!res.ok) throw new Error('월간 데이터 받아오기 실패');

      const data: Record<string, EmotionType | ''> = await res.json();

      set({ monthlyEmotionTimeline: data });
    } catch (error) {
      console.error(error);
    }
  },
}));
