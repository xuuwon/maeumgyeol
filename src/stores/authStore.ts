import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import qs from 'qs';

type SignUpPayload = {
  login_id: string;
  password: string;
  nickname: string;
};

type SignInPayload = {
  username: string;
  password: string;
};

type User = {
  id: string;
  login_id: string;
  nickname: string;
  coin: number;
  equipped_accessory_image_url: string | null;
  equipped_background_image_url: string | null;
};

type AuthState = {
  isLoading: boolean;

  signUpError: string | null;
  signUpSuccess: boolean;

  signInError: string | null;
  signInSuccess: boolean;

  user: User | null;
  userError: string | null;

  access_token: string | null;
  refresh_token: string | null;

  equipped_accessory_image_url: string | null;
  equipped_background_image_url: string | null;

  isFirstLogin: boolean;

  signUp: (data: SignUpPayload) => Promise<void>;
  signIn: (data: SignInPayload) => Promise<boolean>;
  fetchUser: () => Promise<void>;
  reset: () => void;
};

const api = axios.create({
  baseURL: 'https://sentiment-server.duckdns.org/api/v1',
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoading: false,

      signUpError: null,
      signUpSuccess: false,

      signInError: null,
      signInSuccess: false,

      user: null,
      userError: null,

      access_token: null,
      refresh_token: null,

      equipped_accessory_image_url: null,
      equipped_background_image_url: null,

      isFirstLogin: true,

      signUp: async (data) => {
        set({ isLoading: true, signUpError: null, signUpSuccess: false });
        try {
          const res = await api.post('/users/signup', data);
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
          const res = await api.post('/users/login', qs.stringify(data), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          const {
            access_token,
            refresh_token,
            equipped_accessory_image_url,
            equipped_background_image_url,
          } = res.data;

          set({
            signInSuccess: true,
            access_token,
            refresh_token,
            equipped_accessory_image_url,
            equipped_background_image_url,
          });

          await get().fetchUser();

          // 세션스토리지를 이용한 first login 판단
          const hasLoggedInBefore = sessionStorage.getItem('hasLoggedInBefore');
          if (!hasLoggedInBefore) {
            set({ isFirstLogin: true });
            sessionStorage.setItem('hasLoggedInBefore', 'true');
          } else {
            set({ isFirstLogin: false });
          }

          return true;
        } catch (err: unknown) {
          let errorMessage = '로그인 실패';
          if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || err.message;
          }

          set({
            signInError: errorMessage,
            signInSuccess: false,
            access_token: null,
            refresh_token: null,
          });

          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUser: async () => {
        set({ isLoading: true, userError: null });

        try {
          const token = get().access_token;
          if (!token) throw new Error('토큰이 없습니다.');

          const res = await api.get('/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ user: { ...res.data } });
          console.log('after set user:', get().user);
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
          access_token: null,
          refresh_token: null,
        });

        sessionStorage.removeItem('auth-storage'); // 직접 세션스토리지 초기화
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        // 저장하고 싶은 값만 명시적으로
        user: state.user,
      }),
    }
  )
);
