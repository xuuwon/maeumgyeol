import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

type DiaryEmotion = {
  id: number;
  weather: string;
  title: string;
  date: string;
  analyzed_emotion: {
    name: string;
    korean_name: string;
    emoji: string;
    message: string;
  };
};

type calendars = {
  [date: string]: DiaryEmotion;
};

type CalendarStore = {
  emotions: calendars;
  fetchEmotions: (month: string) => Promise<void>;
};

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

export const useCalendarStore = create<CalendarStore>((set) => ({
  emotions: {},
  fetchEmotions: async (month) => {
    try {
      const res = await api.get(`/diaries/?year_and_month=${month}`);

      const data = res.data.emotions ?? res.data;

      set({ emotions: data });
      console.log('fetchEmotions data:', data);
    } catch (error) {
      console.error('캘린더 데이터 받아오기 실패', error);
    }
  },
}));
