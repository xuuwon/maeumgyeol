import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useAuthStore } from './authStore';

type LowLevelContent = {
  level: number;
  name: string;
  korean_name: string;
  instruction: string[];
};

type HighLevelContent = {
  level: number;
  name: string;
  korean_name: string;
  instruction: string[];
  sentence1: string;
  sentence2: string;
  sentence3: string;
};

type ContentBundle = {
  level: number;
  level_1_content: LowLevelContent;
  level_2_content: LowLevelContent;
  level_3_content: HighLevelContent;
};

type ContentStore = {
  lowContents: LowLevelContent | null;
  highContents: HighLevelContent | null;
  isSaved: Record<number, boolean>;

  fetchContent: (id: number) => Promise<LowLevelContent | HighLevelContent | null>;
  saveContentBundle: (bundle: ContentBundle, id: number) => Promise<void>;
  setSavedStatus: (id: number, saved: boolean) => void;
};

const api = axios.create({
  baseURL: 'https://sentiment-server.duckdns.org/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const useContentStore = create<ContentStore>()(
  persist(
    (set) => ({
      lowContents: null,
      highContents: null,
      isSaved: {},

      fetchContent: async (id: number) => {
        try {
          const response = await api.get(`/diaries/${id}/mind-contents/level`);
          const data = response.data;

          if (data.level !== 3) {
            set({ lowContents: data, highContents: null });
            return data;
          } else {
            set({ lowContents: null, highContents: data });
            return data;
          }
        } catch (error) {
          console.error('콘텐츠 조회 실패:', error);
          return null;
        }
      },

      saveContentBundle: async (bundle, id) => {
        try {
          const payload = {
            level: bundle.level,
            level_1_content: bundle.level_1_content,
            level_2_content: bundle.level_2_content,
            level_3_content: bundle.level_3_content,
          };

          await api.post(`/diaries/${id}/mind-contents`, payload);

          set((state) => ({
            isSaved: { ...state.isSaved, [id]: true },
          }));

          console.log('콘텐츠 저장 성공');
        } catch (error) {
          console.error('콘텐츠 저장 실패:', error);
        }
      },

      setSavedStatus: (id, saved) => {
        set((state) => ({
          isSaved: { ...state.isSaved, [id]: saved },
        }));
      },
    }),
    {
      name: 'content-storage',
      partialize: (state) => ({ isSaved: state.isSaved }), // 저장할 필드만 선택
    }
  )
);
