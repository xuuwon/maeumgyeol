'use client';

import Button from '@/components/button/Button';
import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const logout = () => {
    useAuthStore.getState().reset(); // 상태 초기화 및 세션스토리지 내용도 삭제
  };

  return (
    <div className="flex flex-col items-center justify-around h-screen px-4 py-24 iphoneSE:py-14 sm:px-6 md:px-8">
      <div>
        {/* 이미지 */}
        <Image
          src={
            user?.equipped_accessory_image_url
              ? user?.equipped_accessory_image_url
              : '/images/characters/basic_character.png'
          }
          alt="분석중 캐릭터"
          width={230}
          height={230}
        />
      </div>

      <div className="flex flex-col w-full h-40 gap-3 p-5 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
        {/* 회원정보 박스 */}
        <div className="flex flex-col gap-1">
          <p className="text-[#ffad20]">사용자 ID</p>
          <p>{user?.login_id}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[#ffad20]">닉네임</p>
          <p>{user?.nickname}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-2">
        {/* 버튼 */}
        <Button
          type="yellow"
          text="로그아웃"
          func={() => {
            logout();
            router.push('/');
          }}
        />
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
