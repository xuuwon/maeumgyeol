'use client';

import { useItemStore } from '@/stores/storeStore';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<'배경' | '액세서리'>('배경');

  const categoryMap = {
    배경: 'background',
    액세서리: 'accessory',
  } as const;

  const categoryKey = categoryMap[selectedCategory];

  const { ownedItems, setItems, equipItem, unequipItem } = useItemStore();

  useEffect(() => {
    setItems(categoryKey); // zustand에서 아이템 가져오기
  }, [categoryKey, setItems]);

  const filteredItems = ownedItems.filter((item) => item.category === categoryKey);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const selectedItem = filteredItems.find((item) => item.id === selectedItemId);

  const handleEquip = async () => {
    if (!selectedItem) return;
    await equipItem(selectedItem.id);
    await setItems(categoryKey); // 서버에서 다시 받아와 상태 완전 초기화
  };

  const handleUnequip = async () => {
    if (!selectedItem) return;
    await unequipItem(selectedItem.id);
    await setItems(categoryKey); // 서버에서 다시 받아와 상태 완전 초기화
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
        {/* {selectedItem && !selectedItem.equipped && (
          <button
            className="absolute px-4 py-2 mt-2 text-sm transform -translate-x-1/2 rounded-full shadow-md bottom-5 left-1/2 bg-main-yellow"
            onClick={handleEquip}
          >
            적용하기
          </button>
        )}
        {selectedItem && selectedItem.equipped && (
          <button
            className="absolute px-4 py-2 mt-2 text-sm transform -translate-x-1/2 rounded-full shadow-md bottom-5 left-1/2 bg-main-yellow"
            onClick={handleUnequip}
          >
            해제하기
          </button>
        )} */}
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
              {item.equipped && (
                <p className="absolute px-2 py-1 text-sm -left-2 -top-2 bg-main-yellow rounded-xl">
                  적용 됨
                </p>
              )}
              <Image
                src={item.item_image_url}
                alt={item.name}
                width={80}
                height={80}
                className="object-contain w-[80px] h-[80px]"
              />
              <div className="flex flex-col items-center gap-0.5 mt-2">
                <p className="font-semibold text-[#ffad20]">{item.name}</p>
                <p className="text-sm text-center text-gray-500">{item.description}</p>
              </div>

              {/* 적용/해제 버튼 - 선택된 아이템이면 보여줌 */}
              {item.id === selectedItemId && (
                <button
                  className="px-4 py-1 mt-4 text-sm rounded-full shadow bg-main-yellow"
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 이벤트 방지
                    if (item.equipped) {
                      handleUnequip();
                    } else {
                      handleEquip();
                    }
                  }}
                >
                  {item.equipped ? '해제하기' : '적용하기'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
