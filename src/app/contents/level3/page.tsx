'use client';

import Button from '@/components/button/Button';
import { useContentStore } from '@/stores/contentStore';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
  const [firstInput, setFirstInput] = useState<string>('');
  const [secondInput, setSecondInput] = useState<string>('');
  const [thirdInput, setThirdInput] = useState<string>('');

  const searchParams = useSearchParams();
  const { saveContentBundle, isSaved } = useContentStore();
  const id = Number(searchParams.get('id'));

  const saved = isSaved[id] ?? false;

  // contentBundle 형태로 묶기
  const contentBundle = {
    level: 3,

    level_1_content: {
      level: 0,
      name: '',
      korean_name: '',
      instruction: [],
    },

    level_2_content: {
      level: 0,
      name: '',
      korean_name: '',
      instruction: [],
    },

    level_3_content: {
      level: 3,
      name: 'GRATITUDE_JOURNAL',
      korean_name: '감사 일기',
      instruction: ['오늘 하루 감사했던 일을 3가지 작성해 보세요.'],
      sentence1: firstInput,
      sentence2: secondInput,
      sentence3: thirdInput,
    },
  };

  const handleSave = () => {
    console.log('저장할 콘텐츠:', contentBundle);
    saveContentBundle(contentBundle, id); // 실제 저장 함수 호출
    router.back();
  };

  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  const router = useRouter();

  const inputStyle =
    'w-full py-2 pl-3 border rounded-lg border-1 border-main-yellow bg-main-background focus:outline-none';

  const isSaveDisabled =
    firstInput.trim().length === 0 ||
    secondInput.trim().length === 0 ||
    thirdInput.trim().length === 0;

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

      <div className="flex flex-col items-center gap-16 h-[60%]">
        <p className="text-xl">감사 일기</p>
        <div className="flex flex-col justify-center w-full h-24 gap-3 p-5 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
          <p className="text-center whitespace-pre-line">
            오늘 하루 감사했던 일을 3가지 작성해 보세요.
          </p>
        </div>

        <div className="flex flex-col w-full gap-5">
          <div className="flex gap-3">
            <p className="text-3xl text-main-yellow">1.</p>
            <input
              className={inputStyle}
              type="text"
              placeholder={`첫 번째 감사한 일은 무엇인가요?`}
              value={firstInput}
              onChange={(e) => setFirstInput(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <p className="text-3xl text-main-yellow">2.</p>
            <input
              className={clsx(
                inputStyle,
                firstInput.trim().length == 0 && 'bg-gray-200 cursor-not-allowed'
              )}
              type="text"
              placeholder={`두 번째 감사한 일은 무엇인가요?`}
              value={secondInput}
              onChange={(e) => setSecondInput(e.target.value)}
              disabled={firstInput.trim().length === 0}
            />
          </div>

          <div className="flex gap-3">
            <p className="text-3xl text-main-yellow">3.</p>
            <input
              className={clsx(
                inputStyle,
                secondInput.trim().length == 0 && 'bg-gray-200 cursor-not-allowed'
              )}
              type="text"
              placeholder={`세 번째 감사한 일은 무엇인가요?`}
              value={thirdInput}
              onChange={(e) => setThirdInput(e.target.value)}
              disabled={secondInput.trim().length === 0}
            />
          </div>
        </div>
      </div>

      {!saved && (
        <div className="flex flex-col items-center gap-3">
          <Button
            type={isSaveDisabled ? 'gray' : 'yellow'}
            text="저장하기"
            func={() => {
              if (!isSaveDisabled) {
                handleSave();
                router.back();
              }
            }}
          />
          <p className="text-sm">저장 후에도 다시 확인할 수 있어요!</p>
        </div>
      )}
    </div>
  );
};

export default Page;
