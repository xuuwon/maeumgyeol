import { create } from 'zustand';
import { useAuthStore } from './authStore';
import axios from 'axios';

type DiaryState = {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  writeDiary: (data: {
    diary_date: string;
    weather: string;
    title: string;
    content: string;
    images_url: File[];
  }) => Promise<void>;
  fetchDiary: (id: string) => Promise<void>;
  diary: DiaryDetail | null;
};

type DiaryDetail = {
  id: number;
  date: string; // 예: "2025-06-08"
  title: string; // 예: "오늘은"
  weather: '맑음' | '비' | '눈' | '흐림'; // 예: "맑음"
  content: string; // HTML 포함 문자열

  image_urls: string[]; // 이미지 URL 배열

  analyzed_emotion: {
    name: string; // 예: "HAPPY"
    korean_name:
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
      | '당황'; // 예: "행복"
    emoji: string; // 예: "😊"
    message: string; // 예: "오늘은 행복한 하루네요! 기분 좋은 일이 가득하길 바라요."
  };
};

const api = axios.create({
  baseURL: 'http://sentiment-server.duckdns.org/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token;
  console.log(token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const useDiaryStore = create<DiaryState>((set) => ({
  isLoading: false,
  error: null,
  success: false,
  diary: null,

  writeDiary: async (data) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append('diary_date', data.diary_date);
      formData.append('weather', data.weather);
      formData.append('title', data.title);
      formData.append('content', data.content);

      if (data.images_url.length !== 0) {
        data.images_url.forEach((file) => {
          formData.append('images_files', file);
        });
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // 1. 일기 저장
      const res = await api.post('/diaries/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 이건 사실 안 넣어도 axios가 자동 세팅함
        },
      });
      const diaryId = res.data.id;
      if (!diaryId) throw new Error('일기 ID를 받지 못했습니다.');

      // 2. 분석 요청
      await api.post(`/analysis/diary-mood/${diaryId}`);

      // 3. 상세 정보 조회
      const detailRes = await api.get(`/diaries/${diaryId}`);
      const detailData = detailRes.data;

      console.log('분석 결과:', detailData);
      set({ isLoading: false, success: true, diary: detailData });
      await useAuthStore.getState().fetchUser();
    } catch (err: unknown) {
      let message = '알 수 없는 에러';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      set({ isLoading: false, error: message, success: false });
    }
  },

  fetchDiary: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/diaries/${id}`);
      set({ diary: res.data, isLoading: false });
    } catch (err: unknown) {
      let message = '알 수 없는 에러';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      set({ isLoading: false, error: message, success: false });
    }
  },
}));
