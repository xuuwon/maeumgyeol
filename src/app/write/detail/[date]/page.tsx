// 서버 컴포넌트

import PageClient from './PageClient';

interface DetailPageProps {
  params: {
    date: string;
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const date = params.date;

  // API 호출

  return <PageClient date={date} />;
}
