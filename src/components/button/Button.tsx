import clsx from 'clsx';
import React from 'react';

const Button = ({ type, text }: { type: string; text: string }) => {
  return (
    <div
      className={clsx(
        `w-[198px] max-w-sm sm:w-full h-12 border border-1 border-main-yellow rounded-xl`,
        `flex justify-center items-center cursor-pointer`,
        type == 'yellow' ? `bg-content-yellow` : `bg-main-background`
      )}
    >
      {text}
    </div>
  );
};

export default Button;
