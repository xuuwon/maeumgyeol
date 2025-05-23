// ToolBar.tsx
import type { Editor } from '@tiptap/react';

import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

type ToolBarProps = {
  editor: Editor | null;
  content: string;
};

export const ToolBar = ({ editor }: ToolBarProps) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-start justify-between w-full gap-5 px-3 py-2 border rounded-t-xl border-main-yellow bg-bg-yellow">
      <div className="flex flex-wrap items-center justify-start w-full gap-5">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={editor.isActive('bold') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <Bold className="w-5 h-5" />
        </button>
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
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={
            editor.isActive('heading', { level: 1 }) ? 'text-main-yellow' : 'text-gray-400'
          }
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive('heading', { level: 2 }) ? 'text-main-yellow' : 'text-gray-400'
          }
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={
            editor.isActive('heading', { level: 3 }) ? 'text-main-yellow' : 'text-gray-400'
          }
        >
          <Heading3 className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={editor.isActive('bulletList') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={editor.isActive('orderedList') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={editor.isActive('undo') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={editor.isActive('redo') ? 'text-main-yellow' : 'text-gray-400'}
        >
          <Redo className="w-5 h-5" />
        </button> */}
      </div>
    </div>
  );
};
