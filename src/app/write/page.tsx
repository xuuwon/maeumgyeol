'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Button from '@/components/button/Button';
import Placeholder from '@tiptap/extension-placeholder';
import '../globals.css';
import { CircleChevronDown } from 'lucide-react';
import FileDropZone from '@/components/fileDropzone/FileDropZone';
import { ToolBar } from '@/components/toolBar/ToolBar';

const Page = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayDate = `${year}년 ${month}월 ${day}일`;

  const [dropdown, setDropdown] = useState<boolean>(false);
  const [weather, setWeather] = useState<string>('날씨');
  const [title, setTitle] = useState<string>('');

  const dropdownListStyle = 'py-2 pl-3 hover:bg-bg-yellow cursor-pointer';

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '오늘 당신의 하루는 어땠나요?',
      }),
    ],
    content: '<p></p>',
  });

  const handleSubmit = () => {
    const content = editor?.getHTML() ?? '';

    const formData = {
      date: todayDate,
      weather,
      title,
      content,
    };

    console.log('제출된 데이터:', formData);
  };

  return (
    <div className="flex flex-col h-screen gap-3 px-4 mx-auto sm:px-6 md:px-8 ">
      <div className="flex flex-col items-center justify-center gap-2 text-xl h-1/6 iphoneSE:mt-5">
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
              <div className="absolute left-0 z-10 w-full h-auto bg-white border top-16 rounded-xl border-1 border-main-yellow">
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
            className="w-full pl-3 border rounded-xl h-14 border-main-yellow bg-main-background"
          />
        </div>
      </div>

      {/* 이미지 업로드 */}
      <FileDropZone />

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

      <div className="flex justify-center mt-auto mb-8 md:mb-4">
        <Button type="yellow" func={handleSubmit} text="작성 완료" />
      </div>
    </div>
  );
};

export default Page;
