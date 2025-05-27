'use client';

import Image from 'next/image';
import React, { useState } from 'react';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<'배경' | '액세서리'>('배경');

  const data = [
    {
      name: '수박바',
      description: '여름엔 시원한 수박바!',
      price: 200,
      image: '/images/items/watermelon_item.png',
      appliedImage: '/images/characters/watermelon_character.png',
      category: '액세서리',
    },
    {
      name: '랜덤 박스',
      description: '감자몽이 어떻게 바뀔까요?',
      price: 500,
      image: '/images/items/sweetpotato_item.png',
      appliedImage: '/images/characters/sweetpotato_character.png',
      category: '액세서리',
    },
    {
      name: '선글라스',
      description: '햇빛이 쨍쨍할 땐 선글라스 필수!',
      price: 200,
      image: '/images/items/sunglasses_item.png',
      appliedImage: '/images/characters/sunglasses_character.png',
      category: '액세서리',
    },
    {
      name: '리본',
      description: '감자몽을 공주로 만들어 볼까요?',
      price: 300,
      image: '/images/items/ribbon_item.png',
      appliedImage: '/images/characters/ribbon_character.png',
      category: '액세서리',
    },
    {
      name: '흙더미',
      description: '흙더미에 감자몽을 빠뜨려 보아요!',
      price: 500,
      image: '/images/items/soil_item.png',
      appliedImage: '/images/characters/soil_character.png',
      category: '액세서리',
    },
    {
      name: '고양이',
      description: '감자몽은 고양이를 좋아해요.',
      price: 400,
      image: '/images/items/cat_item.png',
      appliedImage: '/images/characters/cat_character.png',
      category: '액세서리',
    },
    {
      name: '토마토',
      description: '상큼한 토마토 좋아하세요?',
      price: 300,
      image: '/images/items/tomato_item.png',
      appliedImage: '/images/characters/tomato_character.png',
      category: '액세서리',
    },
    {
      name: '벚꽃 배경',
      description: '벚꽃 흩날리는 언덕에서 휴식을 취해봐요!',
      price: 500,
      image: '/images/background/cherry-blossom.jpg',
      appliedImage: '/images/background/cherryBlossom_tablet.png',
      category: '배경',
    },
    {
      name: '해변 배경',
      description: '시원한 해변에서 물놀이 한 번 어때요?',
      price: 500,
      image: '/images/background/beach.jpg',
      appliedImage: '/images/background/beach_mobile.png',
      category: '배경',
    },
  ];

  const filteredItems = data.filter((item) => item.category === selectedCategory);
  const [settingCharacter, setSettingCharacter] = useState<string>(
    '/images/characters/basic_character.png'
  ); // 유저 정보의 캐릭터

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="flex justify-around w-full mt-20 h-9">
        <div
          className={`flex justify-center w-1/2 border-b-2 cursor-pointer ${
            selectedCategory === '배경' ? 'border-main-text font-semibold' : 'border-gray-200'
          }`}
          onClick={() => setSelectedCategory('배경')}
        >
          배경
        </div>
        <div
          className={`flex justify-center w-1/2 border-b-2 cursor-pointer ${
            selectedCategory === '액세서리' ? 'border-main-text font-semibold' : 'border-gray-200'
          }`}
          onClick={() => setSelectedCategory('액세서리')}
        >
          액세서리
        </div>
      </div>

      <div className="flex items-center justify-center w-full h-72">
        <Image src={settingCharacter} alt="캐릭터" width={150} height={150} />
      </div>

      <div className="w-full mt-auto h-[470px] mb-[70px] bg-content-yellow overflow-y-scroll">
        {/* 아이템 목록 */}
        <div className="grid w-full grid-cols-2 gap-4 px-6 py-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 shadow-md cursor-pointer bg-main-background rounded-xl hover:bg-bg-yellow"
              onClick={() => {
                if (item.category !== '배경') {
                  setSettingCharacter(item.appliedImage);
                } else {
                  return;
                }
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="object-contain w-[80px] h-[80px]"
              />
              <div className="flex flex-col items-center gap-0.5 mt-2">
                <p className="font-semibold text-[#ffad20]">{item.name}</p>
                <p className="text-sm text-center text-gray-500">{item.description}</p>
                <p className="mt-2 text-sm text-main-text">{item.price} 코인</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
