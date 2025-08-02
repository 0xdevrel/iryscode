'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-red-500 fill-current" />
        <span>by</span>
        <a 
          href="https://x.com/0xdevrel" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          0xdevrel
        </a>
      </div>
    </footer>
  );
}