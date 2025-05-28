'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<'배경' | '액세서리'>('배경');

  const userData = {
    userId: 'user1234',
    nickname: '감자몽러버',
    gender: 'female',
    birthday: '2000-05-01',
    character: '/images/characters/basic_character.png',
    coin: 1500,
  };

  const data = [
    // 임시 데이터
    {
      id: 1,
      name: '수박바',
      category: '액세서리',
      price: 200,
      image: '/images/items/watermelon_item.png',
      appliedImage: '/images/characters/watermelon_character.png',
      description: '여름엔 시원한 수박바!',
      isOwned: true,
      isEquipped: false,
    },
    {
      id: 2,
      name: '랜덤 박스',
      category: '액세서리',
      price: 500,
      image: '/images/items/sweetpotato_item.png',
      appliedImage: '/images/characters/sweetpotato_character.png',
      description: '감자몽이 어떻게 바뀔까요?',
      isOwned: false,
      isEquipped: false,
    },
    {
      id: 3,
      name: '선글라스',
      category: '액세서리',
      price: 200,
      image: '/images/items/sunglasses_item.png',
      appliedImage: '/images/characters/sunglasses_character.png',
      description: '햇빛이 쨍쨍할 땐 선글라스 필수!',
      isOwned: true,
      isEquipped: false,
    },
    {
      id: 4,
      name: '리본',
      category: '액세서리',
      price: 300,
      image: '/images/items/ribbon_item.png',
      appliedImage: '/images/characters/ribbon_character.png',
      description: '감자몽을 공주로 만들어 볼까요?',
      isOwned: false,
      isEquipped: false,
    },
    {
      id: 5,
      name: '흙더미',
      category: '액세서리',
      price: 500,
      image: '/images/items/soil_item.png',
      appliedImage: '/images/characters/soil_character.png',
      description: '흙더미에 감자몽을 빠뜨려 보아요!',
      isOwned: false,
      isEquipped: false,
    },
    {
      id: 6,
      name: '고양이',
      category: '액세서리',
      price: 400,
      image: '/images/items/cat_item.png',
      appliedImage: '/images/characters/cat_character.png',
      description: '감자몽은 고양이를 좋아해요.',
      isOwned: false,
      isEquipped: false,
    },
    {
      id: 7,
      name: '토마토',
      category: '액세서리',
      price: 300,
      image: '/images/items/tomato_item.png',
      appliedImage: '/images/characters/tomato_character.png',
      description: '상큼한 토마토 좋아하세요?',
      isOwned: false,
      isEquipped: false,
    },
    {
      id: 8,
      name: '벚꽃 배경',
      category: '배경',
      price: 500,
      image: '/images/background/cherry-blossom.jpg',
      appliedImage: '/images/background/cherryBlossom_tablet.png',
      description: '벚꽃 흩날리는 언덕에서 휴식을 취해봐요!',
      isOwned: true,
      isEquipped: false,
    },
    {
      id: 9,
      name: '해변 배경',
      category: '배경',
      price: 500,
      image: '/images/background/beach.jpg',
      appliedImage: '/images/background/beach_mobile.png',
      description: '시원한 해변에서 물놀이 한 번 어때요?',
      isOwned: false,
      isEquipped: false,
    },
  ];

  const filteredItems = data.filter((item) => item.category === selectedCategory);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [buyItem, setBuyItem] = useState<string>(userData.character);
  // 미리보기 후 구매용 - 초기값은 유저 정보의 캐릭터
  const [buyBackground, setBuyBackground] = useState<string>('');
  const [showBuyButton, setShowBuyButton] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center w-full h-screen">
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

      <div
        className={`relative flex items-center justify-center w-full h-72`}
        style={{ backgroundImage: `url(${buyBackground})`, backgroundSize: 'auto 100%' }}
      >
        <Image src={buyItem} alt="캐릭터" width={150} height={150} />
        {showBuyButton && (
          <button className="absolute z-10 w-20 rounded-lg h-9 -bottom-4 bg-main-yellow drop-shadow-lg">
            구매하기
          </button>
        )}
      </div>

      <div className="w-full mt-auto h-[450px] mb-[70px] bg-content-yellow overflow-y-scroll">
        {/* 아이템 목록 */}
        <div className="grid w-full grid-cols-2 gap-4 px-6 py-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className={clsx(
                'relative flex flex-col items-center justify-center p-4 shadow-md cursor-pointer rounded-xl bg-main-background',
                item.id === selectedItemId
                  ? 'bg-bg-yellow'
                  : item.isOwned
                    ? 'bg-gray-200'
                    : 'hover:bg-bg-yellow'
              )}
              onClick={() => {
                if (item.category !== '배경') {
                  setSelectedItemId(item.id);
                  setBuyItem(item.appliedImage);
                  if (!item.isOwned) {
                    setShowBuyButton(true);
                  } else {
                    setShowBuyButton(false);
                  }
                } else {
                  if (item.name == '벚꽃 배경') {
                    setBuyBackground('/images/background/store_cherryBlossom.png');
                  } else {
                    setBuyBackground('/images/background/store_beach.png');
                  }
                  setSelectedItemId(item.id);
                  if (!item.isOwned) {
                    setShowBuyButton(true);
                  } else {
                    setShowBuyButton(false);
                  }
                }
              }}
            >
              {item.isOwned && (
                <p className="absolute px-2 py-1 text-sm -left-2 -top-2 bg-main-yellow rounded-xl">
                  보유 중
                </p>
              )}
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
