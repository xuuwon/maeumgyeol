'use client';

import Button from '@/components/button/Button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const data = {
    date: '2025-04-10',
    level: 1,
    title: '호흡 명상',
    text: '허리를 세우고 편한 자세를 갖춘 후 눈을 감은 채 호흡에 집중합니다. \n다른 생각은 하지 말고 숨이 어떻게 나가고 들어오게 되는지에 집중해 보세요.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHilk2EkOTSbl28IsCumTdX_m-IrcQ9BgddA&s',
  };

  const dateObj = new Date(data.date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

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
        <p>{formattedDate}</p>
        <p>마음 챙김 콘텐츠</p>
      </div>

      <div className="flex flex-col items-center gap-8 mb-9">
        <p className="text-xl">{data.title}</p>
        <img
          src={data.image}
          className="w-full h-auto border border-1 border-main-yellow rounded-xl"
        />
        <div className="flex flex-col justify-center w-full gap-3 p-5 border h-36 border-1 border-main-yellow bg-bg-yellow rounded-xl">
          <p className="text-center whitespace-pre-line">{data.text}</p>
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
