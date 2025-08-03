'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, ArrowRight, Code, Palette, Zap } from 'lucide-react';
import Image from 'next/image';

export default function MobileRedirect() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth < 1024; // Less than desktop breakpoint
      
      setIsMobile(isMobileUA || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
          {/* Header with Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative w-10 h-10">
              <Image
                src="/irys.png"
                alt="Iryscode Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Iryscode</h1>
              <p className="text-xs text-gray-500">Build anything with Irys</p>
            </div>
          </div>

          {/* Device Icons */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
              <Smartphone className="w-6 h-6 text-gray-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Desktop Experience Required
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Iryscode is optimized for <strong className="text-gray-900">desktop and laptop</strong> screens 
              to provide the best coding experience.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 rounded-lg p-2">
                <Code className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Advanced Monaco Editor</p>
                <p className="text-xs text-gray-500">Full-featured code editing with syntax highlighting</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 rounded-lg p-2">
                <Palette className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Resizable Panels</p>
                <p className="text-xs text-gray-500">Customize your workspace with drag-to-resize</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-50 rounded-lg p-2">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Live Preview</p>
                <p className="text-xs text-gray-500">See your generated websites in real-time</p>
              </div>
            </div>
          </div>

          {/* URL Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <label className="text-xs text-gray-500 block mb-2">Open this URL on your computer:</label>
            <div className="bg-white border border-gray-200 rounded-md p-2">
              <p className="text-xs text-gray-700 break-all font-mono">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Ready to Build Amazing Websites?
              </h3>
              <p className="text-xs text-blue-700">
                Switch to your laptop or desktop for the full Iryscode experience.
              </p>
            </div>
            
            <p className="text-xs text-gray-500">
              Where AI meets beautiful web design ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}