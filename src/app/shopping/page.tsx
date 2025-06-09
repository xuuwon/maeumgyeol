'use client';

import LayerPopup from '@/components/layerPopup/LayerPopup';
import { useAuthStore } from '@/stores/authStore';
import { useItemStore } from '@/stores/storeStore';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<'배경' | '액세서리'>('배경');
  const { user } = useAuthStore();

  const categoryMap = {
    배경: 'background',
    액세서리: 'accessory',
  } as const;

  const categoryKey = categoryMap[selectedCategory];

  const { items: data, setItems, buyItem } = useItemStore();

  useEffect(() => {
    setItems(categoryKey); // zustand에서 아이템 가져오기
  }, [categoryKey, setItems]);

  useEffect(() => {
    if (!user) return;

    setBuyBackground(getBackgroundImageUrl(user?.equipped_background_image_url));
    setBuyAppliedImage(
      user?.equipped_accessory_image_url
        ? user?.equipped_accessory_image_url
        : '/images/characters/basic_character.png'
    );
  }, [user]);

  const filteredItems = data.filter((item) => item.category === categoryKey);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // 미리보기 후 구매용 - 초기값은 유저 정보의 캐릭터 및 배경
  const getBackgroundImageUrl = (equippedUrl: string | null | undefined): string | null => {
    if (!equippedUrl) return null;

    if (equippedUrl.toLowerCase().includes('cherryBlossom')) {
      return '/images/background/store_cherryBlossom.png';
    }

    if (equippedUrl.toLowerCase().includes('beach')) {
      return '/images/background/store_beach.png';
    }

    // 다른 배경이 추가될 경우 여기에 else if 추가
    return null;
  };

  const [buyBackground, setBuyBackground] = useState<string | null>(
    getBackgroundImageUrl(user?.equipped_background_image_url)
  );
  const [buyAppliedImage, setBuyAppliedImage] = useState<string>(
    user?.equipped_accessory_image_url
      ? user?.equipped_accessory_image_url
      : '/images/characters/basic_character.png'
  ); // 액세서리용

  const [showBuyButton, setShowBuyButton] = useState<boolean>(false);

  const [showBuyLayerPopup, setShowBuyLayerPopup] = useState<boolean>(false); // 구매 확인 레이어팝업
  const [showCompleteLayerPopup, setShowCompleteLayerPopup] = useState<boolean>(false); // 구매 성공 레이어팝업
  const [showCoinLayerPopup, setShowCoinLayerPopup] = useState<boolean>(false); // 코인 부족 레이어팝업

  const handleBuyItem = async () => {
    const selectedItem = data.find((item) => item.id === selectedItemId);
    if (!selectedItem) return;

    if (user && selectedItem.price > user?.coin) {
      setShowCoinLayerPopup(true);
      setShowBuyLayerPopup(false);
      return;
    }

    try {
      await buyItem(selectedItem.id); // 구매 API 호출
      await setItems(categoryKey);

      setShowBuyLayerPopup(false);
      setShowCompleteLayerPopup(true);
      setShowBuyButton(false); // 구매 버튼 숨기기
    } catch (error) {
      console.error(error);
      alert('구매 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {showBuyLayerPopup && (
        <LayerPopup
          mainText="구매하시겠습니까?"
          subText="구매 후 취소하실 수 없습니다."
          onConfirm={() => {
            /* 구매 API */
            handleBuyItem();
          }}
          onClose={() => {
            setShowBuyLayerPopup(false);
          }}
        />
      )}
      {showCompleteLayerPopup && (
        <LayerPopup
          confirmType={true}
          mainText="구매가 완료되었습니다."
          subText="보관함에서 확인하실 수 있습니다."
          onConfirm={() => {
            setShowCompleteLayerPopup(false);
          }}
        />
      )}
      {showCoinLayerPopup && (
        <LayerPopup
          confirmType={true}
          mainText="코인이 부족합니다."
          onConfirm={() => {
            setShowCoinLayerPopup(false);
          }}
        />
      )}
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
          style={
            buyBackground
              ? {
                  backgroundImage: `url(${buyBackground})`,
                  backgroundSize: 'auto 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          <Image src={buyAppliedImage} alt="캐릭터" width={150} height={150} />
          {showBuyButton && (
            <button
              className="absolute z-10 w-20 rounded-lg h-9 -bottom-4 bg-main-yellow drop-shadow-lg"
              onClick={() => {
                setShowBuyLayerPopup(true);
              }}
            >
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
                    : item.purchased
                      ? 'bg-gray-200'
                      : 'hover:bg-bg-yellow'
                )}
                onClick={() => {
                  setSelectedItemId(item.id);

                  if (item.category === 'background') {
                    setBuyBackground(item.applied_image_url); // 배경 갱신
                  } else {
                    setBuyAppliedImage(item.applied_image_url); // 액세서리 갱신
                  }

                  setShowBuyButton(!item.purchased);
                }}
              >
                {item.purchased && (
                  <p className="absolute px-2 py-1 text-sm -left-2 -top-2 bg-main-yellow rounded-xl">
                    보유 중
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
                  <p className="mt-2 text-sm text-main-text">{item.price} 코인</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
