'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Button from '@/components/button/Button';
import Placeholder from '@tiptap/extension-placeholder';
import '../../globals.css';
import { ChevronLeft, CircleChevronDown } from 'lucide-react';
import FileDropZone from '@/components/fileDropzone/FileDropZone';
import { ToolBar } from '@/components/toolBar/ToolBar';
import LayerPopup from '@/components/layerPopup/LayerPopup';
import { customHighlight } from '@/extension/customHighlight';
import { useDiaryStore } from '@/stores/diaryStore';
import { useCalendarStore } from '@/stores/calendarStore';
import Analyzing from '@/app/analyzing/page';
import { useContentStore } from '@/stores/contentStore';

const PageClient = ({ date }: { date: string }) => {
  const today = new Date(date);
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayDate = `${year}년 ${month}월 ${day}일`;
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;

  const [dropdown, setDropdown] = useState<boolean>(false);
  const [weather, setWeather] = useState<string>('날씨');
  const [title, setTitle] = useState<string>('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showRewriteModal, setShowRewriteModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showSaveRestrictionModal, setShowSaveRestrictionModal] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastPathname = useRef(usePathname());
  const router = useRouter();
  const pathname = usePathname();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      customHighlight,
      Placeholder.configure({
        placeholder: '오늘 당신의 하루는 어땠나요?',
      }),
    ],
    content: '',
  });

  const writeDiary = useDiaryStore((state) => state.writeDiary);
  const isLoading = useDiaryStore((state) => state.isLoading);
  const error = useDiaryStore((state) => state.error);
  const success = useDiaryStore((state) => state.success);
  const diary = useDiaryStore((state) => state.diary);

  const { fetchEmotions } = useCalendarStore();

  // 일기 존재하는지 확인용
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkTodayDiary = async () => {
      await fetchEmotions(formattedMonth);
      const hasDiary = !!useCalendarStore.getState().emotions[formattedDate];
      if (hasDiary) {
        router.replace(`/write/detail/${formattedDate}`);
      } else {
        setChecking(false); // ✅ 일기 없을 때만 본문 보이기
      }
    };

    checkTodayDiary();
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 페이지 이동 감지 및 막기
  useEffect(() => {
    if (pathname !== lastPathname.current) {
      setShowSaveRestrictionModal(true);
      router.replace(lastPathname.current);
    }
  }, [pathname, router]);

  // 새로고침 / 뒤로가기 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = () => {
      setShowSaveRestrictionModal(true);
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && success && diary?.date) {
      router.push(`/write/detail/${diary.date}`);

      setSubmitted(false);
    }
  }, [submitted, success, diary?.date]);

  // 저장 처리 함수
  const handleSubmit = async () => {
    const content = editor?.getHTML() ?? '';
    const textContent = editor?.getText() ?? '';

    if (weather === '날씨' || title.trim().length === 0 || textContent.trim().length === 0) {
      setShowRewriteModal(true);
      setShowSaveModal(false);
      return;
    }

    setShowSaveModal(false);
    setSubmitted(true);

    await writeDiary({
      diary_date: formattedDate,
      weather,
      title,
      content,
      images_url: imageFiles,
    });
  };

  const { fetchContent } = useContentStore();

  const handleFetchcontent = () => {};

  if (checking) {
    return <Analyzing />;
  }

  return (
    <>
      <ChevronLeft
        size={30}
        className="absolute cursor-pointer top-4 left-2 sm:left-3 md:left-4"
        onClick={() => router.back()}
      />

      {/* 경고 모달 */}
      {showRewriteModal && (
        <LayerPopup
          confirmType
          mainText="날씨, 제목, 일기를 모두 입력해 주세요."
          onConfirm={() => setShowRewriteModal(false)}
        />
      )}

      {/* 저장 확인 모달 */}
      {showSaveModal && (
        <LayerPopup
          mainText="작성을 완료하시겠습니까?"
          subText="작성 후에는 수정하실 수 없습니다."
          onClose={() => setShowSaveModal(false)}
          onConfirm={handleSubmit} // 확인 버튼 클릭 시 저장 처리 함수 실행
        />
      )}

      {showSaveRestrictionModal && (
        <LayerPopup
          mainText="작성을 중단하시겠습니까?"
          subText="작성 중인 내용은 저장되지 않습니다."
          onClose={() => setShowSaveRestrictionModal(false)}
          onConfirm={() => router.push('/home')}
        />
      )}

      {isLoading && <Analyzing />}

      {error && (
        <LayerPopup
          mainText="작성 중 오류가 발생했습니다."
          subText={error}
          onConfirm={() => window.location.reload()}
        />
      )}

      <div className="flex flex-col h-full gap-3 px-4 mx-auto sm:px-6 md:px-8">
        <div className="flex flex-col items-center justify-center h-32 gap-3 pt-10 text-xl iphoneSE:mt-5">
          <p>{todayDate}</p>
          <p>오늘의 일기</p>
        </div>

        <div className="flex gap-5">
          <div className="relative w-24 shrink-0">
            <div
              className="flex items-center justify-between w-full p-3 border cursor-pointer rounded-xl h-14 border-main-yellow"
              onClick={() => setDropdown((prev) => !prev)}
            >
              <p>{weather}</p>
              <CircleChevronDown className="text-main-yellow" />
            </div>

            {dropdown && (
              <div
                ref={dropdownRef} // ✅ dropdown만 ref에 포함
                className="absolute left-0 z-10 w-full h-auto border bg-main-background top-16 rounded-xl border-1 border-main-yellow"
              >
                {['맑음', '흐림', '비', '눈'].map((w, i, arr) => (
                  <div
                    key={w}
                    className={`py-2 pl-3 hover:bg-bg-yellow cursor-pointer ${
                      i === 0 ? 'rounded-t-xl' : i === arr.length - 1 ? 'rounded-b-xl' : ''
                    }`}
                    onClick={() => {
                      setWeather(w);
                      setDropdown(false); // ⛔️ 여기까지는 잘 동작
                    }}
                  >
                    {w === '맑음' ? '☀️' : w === '흐림' ? '☁️' : w === '비' ? '🌧️' : '❄️'} {w}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-grow">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="오늘 일기의 제목"
              className="w-full pl-3 border rounded-xl h-14 border-main-yellow bg-main-background focus:outline-none"
            />
          </div>
        </div>

        <FileDropZone
          previews={imagePreviews}
          setPreviews={setImagePreviews}
          setFiles={setImageFiles}
        />

        <div>
          <ToolBar editor={editor} content={editor?.getHTML() || ''} />
          <EditorContent
            editor={editor}
            className="focus:outline-none border border-1 border-main-yellow p-3 rounded-b-xl iphoneSE:h-[300px] min-h-[400px] bg-bg-yellow"
          />
        </div>

        <div className="flex justify-center mt-auto" style={{ marginBottom: '4vh' }}>
          <Button type="yellow" func={() => setShowSaveModal(true)} text="작성 완료" />
        </div>
      </div>
    </>
  );
};

export default PageClient;
