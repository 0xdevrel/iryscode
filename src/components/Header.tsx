'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCcw, Upload, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { uploadToIrys } from '@/lib/irys';

interface HeaderProps {
  onClear?: () => void;
  generatedCode?: string;
}

export default function Header({ onClear, generatedCode }: HeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    gatewayUrl?: string;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUploadToIrys = async () => {
    if (!generatedCode || generatedCode.trim().length === 0) {
      console.error('No code to upload');
      setUploadResult({ error: 'No code available to upload. Please generate some code first.' });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await uploadToIrys(generatedCode);
      
      if (result.success) {
        setUploadResult({
          gatewayUrl: result.gatewayUrl
        });
      } else {
        setUploadResult({ error: result.error });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResult({ 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const clearUploadResult = () => {
    setUploadResult(null);
    setCopied(false);
  };

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
        {/* Upload to Irys Button */}
        <div className="relative">
          <button
            onClick={handleUploadToIrys}
            disabled={isUploading || !generatedCode}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            title="Upload generated code to Irys testnet"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload to Irys'}
          </button>

          {/* Upload Result Dropdown */}
          {uploadResult && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                {uploadResult.error ? (
                  <div className="text-red-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-700">Upload Failed</h4>
                      <button
                        onClick={clearUploadResult}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm">{uploadResult.error}</p>
                  </div>
                ) : (
                  <div className="text-green-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-700">Upload Successful!</h4>
                      <button
                        onClick={clearUploadResult}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Gateway URL */}
                      {uploadResult.gatewayUrl && (
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Gateway URL:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={uploadResult.gatewayUrl}
                              readOnly
                              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 font-mono"
                            />
                            <button
                              onClick={() => handleCopyUrl(uploadResult.gatewayUrl!)}
                              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                              title="Copy gateway URL"
                            >
                              {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => window.open(uploadResult.gatewayUrl, '_blank')}
                              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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