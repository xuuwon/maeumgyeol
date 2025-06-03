'use client';

import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDropZone = ({
  previews,
  setPreviews,
  setFiles,
}: {
  previews: string[];
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);

  // ⚠️ 렌더 중 setState 방지: 상태 변화 이후 setFiles 호출
  useEffect(() => {
    setFiles(internalFiles);
  }, [internalFiles, setFiles]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = 5 - previews.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      const urls = filesToAdd.map((file) => URL.createObjectURL(file));

      setPreviews((prev) => [...prev, ...urls]);
      setInternalFiles((prev) => [...prev, ...filesToAdd]);
    },
    [previews.length, setPreviews]
  );

  // URL 해제
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const removePreview = (urlToRemove: string) => {
    const index = previews.findIndex((url) => url === urlToRemove);
    if (index === -1) return;

    setPreviews((prev) => prev.filter((url) => url !== urlToRemove));
    setInternalFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    URL.revokeObjectURL(urlToRemove);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          'px-8 text-center border-2 border-dashed cursor-pointer h-22 border-main-yellow rounded-xl bg-bg-yellow',
          previews.length > 0 ? 'py-4' : 'py-8'
        )}
      >
        <input {...getInputProps()} />
        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="object-cover border border-gray-300 rounded-lg w-14 h-14"
                />
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    removePreview(src);
                  }}
                  className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                  aria-label="remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>클릭해서 파일을 업로드하세요 (최대 5장)</p>
        )}
      </div>
    </div>
  );
};

export default FileDropZone;
