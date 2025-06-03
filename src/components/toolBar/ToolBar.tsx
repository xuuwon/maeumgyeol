import type { Editor } from '@tiptap/react';

import {
  Strikethrough,
  Italic,
  Highlighter, // 하이라이트 대체 아이콘
} from 'lucide-react';

type ToolBarProps = {
  editor: Editor | null;
  content: string;
};

export const ToolBar = ({ editor }: ToolBarProps) => {
  if (!editor) {
    return null;
  }

  const toggleColor = (editor: Editor, color: string) => {
    const currentColor = editor.getAttributes('textStyle').color;

    if (currentColor === color) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  return (
    <div className="flex flex-wrap items-start justify-between w-full gap-5 px-3 py-2 border rounded-t-xl border-main-yellow bg-bg-yellow">
      <div className="flex flex-wrap items-center justify-start w-full gap-5">
        {/* 기본 서식 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={editor.isActive('italic') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <Italic className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={editor.isActive('strike') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <Strikethrough className="w-5 h-5" />
        </button>

        {/* 하이라이트 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHighlight().run();
            editor.chain().focus().unsetColor().run();
          }}
          className={editor.isActive('highlight') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <Highlighter className="w-5 h-5" />
        </button>

        {/* 텍스트 컬러들 */}
        {[
          { color: '#5D4037', label: '#5D4037' },
          { color: '#283593', label: '#283593' },
          { color: '#00796B', label: '#00796B' },
          { color: '#F57C00', label: '#F57C00' },
        ].map(({ color }, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              toggleColor(editor, color);
              editor.chain().focus().unsetHighlight().run();
            }}
            className={`w-5 h-5 rounded-full border-2 ${
              editor.isActive('textStyle', { color }) ? 'border-main-yellow' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            title={`Set color: ${color}`}
          />
        ))}
      </div>
    </div>
  );
};
