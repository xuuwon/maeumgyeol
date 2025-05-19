import { z } from 'zod';

export const signinSchema = z.object({
  id: z.string().nonempty('아이디를 입력하세요.'),
  password: z.string().nonempty('비밀번호를 입력하세요.'),
});

export type SigninSchema = z.infer<typeof signinSchema>;
