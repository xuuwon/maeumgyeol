import { create } from 'zustand';
import { useAuthStore } from './authStore';
import axios from 'axios';

export type EmotionType =
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

interface EmotionState {
  weeklyEmotionTimeline: Record<string, EmotionType | ''>;
  weeklyAdvice: string;
  monthlyEmotionTimeline: Record<string, EmotionType | ''>;
  monthlyAdvice: string;
  fetchWeeklyTimeline: () => Promise<void>;
  fetchMonthlyTimeline: () => Promise<void>;
  setWeeklyTimeline: (data: Record<string, EmotionType | ''>) => void;
  setMonthlyTimeline: (data: Record<string, EmotionType | ''>) => void;
}

const api = axios.create({
  baseURL: 'http://sentiment-server.duckdns.org/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

function getLastWeekRange(): { start: string; end: string } {
  const today = new Date();

  // 로컬 타임존 기준으로 계산
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const dayOfWeek = today.getDay();

  // 이번 주 월요일 계산
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(year, month, date - diffToMonday);

  // 지난주 월요일과 일요일
  const lastMonday = new Date(year, month, thisMonday.getDate() - 7);
  const lastSunday = new Date(year, month, lastMonday.getDate() + 6);

  // YYYY-MM-DD 형식으로 변환 (타임존 이슈 없이)
  const formatSafe = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    start: formatSafe(lastMonday),
    end: formatSafe(lastSunday),
  };
}

function getLastMonthRange(): { start: string; end: string } {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const formatSafe = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    start: formatSafe(start),
    end: formatSafe(end),
  };
}

export const useEmotionReportStore = create<EmotionState>((set) => ({
  weeklyEmotionTimeline: {},
  monthlyEmotionTimeline: {},
  weeklyAdvice: '',
  monthlyAdvice: '',

  setWeeklyTimeline: (data) => set({ weeklyEmotionTimeline: data }),
  setMonthlyTimeline: (data) => set({ monthlyEmotionTimeline: data }),

  fetchWeeklyTimeline: async () => {
    try {
      const { start, end } = getLastWeekRange();
      // console.log(start, end);
      const res = await api.post('/analysis/weekly-report', {
        start_date: start,
        end_date: end,
      });

      set({ weeklyEmotionTimeline: res.data.emotion_timeline, weeklyAdvice: res.data.advice });
    } catch (error) {
      console.error(error);
    }
  },

  fetchMonthlyTimeline: async () => {
    try {
      const { start, end } = getLastMonthRange();
      console.log(start, end);
      const res = await api.post('/analysis/monthly-report', {
        start_date: start,
        end_date: end,
      });

      set({ monthlyEmotionTimeline: res.data.emotion_timeline, monthlyAdvice: res.data.advice });
    } catch (error) {
      console.error(error);
    }
  },
}));
