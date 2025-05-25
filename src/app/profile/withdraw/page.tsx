'use client';

import Button from '@/components/button/Button';
import { ChevronLeft, Square, SquareCheckBig } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
  const [ischecked, setIsChecked] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-around h-screen px-4 py-20 sm:px-6 md:px-8">
      <ChevronLeft
        size={30}
        className="absolute cursor-pointer top-4 left-2 sm:left-3 md:left-4"
        onClick={() => {
          router.back();
        }}
      />

      <div>
        {/* 이미지 */}
        <Image
          src={'/images/characters/sad_character.png'}
          alt="분석중 캐릭터"
          width={230}
          height={230}
        />
      </div>

      <div className="flex flex-col gap-5">
        {/* 텍스트 */}
        <div className="flex flex-col items-center">
          <p>강지웅짱짱맨님</p>
          <p>정말 탈퇴하시겠어요?</p>
        </div>

        <div className="flex flex-col items-center text-sm">
          <p>탈퇴하시면 모든 일기 및 분석 데이터가 삭제되며,</p>
          <p>데이터는 복구할 수 없습니다.</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex self-start justify-center gap-1">
          {/* 체크박스 */}
          {!ischecked ? (
            <Square
              className="transition-transform duration-200 cursor-pointer text-main-yellow hover:scale-110 active:scale-90"
              onClick={() => setIsChecked(true)}
            />
          ) : (
            <SquareCheckBig
              className="transition-transform duration-200 cursor-pointer text-main-yellow hover:scale-110 active:scale-90"
              onClick={() => setIsChecked(false)}
            />
          )}
          <p>모든 안내사항을 확인하였으며, 이에 동의합니다.</p>
        </div>

        {/* 버튼 */}
        {ischecked ? (
          <Button type="white" text="탈퇴하기" func={() => {}} />
        ) : (
          <Button type="gray" text="탈퇴하기" func={() => {}} />
        )}
      </div>
    </div>
  );
};

export default Page;
