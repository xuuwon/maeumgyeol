'use client';

import Button from '@/components/button/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-around h-screen px-4 py-24 iphoneSE:py-14 sm:px-6 md:px-8">
      <div>
        {/* 이미지 */}
        <Image
          src={'/images/characters/basic_character.png'}
          alt="분석중 캐릭터"
          width={230}
          height={230}
        />
      </div>

      <div className="flex flex-col w-full h-40 gap-3 p-5 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
        {/* 회원정보 박스 */}
        <div className="flex flex-col gap-1">
          <p className="text-main-yellow">사용자 ID</p>
          <p>capstone1234</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-main-yellow">닉네임</p>
          <p>강지웅짱짱맨</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-2">
        {/* 버튼 */}
        <Button type="yellow" text="로그아웃" func={() => {}} />
        <Button
          type="white"
          text="회원 탈퇴"
          func={() => {
            router.push('/profile/withdraw');
          }}
        />
      </div>
    </div>
  );
};

export default Page;
