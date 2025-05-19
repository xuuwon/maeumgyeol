import clsx from 'clsx';
import React from 'react';

const Button = ({
  type,
  text,
  onClick,
}: {
  type: string;
  text: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      className={clsx(
        `w-[198px] max-w-sm sm:w-full h-12 border border-1 border-main-yellow rounded-xl`,
        `flex justify-center items-center cursor-pointer`,
        `hover:bg-main-yellow`,
        type == 'yellow' ? `bg-content-yellow` : `bg-main-background`
      )}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Button;
