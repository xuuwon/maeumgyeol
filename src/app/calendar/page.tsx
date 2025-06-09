'use client';

import LayerPopup from '@/components/layerPopup/LayerPopup';
import { useCalendarStore } from '@/stores/calendarStore';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type TileContentProps = {
  activeStartDate: Date;
  date: Date;
  view: 'month' | 'year' | 'decade' | 'century';
};

// 로컬 시간 기준으로 YYYY-MM-DD 포맷 문자열 반환
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Page = () => {
  const router = useRouter();
  const [showLayerPopup, setShowLayerPopup] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<string>('');

  const { emotions, fetchEmotions } = useCalendarStore();

  const formatMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };

  useEffect(() => {
    const today = new Date();
    setCurrentMonth(formatMonth(today));
  }, []);

  const handleMonthChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    if (!activeStartDate) return;
    setCurrentMonth(formatMonth(activeStartDate));
  };

  useEffect(() => {
    if (currentMonth) {
      fetchEmotions(currentMonth);
    }
  }, [fetchEmotions, currentMonth]);

  const tileContent = ({ date, view }: TileContentProps): ReactElement | null => {
    if (view !== 'month') return null;

    const dateStr = formatDate(date);
    const emoji = emotions[dateStr]?.analyzed_emotion.emoji;

    return (
      <div
        className="w-6 md:w-9 h-12 mx-auto mt-1 flex flex-col items-center justify-center select-none text-[21px]"
        title={emotions[dateStr]?.analyzed_emotion.korean_name ?? undefined}
        aria-label={emotions[dateStr]?.analyzed_emotion.korean_name ?? undefined}
      >
        {emoji ? <span>{emoji}</span> : <span>-</span>}
      </div>
    );
  };

  const tileClassName = ({ date, view }: TileContentProps): string | null => {
    if (view !== 'month') return null;

    const dateStr = formatDate(date);
    return emotions[dateStr] ? 'has-emotion' : null;
  };

  return (
    <>
      {showLayerPopup && (
        <LayerPopup
          mainText="미래 날짜의 일기는 작성할 수 없습니다."
          confirmType={true}
          onConfirm={() => setShowLayerPopup(false)}
        />
      )}
      <div className="flex flex-col items-center min-h-screen p-6">
        <div className="flex flex-col items-center justify-center gap-2 text-xl h-36 iphoneSE:mt-5">
          <p>나의 캘린더</p>
        </div>

        <div className="w-full h-auto mb-20">
          <Calendar
            calendarType="gregory"
            locale="ko-KR"
            defaultActiveStartDate={new Date()}
            tileContent={tileContent}
            tileClassName={tileClassName}
            onActiveStartDateChange={handleMonthChange}
            onClickDay={(value: Date) => {
              const selectedDate = formatDate(value);
              const todayStr = formatDate(new Date());

              if (selectedDate > todayStr) {
                setShowLayerPopup(true);
                return;
              }

              if (emotions[selectedDate]) {
                const diaryId = emotions[selectedDate].id;
                router.push(`/write/detail/${selectedDate}?id=${diaryId}`);
              } else {
                router.push(`/write/${selectedDate}`);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
