import { create } from 'zustand';
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
  level_1_content: {
    level: number;
    name: string;
    korean_name: string;
    instruction: string[];
  };
  level_2_content: {
    level: number;
    name: string;
    korean_name: string;
    instruction: string[];
  };
  level_3_content: {
    level: number;
    name: string;
    korean_name: string;
    instruction: string[];
    sentence1: string;
    sentence2: string;
    sentence3: string;
  };
};

type ContentStore = {
  lowContents: LowLevelContent | null;
  highContents: HighLevelContent | null;
  isSaved: Record<number, boolean>; // id 별 저장 여부 상태

  fetchContent: (id: number) => Promise<void>;
  saveContentBundle: (bundle: ContentBundle, id: number) => Promise<void>;
  setSavedStatus: (id: number, saved: boolean) => void; // 저장 상태 업데이트용
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

export const useContentStore = create<ContentStore>((set) => ({
  lowContents: null,
  highContents: null,
  isSaved: {},

  fetchContent: async (id: number) => {
    try {
      set({ lowContents: null, highContents: null });

      const response = await api.get(`/diaries/${id}/mind-contents/level`);
      console.log(response.data.level);

      if (response.data.level !== 3) {
        set({ lowContents: response.data });
      } else {
        set({ highContents: response.data });
      }

      // 만약 API에서 저장 여부 정보를 받을 수 있으면 여기에 업데이트 가능
      // 예시: setSavedStatus(id, true);
    } catch (error) {
      console.error(`콘텐츠 조회 실패:`, error);
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

      // 저장 성공 시 상태 업데이트
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
}));
