'use client';

import Button from '@/components/button/Button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const data = {
    date: '2025-04-10',
    level: 2,
    title: '부정적인 감정의 원인에 대한 고찰',
  };

  const dateObj = new Date(data.date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  const router = useRouter();

  return (
    <div className="flex flex-col h-screen gap-10 px-4 mx-auto sm:px-6 md:px-8">
      <ChevronLeft
        size={30}
        className="absolute cursor-pointer top-4 left-2 sm:left-3 md:left-4"
        onClick={() => {
          router.back();
        }}
      />
      <div className="flex flex-col items-center justify-center gap-2 text-xl h-36 iphoneSE:mt-5">
        <p>{formattedDate}</p>
        <p>마음 챙김 콘텐츠</p>
      </div>

      <div className="flex flex-col items-center gap-20 h-[65%]">
        <p className="text-xl">{data.title}</p>
        <div className="flex flex-col justify-center w-full h-[60%] gap-3 p-5 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
          <div className="flex flex-col gap-5 text-center whitespace-pre-line">
            <p>1. 문제를 감정 없이 명확히 적는다.</p>
            <p>2. 표면적 원인과 근본 원인을 왜?를 반복해 파악한다.</p>
            <p>3. 외부, 내부 영향 요인을 정리한다.</p>
            <p>4. 비슷한 사례가 있었는지 패턴을 찾아본다.</p>
            <p>5. 핵심 원인 2-3개로 요약하고, 나의 관점에서 성찰한다.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mb-10">
        <Button
          type="yellow"
          text="저장하기"
          func={() => {
            router.back();
          }}
        />
        <p className="text-sm">저장 후에도 다시 확인할 수 있어요!</p>
      </div>
    </div>
  );
};

export default Page;
