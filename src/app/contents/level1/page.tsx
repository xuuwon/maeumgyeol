'use client';

import React, { Suspense } from 'react';
import Button from '@/components/button/Button';
import { useContentStore } from '@/stores/contentStore';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Analyzing from '@/app/analyzing/page';

const Content = () => {
  const searchParams = useSearchParams();
  const { lowContents: data, saveContentBundle, isSaved } = useContentStore();
  const id = Number(searchParams.get('id'));

  const saved = isSaved[id] ?? false;

  const contentBundle = {
    level: 1, // 현재 콘텐츠 레벨

    level_1_content: {
      level: 1,
      name: data?.name ?? '', // undefined 대신 빈 문자열 넣기
      korean_name: data?.korean_name ?? '',
      instruction: data?.instruction ?? [],
    },

    level_2_content: {
      level: 0,
      name: '',
      korean_name: '',
      instruction: [],
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
    console.log(contentBundle);
    saveContentBundle(contentBundle, Number(id));
  };

  const router = useRouter();

  return (
    <div className="flex flex-col gap-10 px-4 mx-auto sm:px-6 md:px-8">
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

      <div className="flex flex-col items-center gap-8 mb-9">
        <p className="text-xl">{data?.korean_name}</p>
        <img
          src="/images/level1.jpg"
          className="w-full h-auto border border-1 border-main-yellow rounded-xl"
        />
        <div className="flex flex-col justify-center w-full gap-3 p-5 border h-36 border-1 border-main-yellow bg-bg-yellow rounded-xl">
          <p className="text-center whitespace-pre-line">{data?.instruction[0]}</p>
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

const Page = () => (
  <Suspense fallback={<Analyzing />}>
    <Content />
  </Suspense>
);

export default Page;
