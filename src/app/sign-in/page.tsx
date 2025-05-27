'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigninSchema, signinSchema } from './signinSchema';
import Button from '@/components/button/Button';
import Image from 'next/image';

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    mode: 'onBlur', // focus를 벗어날 때 유효성 검사 진행
  });

  const onSubmit = (data: SigninSchema) => {
    console.log('로그인 데이터:', data);
  };

  const inputStyle =
    'h-9 border rounded-md w-80 bg-bg-yellow border-main-yellow focus:outline-none pl-2 text-[#909090]';
  const groupStyle = 'flex flex-col gap-3';
  const errorTextStlye = 'text-sm text-red-400 mx-auto';

  return (
    <div className="flex flex-col items-center justify-around h-screen px-4 py-16 iphoneSE:py-10 sm:px-6 md:px-8">
      <p className="text-2xl">로그인</p>

      <div className="flex justify-center iphoneSE:w-48 drop-shadow-xl">
        <Image
          src="/images/characters/basic_character.png" // public 폴더 기준 경로 또는 외부 URL
          alt="설명 텍스트"
          width={190} // 이미지 가로 크기(px)
          height={190} // 이미지 세로 크기(px)
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-lg gap-6 mx-auto iphoneSE:gap-3"
      >
        <div className={groupStyle}>
          <label>아이디</label>
          <input type="text" {...register('id')} className={inputStyle} />
        </div>
        <div className={groupStyle}>
          <label>비밀번호</label>
          <input type="password" {...register('password')} className={inputStyle} />
        </div>

        <div className="mx-auto mt-10">
          {errors.id ? (
            <p className={errorTextStlye}>{errors.id.message}</p>
          ) : errors.password ? (
            <p className={errorTextStlye}>{errors.password.message}</p>
          ) : (
            <p></p>
          )}
        </div>

        <div className="flex justify-center w-full mx-auto">
          <Button type="yellow" text="로그인" func={handleSubmit(onSubmit)} />
        </div>
      </form>
    </div>
  );
};

export default Page;
