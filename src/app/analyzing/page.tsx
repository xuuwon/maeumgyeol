import Image from 'next/image';
import React from 'react';

const Analyzing = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-col items-center gap-3 text-xl pt-36">
        <p>로딩 중입니다...</p>
        <p>잠시만 기다려 주세요...</p>
      </div>

      <div className="flex items-center justify-center h-3/5">
        <Image
          src={'/images/characters/basic_character.png'}
          alt="분석중 캐릭터"
          width={300}
          height={300}
          className="animate-spin-slow"
        />
      </div>
    </div>
  );
};

export default Analyzing;
