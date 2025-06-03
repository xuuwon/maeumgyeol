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
// import Analyzing from '@/app/analyzing/page';
// import { useDiaryStore } from '@/stores/diaryStore';

const PageClient = ({ date }: { date: string }) => {
  console.log(date);

  const today = new Date(date);
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayDate = `${year}년 ${month}월 ${day}일`;

  const [dropdown, setDropdown] = useState<boolean>(false);
  const [weather, setWeather] = useState<string>('날씨');
  const [title, setTitle] = useState<string>('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [showRewriteModal, setShowRewriteModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showSaveRestrictionModal, setShowSaveRestrictionModal] = useState<boolean>(false);

  const dropdownListStyle = 'py-2 pl-3 hover:bg-bg-yellow cursor-pointer';

  const dropdownRef = React.useRef<HTMLDivElement>(null);

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

  const router = useRouter();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  // 페이지 이동 감지 및 막기
  useEffect(() => {
    if (pathname !== lastPathname.current) {
      // 이동 시도 감지
      setShowSaveRestrictionModal(true);

      // 막기 위해 현재 URL로 다시 push (이동 막기 효과)
      router.replace(lastPathname.current);
    }
  }, [pathname, router]);

  // 새로고침 시 기본 경고, 뒤로가기 막기 (히스토리 조작)
  useEffect(() => {
    // 새로고침/탭 닫기 막기용
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 뒤로가기 막기용
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      setShowSaveRestrictionModal(true);
      // 히스토리 스택 원복
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // const writeDiary = useDiaryStore((state) => state.writeDiary);
  // const isLoading = useDiaryStore((state) => state.isLoading);
  // const error = useDiaryStore((state) => state.error);
  // const success = useDiaryStore((state) => state.success);

  const handleSubmit = () => {
    // 제출 버튼 눌렀을 때 (API 호출 X)
    const content = editor?.getHTML() ?? '';
    const textContent = editor?.getText() ?? '';

    if (weather === '날씨' || title.trim().length === 0 || textContent.trim().length === 0) {
      setShowRewriteModal(true);
      return;
    }

    // const token = localStorage.getItem('access_token') ?? '';

    // await writeDiary(
    //   {
    //     date: todayDate,
    //     weather,
    //     title,
    //     content,
    //     images: imageFiles,
    //   },
    //   token
    // );

    // if (success) {
    //   setShowSaveModal(true);
    // }

    const formData = new FormData();
    formData.append('date', todayDate);
    formData.append('weather', weather);
    formData.append('title', title);
    formData.append('content', content);

    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        console.log(key, value.name, objectUrl);
        // 미리보기 이미지에 이 objectUrl을 src로 쓰면 됨
      } else {
        console.log(key, value);
      }
    }
    setShowSaveModal(true);
  };

  // const handleDiary = async () => {
  //   const token = localStorage.getItem('access_token') ?? '';

  //   await writeDiary(
  //     {
  //       date: todayDate,
  //       weather,
  //       title,
  //       content,
  //       images: imageFiles,
  //     },
  //     token
  //   );

  //   if (success) {
  //     // 제출 및 분석 성공 -> 상세 페이지로 이동
  //   }
  // };

  // if (isLoading) return <Analyzing />;

  return (
    <>
      <ChevronLeft
        size={30}
        className="absolute cursor-pointer top-4 left-2 sm:left-3 md:left-4"
        onClick={() => {
          router.back();
        }}
      />
      {showRewriteModal && (
        <LayerPopup
          confirmType={true}
          mainText="날씨, 제목, 일기를 모두 입력해 주세요."
          onConfirm={() => {
            setShowRewriteModal(false);
          }}
        />
      )}
      {showSaveModal && (
        <LayerPopup
          mainText="작성을 완료하시겠습니까?"
          subText="작성 후에는 수정하실 수 없습니다."
          onClose={() => setShowSaveModal(false)}
          onConfirm={() => {
            router.push('/write/detail/2025-05-25');
          }}
        />
      )}
      {showSaveRestrictionModal && (
        <LayerPopup
          mainText="작성을 중단하시겠습니까?"
          subText="작성 중인 내용은 저장되지 않습니다."
          onClose={() => setShowSaveRestrictionModal(false)}
          onConfirm={() => {
            router.push('/home');
          }}
        />
      )}
      <div className="flex flex-col h-full gap-3 px-4 mx-auto sm:px-6 md:px-8 ">
        <div className="flex flex-col items-center justify-center h-32 gap-3 pt-10 text-xl iphoneSE:mt-5">
          <p>{todayDate}</p>
          <p>오늘의 일기</p>
        </div>

        <div className="flex gap-5">
          {/* 날씨 드롭다운 */}
          <div className="w-24 shrink-0">
            <div
              className="relative flex items-center justify-between w-full p-3 border cursor-pointer rounded-xl h-14 border-main-yellow"
              onClick={() => setDropdown((prev) => !prev)}
              ref={dropdownRef}
            >
              <p>{weather}</p>
              <CircleChevronDown className="text-main-yellow" />
              {dropdown && (
                <div className="absolute left-0 z-10 w-full h-auto border bg-main-background top-16 rounded-xl border-1 border-main-yellow">
                  <div
                    className={`${dropdownListStyle} rounded-t-xl`}
                    onClick={() => setWeather('맑음')}
                  >
                    ☀️ 맑음
                  </div>
                  <div className={dropdownListStyle} onClick={() => setWeather('흐림')}>
                    ☁️ 흐림
                  </div>
                  <div className={dropdownListStyle} onClick={() => setWeather('비')}>
                    🌧️ 비
                  </div>
                  <div
                    className={`${dropdownListStyle} rounded-b-xl`}
                    onClick={() => setWeather('눈')}
                  >
                    ❄️ 눈
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 제목 입력 */}
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

        {/* 이미지 업로드 */}
        <FileDropZone
          previews={imagePreviews}
          setPreviews={setImagePreviews}
          setFiles={setImageFiles}
        />

        {/* 본문 입력 (Tiptap) */}
        <div>
          <div>
            {/* 툴바에 editor 객체 전달 */}
            <ToolBar editor={editor} content={editor?.getHTML() || ''} />

            {/* 에디터 영역 */}
            <EditorContent
              editor={editor}
              className="focus:outline-none border border-1 border-main-yellow p-3 rounded-b-xl iphoneSE:h-[300px] min-h-[400px] bg-bg-yellow"
            />
          </div>
        </div>

        <div className="flex justify-center mt-auto " style={{ marginBottom: '4vh' }}>
          <Button type="yellow" func={handleSubmit} text="작성 완료" />
        </div>
      </div>
    </>
  );
};

export default PageClient;
