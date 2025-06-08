'use client';

import { useAuthStore } from '@/stores/authStore';
import { ChevronLeft, CircleDollarSign, ShoppingCart, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Header = ({ type = 'main' }: { type?: string }) => {
  // type: 메인 (스토어, 코인, 보관함)
  // type: 스토어 (이전, 코인, 보관함)
  // type: 보관함 (이전, 코인, 스토어)
  const router = useRouter();
  const { user } = useAuthStore();

  const iconStyle = 'hover:text-[#ffad20] cursor-pointer';

  return (
    <div className="absolute top-0 left-0 flex items-center justify-between w-full h-16 px-4 sm:px-6 md:px-8">
      <div className="flex gap-3">
        <div>
          {type == 'main' ? (
            <ShoppingCart
              className={iconStyle}
              onClick={() => {
                router.push('/shopping');
              }}
            />
          ) : (
            <ChevronLeft
              className={iconStyle}
              onClick={() => {
                router.back();
              }}
            />
          )}
        </div>
        <div className="flex gap-1">
          {/* 코인 */}
          <CircleDollarSign className="text-[#ffad20]" />
          <p>{user?.coin}</p>
        </div>
      </div>
      <div>
        {type == 'store' ? (
          <ShoppingCart
            className={iconStyle}
            onClick={() => {
              router.push('/shopping');
            }}
          />
        ) : (
          <Store
            className={iconStyle}
            onClick={() => {
              router.push('/store');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
