// import { NextRequest, NextResponse } from 'next/server';

// // 인증이 필요한 경로
// const protectedPaths = [
//   '/analyzing',
//   '/calendar',
//   '/contents',
//   '/home',
//   '/profile',
//   '/shopping',
//   '/statistic',
//   '/store',
//   '/tutorial',
//   '/write',
// ];

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // 로그인된 유저인지 확인
//   const token = localStorage.getItem('accessToken');

//   const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

//   if (isProtected && !token) {
//     // 로그인 안 돼있고 보호된 경로 접근 시 → 로그인 페이지로 리디렉션
//     const loginUrl = new URL('/login', req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // 통과
//   return NextResponse.next();
// }

// export const config = {
//   matcher: protectedPaths.map((path) => `${path}/:path*`),
// };
