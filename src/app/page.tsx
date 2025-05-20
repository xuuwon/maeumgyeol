'use client';

import Button from '@/components/button/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-around w-full h-screen py-12">
      {/* 제목 */}
      <div className="text-3xl sm:text-4xl">마음결 (心結)</div>

      {/* 이미지 */}
      <div className="iphoneSE:w-56">
        <Image
          src="/images/landing.png" // public 폴더 기준 경로 또는 외부 URL
          alt="설명 텍스트"
          width={350}
          height={350}
        />
      </div>

      {/* 서비스 소개 */}
      <div className="w-64 max-w-full sm:w-full">
        <p className="text-center">
          마음결은 당신의 감정을 이해하고 치유하는 맞춤형 심리 상담 플랫폼입니다.
          <br /> 언제 어디서나 편안하게, 전문가와 함께 마음 건강을 케어하세요.
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col items-center w-full gap-2">
        <Button
          type="yellow"
          text="로그인"
          onClick={() => {
            router.push('/sign-in');
          }}
        />
        <Button
          type="white"
          text="회원가입"
          onClick={() => {
            router.push('/sign-up');
          }}
        />
      </div>
    </div>
  );
}
