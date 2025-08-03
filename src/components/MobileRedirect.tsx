'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 z-50 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Icons */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-2xl p-3">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <ArrowRight className="w-6 h-6 text-white/60" />
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl p-3">
              <Monitor className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Main Message */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Almost There!</h1>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            <strong className="text-blue-300">IrysCode</strong> is designed for the 
            <span className="text-purple-300 font-semibold"> full creative experience</span> on larger screens.
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80 text-sm">
                <strong className="text-white">Resizable panels</strong> for perfect workflow
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80 text-sm">
                <strong className="text-white">Split-screen coding</strong> with live preview
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80 text-sm">
                <strong className="text-white">Advanced Monaco editor</strong> for precise editing
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 mb-4">
            <h3 className="text-white font-bold text-lg mb-2">Ready to Create Magic? ✨</h3>
            <p className="text-white/90 text-sm mb-3">
              Open this link on your <strong>laptop or desktop</strong> to unlock the full IrysCode experience.
            </p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-white/70 text-xs break-all font-mono">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/60 text-xs">
            Trust us, it&apos;s worth the switch! 🚀
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-white/50 text-sm mt-6 font-medium">
          Where AI meets beautiful web design
        </p>
      </div>
    </div>
  );
}