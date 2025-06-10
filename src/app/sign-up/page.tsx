'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, signupSchema } from './signupSchema';
import Button from '@/components/button/Button';
import LayerPopup from '@/components/layerPopup/LayerPopup';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const Page = () => {
  const { signUp, signUpError, signUpSuccess } = useAuthStore();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // focus를 벗어날 때 유효성 검사 진행
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      await signUp({
        login_id: data.id,
        password: data.password,
        nickname: data.nickname,
      });

      if (signUpSuccess) {
        console.log('회원가입 성공. 로그인 페이지로 이동');
        router.push('/sign-in');
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
    }
  };

  const inputStyle =
    'h-9 border rounded-md w-80 bg-bg-yellow border-main-yellow focus:outline-none pl-2 text-[#909090]';
  const groupStyle = 'flex flex-col gap-3';
  const errorTextStlye = 'text-sm text-red-400';

  return (
    <>
      {signUpSuccess && (
        <LayerPopup
          confirmType={true}
          mainText="회원가입이 완료되었습니다."
          subText="로그인 페이지로 이동합니다."
          onConfirm={() => {
            router.push('/sign-in');
          }}
        />
      )}
      <div className="flex flex-col items-center justify-around h-screen px-4 py-16 iphoneSE:py-10 sm:py-6 sm:px-6 md:px-8">
        <p className="text-2xl">회원가입</p>

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
              autoComplete="new-password"
              className={`${inputStyle} ${errors.password ? 'border-red-400 text-red-400' : ''}`}
            />
            {errors.password && <p className={errorTextStlye}>{errors.password.message}</p>}
          </div>
          <div className={`${groupStyle} mb-10 iphoneSE:mb-5 sm:mb-20`}>
            <label>비밀번호 확인</label>
            <input
              type="password"
              {...register('confirmPassword')}
              autoComplete="new-password"
              className={`${inputStyle} ${errors.confirmPassword ? 'border-red-400 text-red-400' : ''}`}
            />
            {errors.confirmPassword && (
              <p className={errorTextStlye}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col items-center w-full gap-3 mx-auto">
            {signUpError && (
              <p className="text-sm text-red-400">
                회원가입에 실패하였습니다. <br /> 잠시 후 다시 시도해 주세요.
              </p>
            )}
            <Button type="yellow" text="회원가입" func={handleSubmit(onSubmit)} />
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
