// 서버 컴포넌트

import PageClient from './PageClient';

interface WritePageProps {
  params: Promise<{
    date: string;
  }>;
}

export default async function DetailPage({ params }: WritePageProps) {
  const { date } = await params;

  // API 호출

  return <PageClient date={date} />;
}
