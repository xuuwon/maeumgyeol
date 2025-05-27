'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';
import { LayerPopupProps } from './type';

const buttonStyle = 'w-24 border rounded-md h-9 border-1 border-main-yellow text-[14px]';

const LayerPopup: React.FC<LayerPopupProps> = ({
  confirmType = false,
  mainText,
  subText,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    // 팝업 열릴 때 스크롤 방지
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none'; // 모바일 터치 방지

    return () => {
      // 팝업 닫힐 때 원상복구
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full bg-main-text/40">
      <div
        className={clsx(
          'fixed z-50 flex flex-col items-center h-40 gap-4 px-5 w-80 bg-main-background rounded-xl',
          subText ? 'py-7' : 'py-9'
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {/* 텍스트 */}
          <p>{mainText}</p>
          <p className="text-[14px] text-[#909090]">{subText}</p>
        </div>
        <div className="flex gap-5">
          {/* 버튼 */}
          {!confirmType && (
            <button className={`${buttonStyle} bg-main-background`} onClick={onClose}>
              취소
            </button>
          )}
          <button className={`${buttonStyle} bg-content-yellow`} onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayerPopup;
