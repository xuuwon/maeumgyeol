import clsx from 'clsx';
import React from 'react';

const Button = ({
  type,
  text,
  func,
}: {
  type: string;
  text: string;
  func: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      className={clsx(
        `w-[198px] max-w-sm sm:w-full h-12 border border-1 border-main-yellow rounded-xl`,
        `flex justify-center items-center`,
        type == 'yellow'
          ? `bg-content-yellow hover:bg-main-yellow cursor-pointer`
          : type == 'gray'
            ? 'bg-gray-300 border-gray-600'
            : `bg-main-background hover:bg-main-yellow cursor-pointer`
      )}
      onClick={func}
    >
      {text}
    </div>
  );
};

export default Button;
