import clsx from 'clsx';
import React from 'react';
import { LayerPopupProps } from './type';

const buttonStyle = 'w-24 border rounded-md h-9 border-1 border-main-yellow text-[14px]';

const LayerPopup: React.FC<LayerPopupProps> = ({ mainText, subText, onClose }) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-screen bg-main-text/40">
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
          <button className={`${buttonStyle} bg-main-background`} onClick={onClose}>
            취소
          </button>
          <button className={`${buttonStyle} bg-content-yellow`}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default LayerPopup;
