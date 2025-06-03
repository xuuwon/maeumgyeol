import { create } from 'zustand';
import axios from 'axios';

interface calendars {
  [date: string]: string;
  // "2025-04-01": 행복,
  // "2025-04-02": 우울,
}

interface CalendarStore {
  emotions: calendars;
  fetchEmotions: (month: string, token: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  emotions: {},
  fetchEmotions: async (month, token) => {
    try {
      const res = await axios.post(
        'https://your-api-endpoint.com/emotions', // <-- 실제 API URL로 변경
        { month }, // body
        {
          headers: {
            Authorization: `Bearer ${token}`, // header
          },
        }
      );

      set({ emotions: res.data.emotions });
    } catch (error) {
      console.error('캘린더 데이터 받아오기 실패', error);
    }
  },
}));
