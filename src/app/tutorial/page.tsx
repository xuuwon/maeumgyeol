'use client';

// import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';

const slides = [
  {
    title: '회원가입 완료',
    description: '',
  },
  {
    title: '위치기반 독립서점 추천',
    description: '당신의 위치 정보를 통해 독립서점을 손쉽게 찾아드립니다.',
  },
  {
    title: 'AR 카메라로 생생한 후기',
    description: 'AR 리뷰 시스템으로 다른 사용자들의 생생한 후기를 볼 수 있어요.',
  },
  {
    title: '독립서점 뉴스레터',
    description: '다양한 독립서점 소식을 뉴스레터로 받아보세요.',
  },
  {
    title: '사용자 맞춤 독립서점 추천',
    description: '당신의 취향을 기반으로 맞춤형 독립서점을 추천해드려요.',
    cta: '지금 취향테스트 해볼까요',
  },
];

const Page = () => {
  const router = useRouter();

  //   useEffect(() => {
  //     if (!isFirstLogin) {
  //       router.push('/home');
  //     }
  //   }, [isFirstLogin, router]);

  const handleSkip = () => {
    // 튜토리얼 완료 처리, 예: 서버에 완료 상태 저장 API 호출 가능
    router.push('/home');
  };

  //   if (!isFirstLogin) {
  //     // 첫 로그인 아니면 튜토리얼 렌더링 안 함(리다이렉트 중)
  //     return null;
  //   }

  return (
    <div className="flex items-center justify-center w-full h-screen bg-main-background">
      <Swiper pagination={{ clickable: true }} modules={[Pagination]} className="w-full h-full">
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex flex-col justify-between h-full px-6 py-10 text-center">
              <div />
              <div>
                <h2 className="mb-4 text-xl font-semibold">{slide.title}</h2>
                {slide.description && (
                  <p className="text-base text-gray-600">{slide.description}</p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                {slide.cta && (
                  <button
                    className="bg-[#5e524b] text-white py-3 rounded-full text-sm"
                    onClick={handleSkip}
                  >
                    {slide.cta}
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Page;
