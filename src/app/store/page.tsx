'use client';

// import { useItemStore } from '@/stores/storeStore';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<'배경' | '액세서리'>('배경');

  // const { ownedItems } = useItemStore();

  // const [userData, setUserData] = useState({
  //   userId: 'user1234',
  //   nickname: '감자몽러버',
  //   gender: 'female',
  //   birthday: '2000-05-01',
  //   character: '/images/characters/basic_character.png',
  //   background: '/images/background/store_cherryBlossom.png',
  //   coin: 1500,
  // });

  const [items, setItems] = useState([
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
      isEquipped: true, // 현재 장착 중
    },
    {
      id: 8,
      name: '벚꽃 배경',
      category: '배경',
      price: 500,
      image: '/images/background/cherry-blossom.jpg',
      appliedImage: '/images/background/store_cherryBlossom.png',
      description: '벚꽃 흩날리는 언덕에서 휴식을 취해봐요!',
      isOwned: true,
      isEquipped: true,
    },
    {
      id: 9,
      name: '해변 배경',
      category: '배경',
      price: 500,
      image: '/images/background/beach.jpg',
      appliedImage: '/images/background/store_beach.png',
      description: '시원한 해변에서 물놀이 한 번 어때요?',
      isOwned: false,
      isEquipped: false,
    },
  ]);

  const filteredItems = items.filter((item) => item.category === selectedCategory && item.isOwned);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const handleEquip = () => {
    if (!selectedItem) return;

    // 적용 API 호출

    setItems((prev) =>
      prev.map((item) => {
        if (item.category !== selectedItem.category) return item;
        return {
          ...item,
          isEquipped: item.id === selectedItem.id,
        };
      })
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-screen">
      {/* 탭 선택 */}
      <div className="flex justify-around w-full mt-20 h-9">
        {['배경', '액세서리'].map((cat) => (
          <div
            key={cat}
            className={clsx(
              'flex justify-center w-1/2 border-b-2 cursor-pointer',
              selectedCategory === cat ? 'border-main-text font-semibold' : 'border-gray-200'
            )}
            onClick={() => setSelectedCategory(cat as '배경' | '액세서리')}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* 아이템 리스트 */}
      <div className="relative w-full mt-auto h-full mb-[70px] bg-content-yellow overflow-y-scroll">
        {/* 적용 버튼 */}
        {selectedItem && !selectedItem.isEquipped && (
          <button
            className="absolute px-4 py-2 mt-2 text-sm transform -translate-x-1/2 rounded-full shadow-md bottom-5 left-1/2 bg-main-yellow"
            onClick={handleEquip}
          >
            적용하기
          </button>
        )}
        <div className="grid w-full grid-cols-2 gap-4 px-6 py-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={clsx(
                'relative flex flex-col items-center justify-center p-4 shadow-md rounded-xl cursor-pointer bg-main-background hover:bg-bg-yellow',
                item.id === selectedItemId ? 'bg-bg-yellow' : ''
              )}
              onClick={() => setSelectedItemId(item.id)}
            >
              {item.isEquipped && (
                <p className="absolute px-2 py-1 text-sm -left-2 -top-2 bg-main-yellow rounded-xl">
                  적용 됨
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
