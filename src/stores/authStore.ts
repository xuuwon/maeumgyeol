import { create } from 'zustand';
import axios from 'axios';

interface SignUpPayload {
  id: string;
  password: string;
  nickname: string;
}

interface SignInPayload {
  id: string;
  password: string;
}

interface User {
  userId: string;
  nickname: string;
  gender: 'male' | 'female';
  birthday: string;
  character: string;
  coin: number;
  isFirstLogin: boolean;
}

interface AuthState {
  isLoading: boolean;

  signUpError: string | null;
  signUpSuccess: boolean;

  signInError: string | null;
  signInSuccess: boolean;

  user: User | null;
  userError: string | null;

  accessToken: string | null;
  refreshToken: string | null;

  signUp: (data: SignUpPayload) => Promise<void>;
  signIn: (data: SignInPayload) => Promise<void>;
  fetchUser: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: false,

  signUpError: null,
  signUpSuccess: false,

  signInError: null,
  signInSuccess: false,

  user: null,
  userError: null,

  accessToken: null,
  refreshToken: null,

  signUp: async (data) => {
    set({ isLoading: true, signUpError: null, signUpSuccess: false });
    try {
      const res = await axios.post('/api/signup', data); // 주소 수정

      console.log('회원가입 성공', res);

      set({ signUpSuccess: true });
    } catch (err: unknown) {
      let errorMessage = '회원가입 실패';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      }

      set({ signUpError: errorMessage, signUpSuccess: false });
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (data) => {
    set({ isLoading: true, signInError: null, signInSuccess: false });

    try {
      const res = await axios.post('/api/signin', data); // 주소 수정
      const { accessToken, refreshToken } = res.data;

      set({
        signInSuccess: true,
        accessToken,
        refreshToken,
      });

      await get().fetchUser();
    } catch (err: unknown) {
      let errorMessage = '로그인 실패';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      }

      set({
        signInError: errorMessage,
        signInSuccess: false,
        accessToken: null,
        refreshToken: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true, userError: null });

    try {
      const token = get().accessToken; // 토큰 가져옴
      if (!token) throw new Error('토큰이 없습니다.');

      const res = await axios.get('/api/user', {
        // 주소 수정
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: res.data });
    } catch (err: unknown) {
      let errorMessage = '유저 정보 조회 실패';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      }

      set({ userError: errorMessage, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      isLoading: false,
      signUpError: null,
      signUpSuccess: false,
      signInError: null,
      signInSuccess: false,
      user: null,
      userError: null,
      accessToken: null,
      refreshToken: null,
    });
  },
}));
