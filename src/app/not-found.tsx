'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = useAuthStore.getState().access_token;
    setIsLoggedIn(!!token);
  }, []);

  const handleGoHome = () => {
    if (isLoggedIn) {
      router.push('/home'); // 로그인 시 홈으로
    } else {
      router.push('/'); // 비로그인 시 로그인 페이지로
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="mb-6 text-5xl font-bold text-red-600">404</h1>
      <h2 className="mb-2 text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mb-6 text-gray-500">존재하지 않거나 삭제된 주소에 접근하셨어요.</p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 transition border text-main-text border-main-yellow bg-bg-yellow hover:bg-main-yellow rounded-xl"
      >
        홈으로 이동
      </button>
    </div>
  );
}
