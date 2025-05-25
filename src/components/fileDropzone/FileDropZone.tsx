'use client';

import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDropZone = ({
  previews,
  setPreviews,
}: {
  previews: string[];
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setPreviews((prev) => {
        const remainingSlots = 5 - prev.length;
        const filesToAdd = acceptedFiles.slice(0, remainingSlots);
        const urls = filesToAdd.map((file) => URL.createObjectURL(file));
        return [...prev, ...urls];
      });
    },
    [setPreviews]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const removePreview = (urlToRemove: string) => {
    setPreviews((prev) => prev.filter((url) => url !== urlToRemove)); // url 다른 것만 남기기
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
      {/* Dropzone 영역 */}
      <div
        {...getRootProps()}
        className={clsx(
          'px-8 text-center border-2 border-dashed cursor-pointer h-22 border-main-yellow rounded-xl bg-bg-yellow',
          previews.length > 0 ? 'py-4' : 'py-8'
        )}
      >
        {previews.length > 0 && (
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
                    removePreview(src);
                    event.stopPropagation();
                  }}
                  className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                  aria-label="remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <input {...getInputProps()} />
        {previews.length === 0 && <p>클릭해서 파일을 업로드하세요 (최대 5장)</p>}
      </div>
    </div>
  );
};

export default FileDropZone;
