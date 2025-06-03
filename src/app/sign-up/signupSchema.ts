import { z } from 'zod';

export const signupSchema = z
  .object({
    nickname: z
      .string()
      .nonempty('닉네임을 입력해주세요.')
      .min(2, '닉네임은 2자 이상 입력해주세요.')
      .max(20, '닉네임은 20자 이하로 입력해주세요.'),
    id: z
      .string()
      .nonempty('아이디를 입력해주세요.')
      .min(4, '아이디는 4자 이상 입력해주세요.')
      .max(12, '아이디는 12자 이하로 입력해주세요.')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: '아이디는 영문과 숫자를 모두 포함해야 합니다.',
      }),
    password: z
      .string()
      .nonempty('비밀번호를 입력해주세요.')
      .min(6, '비밀번호는 6자 이상, 12자 이하로 입력 가능합니다.')
      .max(12, '비밀번호는 6자 이상, 12자 이하로 입력 가능합니다.')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,12}$/, {
        message: '비밀번호는 영문, 숫자, 특수문자를 포함하여야 합니다.',
      }),
    confirmPassword: z.string().nonempty('비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
