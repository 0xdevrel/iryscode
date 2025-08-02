'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, X } from 'lucide-react';

interface PreviewPaneProps {
  code: string;
  onClose?: () => void;
  isPanel?: boolean;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportSizes = {
  desktop: { width: '100%', height: '100%', icon: Monitor },
  tablet: { width: '768px', height: '1024px', icon: Tablet },
  mobile: { width: '375px', height: '667px', icon: Smartphone }
};

export default function PreviewPane({ code, onClose, isPanel = false }: PreviewPaneProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      // Trigger iframe refresh by updating its src
      const iframe = iframeRef.current;
      iframe.src = 'about:blank';
      setTimeout(() => {
        if (iframe.contentDocument) {
          iframe.contentDocument.open();
          iframe.contentDocument.write(code);
          iframe.contentDocument.close();
        }
        setIsRefreshing(false);
      }, 100);
    }
  };

  const handleOpenInNewTab = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up the object URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (iframe.contentDocument) {
        iframe.contentDocument.open();
        iframe.contentDocument.write(code);
        iframe.contentDocument.close();
      }
    }
  }, [code]);

  const currentViewport = viewportSizes[viewport];

  return (
    <div className={isPanel ? 
      "bg-white flex flex-col h-full" : 
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    }>
      <div className={isPanel ? 
        "bg-white flex flex-col h-full" : 
        "bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] flex flex-col max-w-7xl"
      }>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-gray-900">Preview</h2>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Live</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Viewport toggles */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              {Object.entries(viewportSizes).map(([size, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={size}
                    onClick={() => setViewport(size as ViewportSize)}
                    className={`p-2 transition-colors ${
                      viewport === size 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    title={`${size} view`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              title="Refresh preview"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleOpenInNewTab}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
          <div 
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300"
            style={{
              width: currentViewport.width,
              height: viewport === 'desktop' ? '100%' : currentViewport.height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>Viewport: {viewport} ({currentViewport.width} × {currentViewport.height})</span>
          <span>Auto-refresh enabled</span>
        </div>
      </div>
    </div>
  );
}