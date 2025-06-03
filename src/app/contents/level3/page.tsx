'use client';

import Button from '@/components/button/Button';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
  const data = {
    date: '2025-04-10',
    level: 3,
    title: '감사 일기',
    text: '오늘 하루 감사했던 일을 \n3가지 작성해 보세요.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHilk2EkOTSbl28IsCumTdX_m-IrcQ9BgddA&s',
  };

  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  const router = useRouter();

  const [firstInput, setFirstInput] = useState<string>('');
  const [secondInput, setSecondInput] = useState<string>('');
  const [thirdInput, setThirdInput] = useState<string>('');

  const inputStyle =
    'w-full py-2 pl-3 border rounded-lg border-1 border-main-yellow bg-main-background focus:outline-none';

  const handleSubmit = () => {
    const dataToSend = {
      user_id: 'abc123', // 실제 값으로 변경하세요
      date: data.date,
      level: 3,
      content_type: '자기 칭찬',
      input: {
        '1': firstInput,
        '2': secondInput,
        '3': thirdInput,
      },
    };

    console.log(dataToSend);
  };

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
        <p className="text-xl">{data.title}</p>
        <div className="flex flex-col justify-center w-full h-24 gap-3 p-5 border border-1 border-main-yellow bg-bg-yellow rounded-xl">
          <p className="text-center whitespace-pre-line">{data.text}</p>
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

      <div className="flex flex-col items-center gap-3">
        <Button
          type="yellow"
          text="저장하기"
          func={() => {
            handleSubmit();
          }}
        />
        <p className="text-sm">저장 후에도 다시 수정/확인할 수 있어요!</p>
      </div>
    </div>
  );
};

export default Page;
