import { create } from 'zustand';

interface DiaryState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  writeDiary: (
    data: {
      date: string;
      weather: string;
      title: string;
      content: string;
      images: File[];
    },
    token: string
  ) => Promise<void>;
  diary: diaryDetail | null;
}

interface diaryDetail {
  date: string;
  weather: string;
  title: string;
  content: string;
  images: File[];
  emotion: string; // 변경 가능
  comment: string;
}

export const useDiaryStore = create<DiaryState>((set) => ({
  isLoading: false,
  error: null,
  success: false,
  diary: null,

  writeDiary: async (data, token) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append('date', data.date);
      formData.append('weather', data.weather);
      formData.append('title', data.title);
      formData.append('content', data.content);

      data.images.forEach((file) => {
        formData.append('images', file);
      });

      // 1. 일기 저장 API 호출
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type 헤더는 FormData를 보낼 때 자동 설정됨
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '작성 실패');
      }

      // 2. 응답에서 id 추출
      const resData = await res.json();
      const diaryId = resData.id; // 속성값 바뀔 수 있음
      if (!diaryId) throw new Error('일기 ID를 받지 못했습니다.');

      // 3. 분석 API 호출
      const analysisRes = await fetch(`/api/diary/${diaryId}/analysis`, {
        // 주소 수정
        // body에 담아서 보내는지? 아니면 쿼리스트링에 담아 보내는지
        method: 'POST', // 메소드 수정
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          /* 분석 API가 필요한 데이터 있으면 여기에 */
        }),
      });

      if (!analysisRes.ok) {
        const errorData = await analysisRes.json();
        throw new Error(errorData.message || '분석 실패');
      }

      // 분석 결과를 사용하고 싶으면 여기서 받기
      const analysisData = await analysisRes.json();
      console.log('분석 결과:', analysisData);

      set({ isLoading: false, success: true, diary: analysisData });
    } catch (err: unknown) {
      let message = '알 수 없는 에러';

      if (err instanceof Error) {
        message = err.message;
      }

      set({ isLoading: false, error: message, success: false });
    }
  },
}));
