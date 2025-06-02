'use client';

// import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import '../globals.css';

const slides = [
  {
    title: '오늘의 감정 알아보기',
    description: 'AI가 당신의 감정을 섬세하게 분석해 드려요.',
  },
  {
    title: '일기를 쓰고 보상 받기',
    description: '하루를 기록하면 코인을 받을 수 있어요!',
  },
  {
    title: '마음 챙김 콘텐츠 체험',
    description: '세 가지 마음 챙김 콘텐츠로 불안한 감정을 다독여 보세요.',
  },
  {
    title: '감자몽 꾸미기',
    description: '귀여운 감자몽을 다양한 아이템으로 자유롭게 꾸며보세요.',
  },
  {
    title: '감정 리포트 돌아보기',
    description: '주간·월간 리포트를 통해 나의 감정 변화를 확인해요.',
    cta: '함께 시작하기',
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
              <div className="flex flex-col items-center gap-4">
                {slide.cta && (
                  <button
                    className="w-[198px] max-w-sm sm:w-full h-12 border border-1 border-main-yellow rounded-xl flex justify-center items-center bg-content-yellow hover:bg-main-yellow"
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
