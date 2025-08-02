'use client';

import Image from 'next/image';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  onClear?: () => void;
}

export default function Header({ onClear }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <Image
            src="/irys.png"
            alt="Iryscode Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Iryscode</h1>
          <p className="text-xs text-gray-500">Build anything with Irys</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Clear all chats and code"
        >
          <RotateCcw className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </header>
  );
}