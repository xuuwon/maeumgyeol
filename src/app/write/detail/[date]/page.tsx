// 서버 컴포넌트

import PageClient from './PageClient';

interface DetailPageProps {
  params: Promise<{
    date: string;
  }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { date } = await params;

  return <PageClient date={date} />;
}
