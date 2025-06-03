'use client';

import LayerPopup from '@/components/layerPopup/LayerPopup';
// import { useCalendarStore } from '@/stores/calendarStore';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Emotion = '행복' | '중립' | '슬픔' | '분노' | '우울';

const emotionData: Record<string, Emotion> = {
  '2025-04-01': '행복',
  '2025-04-02': '행복',
  '2025-04-03': '중립',
  '2025-04-04': '슬픔',
  '2025-04-05': '행복',
  '2025-04-06': '분노',
  '2025-04-07': '우울',
  '2025-04-09': '중립',
  '2025-04-10': '슬픔',
  '2025-04-12': '행복',
  '2025-04-13': '우울',
  '2025-04-14': '슬픔',
  '2025-04-16': '중립',
  '2025-04-17': '분노',
  '2025-04-18': '우울',
  '2025-04-19': '중립',
  '2025-04-20': '행복',
  '2025-04-21': '슬픔',
  '2025-04-23': '중립',
  '2025-04-24': '행복',
  '2025-04-25': '우울',
  '2025-04-26': '슬픔',
  '2025-04-27': '분노',
  '2025-04-28': '중립',
  '2025-04-30': '우울',
};

const emotionFaces: Record<Emotion, string> = {
  행복: '😊',
  중립: '😐',
  슬픔: '😢',
  분노: '😡',
  우울: '😞',
};

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
  // const [currentMonth, setCurrentMonth] = useState<string>('');

  // const { emotions, fetchEmotions } = useCalendarStore();
  // const token = localStorage.getItem('access_token');
  // console.log(emotions);

  // const formatMonth = (date: Date) => {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   return `${year}-${month}`;
  // };

  // 초기 설정
  // useEffect(() => {
  //   const today = new Date();
  //   setCurrentMonth(formatMonth(today));
  // }, []);

  // const handleMonthChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
  //   if (!activeStartDate) return;
  //   setCurrentMonth(formatMonth(activeStartDate));
  // };

  // // 감지해서 감정 데이터 가져오기
  // useEffect(() => {
  //   console.log(currentMonth);
  //   if (token && currentMonth) {
  //     fetchEmotions(currentMonth, token);
  //   }
  // }, [fetchEmotions, token, currentMonth]);

  const tileContent = ({ date, view }: TileContentProps): ReactElement | null => {
    if (view !== 'month') return null;

    const dateStr = formatDate(date);
    const emotion = emotionData[dateStr];

    return (
      <div
        className="w-6 md:w-9 h-12 mx-auto mt-1 flex flex-col items-center justify-center select-none text-[21px]"
        title={emotion ?? undefined}
        aria-label={emotion ?? undefined}
      >
        {emotion ? <span>{emotionFaces[emotion]}</span> : <span>-</span>}
      </div>
    );
  };

  const tileClassName = ({ date, view }: TileContentProps): string | null => {
    if (view !== 'month') return null;

    const dateStr = formatDate(date);
    return emotionData[dateStr] ? 'has-emotion' : null;
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
            // onActiveStartDateChange={handleMonthChange}
            onClickDay={(value: Date) => {
              const selectedDate = formatDate(value); // YYYY-MM-DD 형식
              const today = new Date();
              // 오늘 날짜만 년,월,일 비교 (시간 제거)
              const todayStr = formatDate(today);

              if (selectedDate > todayStr) {
                setShowLayerPopup(true);
                return; // 이동하지 않음
              }

              console.log('선택한 날짜:', selectedDate);

              if (emotionData[selectedDate]) {
                router.push(`/write/detail/${selectedDate}`);
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
