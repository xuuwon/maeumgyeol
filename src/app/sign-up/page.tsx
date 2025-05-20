'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, signupSchema } from './signupSchema';
import Button from '@/components/button/Button';

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // focus를 벗어날 때 유효성 검사 진행
  });

  const onSubmit = (data: SignupSchema) => {
    console.log('회원가입 데이터:', data);
  };

  const inputStyle =
    'h-9 border rounded-md w-80 bg-bg-yellow border-main-yellow focus:outline-none pl-2 text-[#909090]';
  const groupStyle = 'flex flex-col gap-3';
  const errorTextStlye = 'text-sm text-red-400';

  return (
    <div className="flex flex-col items-center justify-around h-screen px-4 py-20 iphoneSE:py-10 sm:py-28 sm:px-6 md:px-8">
      <p className="text-3xl iphoneSE:text-2xl">회원가입</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-lg gap-6 mx-auto iphoneSE:gap-3"
      >
        <div className={groupStyle}>
          <label>닉네임</label>
          <input
            type="text"
            {...register('nickname')}
            className={`${inputStyle} ${errors.nickname ? 'border-red-400 text-red-400' : ''}`}
          />
          {errors.nickname && <p className={errorTextStlye}>{errors.nickname.message}</p>}
        </div>
        <div className={groupStyle}>
          <label>아이디</label>
          <input
            type="text"
            {...register('id')}
            className={`${inputStyle} ${errors.id ? 'border-red-400 text-red-400' : ''}`}
          />
          {errors.id && <p className={errorTextStlye}>{errors.id.message}</p>}
        </div>
        <div className={groupStyle}>
          <label>비밀번호</label>
          <input
            type="password"
            {...register('password')}
            className={`${inputStyle} ${errors.password ? 'border-red-400 text-red-400' : ''}`}
          />
          {errors.password && <p className={errorTextStlye}>{errors.password.message}</p>}
        </div>
        <div className={`${groupStyle} mb-10 iphoneSE:mb-5 sm:mb-20`}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`${inputStyle} ${errors.confirmPassword ? 'border-red-400 text-red-400' : ''}`}
          />
          {errors.confirmPassword && (
            <p className={errorTextStlye}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex justify-center w-full mx-auto">
          <Button type="yellow" text="회원가입" onClick={handleSubmit(onSubmit)} />
        </div>
      </form>
    </div>
  );
};

export default Page;
