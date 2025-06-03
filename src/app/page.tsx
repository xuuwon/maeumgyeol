'use client';

import Button from '@/components/button/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-around w-full h-screen px-4 py-12 sm:px-6 md:px-8">
      {/* 제목 */}
      <div className="text-2xl sm:text-3xl">마음결 (心結)</div>

      {/* 이미지 */}
      <div className="iphoneSE:w-56">
        <Image
          src="/images/landing.png" // public 폴더 기준 경로 또는 외부 URL
          alt="설명 텍스트"
          width={270}
          height={270}
          className="sm:w-[330px]"
        />
      </div>

      {/* 서비스 소개 */}
      <div className="w-64 max-w-full sm:w-full">
        <p className="text-center">
          마음결은 당신의 감정을 이해하고 하루를 편안히 마무리하게 돕는 서비스입니다.💝
          <br />
          귀여운 감자몽과 함께 마음의 휴식을 경험해보세요.🥰
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col items-center w-full gap-2">
        <Button
          type="yellow"
          text="로그인"
          func={() => {
            router.push('/sign-in');
          }}
        />
        <Button
          type="white"
          text="회원가입"
          func={() => {
            router.push('/sign-up');
          }}
        />
      </div>
    </div>
  );
}
