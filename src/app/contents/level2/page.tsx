'use client';

import Button from '@/components/button/Button';
import { useContentStore } from '@/stores/contentStore';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const { saveContentBundle, isSaved } = useContentStore();
  const id = Number(searchParams.get('id'));

  const saved = isSaved[id] ?? false;

  const contentBundle = {
    level: 2, // 현재 콘텐츠 레벨

    level_1_content: {
      level: 0,
      name: '',
      korean_name: '',
      instruction: [],
    },

    level_2_content: {
      level: 2,
      name: 'CAUSE_ANALYSIS',
      korean_name: '부정적인 감정의 원인에 대한 고찰',
      instruction: [
        '문제를 감정 없이 명확히 적는다.',
        '표면적 원인과 근본 원인을 "왜?"를 반복해 파악한다.외부·내부 영향 요인을 정리한다.',
        '비슷한 사례가 있었는지 패턴을 찾아본다.',
        '핵심 원인 2~3개로 요약하고, 내 관점에서 성찰한다.',
      ],
    },

    level_3_content: {
      level: 0,
      name: '',
      korean_name: '',
      instruction: [],
      sentence1: '',
      sentence2: '',
      sentence3: '',
    },
  };

  const handleSave = () => {
    saveContentBundle(contentBundle, Number(id));
  };

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
        <p>마음 챙김 콘텐츠</p>
      </div>

      <div className="flex flex-col items-center gap-20 h-[65%]">
        <p className="text-xl">부정적인 원인에 대한 고찰</p>
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

      {!saved && (
        <div className="flex flex-col items-center gap-3 mb-10">
          <Button
            type="yellow"
            text="저장하기"
            func={() => {
              handleSave();
              router.back();
            }}
          />
          <p className="text-sm">저장 후에도 다시 확인할 수 있어요!</p>
        </div>
      )}
    </div>
  );
};

export default Page;
