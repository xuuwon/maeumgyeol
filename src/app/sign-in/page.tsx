'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigninSchema, signinSchema } from './signinSchema';
import Button from '@/components/button/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const Page = () => {
  const router = useRouter();
  const { signInError, signIn } = useAuthStore();
  const isFirstLogin = useAuthStore((state) => state.isFirstLogin);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    mode: 'onBlur', // focus를 벗어날 때 유효성 검사 진행
  });

  const onSubmit = async (data: SigninSchema) => {
    const success = await signIn(data);

    if (success) {
      if (isFirstLogin) {
        router.push('/tutorial');
        return;
      }

      router.push('/home');
    } else {
      console.log(signInError); // 실패 메시지 보여주기 등
    }
  };

  const inputStyle =
    'h-9 border rounded-md w-80 bg-bg-yellow border-main-yellow focus:outline-none pl-2 text-[#909090]';
  const groupStyle = 'flex flex-col gap-3';
  const errorTextStlye = 'text-sm text-red-400 mx-auto text-center';

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
          <input type="text" {...register('username')} className={inputStyle} />
        </div>
        <div className={groupStyle}>
          <label>비밀번호</label>
          <input
            type="password"
            {...register('password')}
            className={inputStyle}
            autoComplete="new-password"
          />
        </div>

        <div className="mx-auto mt-10">
          {errors.username ? (
            <p className={errorTextStlye}>{errors.username.message}</p>
          ) : errors.password ? (
            <p className={errorTextStlye}>{errors.password.message}</p>
          ) : signInError ? (
            <p className={errorTextStlye}>
              로그인에 실패하였습니다. <br /> 잠시 후 다시 시도해 주세요.
            </p>
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
