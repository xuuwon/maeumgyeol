'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import '../globals.css';

// 슬라이드 데이터 정의 (캡쳐 이미지 포함)
const slides = [
  {
    title: '오늘의 감정 알아보기',
    description: 'AI가 당신의 감정을 섬세하게 분석해 드려요.',
    imgSrc: '/images/tutorial/1.png',
  },
  {
    title: '일기를 쓰고 보상 받기',
    description: '하루를 기록하면 코인을 받을 수 있어요!',
    imgSrc: '/images/tutorial/2.png',
  },
  {
    title: '마음 챙김 콘텐츠 체험',
    description: '세 가지 마음 챙김 콘텐츠로 불안한 감정을 다독여 보세요.',
    imgSrc: '/images/tutorial/3.png',
  },
  {
    title: '감자몽 꾸미기',
    description: '귀여운 감자몽을 다양한 아이템으로 자유롭게 꾸며보세요.',
    imgSrc: '/images/tutorial/4.png',
  },
  {
    title: '감정 리포트 돌아보기',
    description: '주간·월간 리포트를 통해 나의 감정 변화를 확인해요.',
    imgSrc: '/images/tutorial/5.png',
    cta: '함께 시작하기',
  },
];

const Page = () => {
  const router = useRouter();

  const handleSkip = () => {
    // 튜토리얼 완료 처리, 예: 서버에 완료 상태 저장 API 호출 가능
    router.push('/home');
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-main-background">
      {/* 상단 우측 '건너뛰기' 버튼 */}
      <button
        onClick={handleSkip}
        className="absolute z-10 text-sm text-gray-500 transition top-6 right-6 hover:text-gray-800"
      >
        건너뛰기
      </button>

      <Swiper pagination={{ clickable: true }} modules={[Pagination]} className="w-full h-full">
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex flex-col items-center justify-around h-full px-6 py-12 text-center">
              {/* 이미지 */}
              <div className="w-[250px] h-[400px] relative drop-shadow-lg">
                <Image
                  src={slide.imgSrc}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority={idx === 0}
                />
              </div>

              {/* 텍스트 */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-[#ffad20]">{slide.title}</h2>
                {slide.description && (
                  <p className="text-base text-main-text">{slide.description}</p>
                )}
              </div>

              {/* CTA 버튼 (마지막 슬라이드 전용) */}
              {slide.cta && (
                <button
                  className="w-[198px] max-w-sm sm:w-full h-12 border border-1 border-main-yellow rounded-xl flex justify-center items-center bg-content-yellow hover:bg-main-yellow"
                  onClick={handleSkip}
                >
                  {slide.cta}
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Page;
