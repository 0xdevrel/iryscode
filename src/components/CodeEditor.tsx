'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Download, FileCode, Check, Eye, EyeOff } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  showPreview?: boolean;
  onPreviewToggle?: (show: boolean) => void;
}

export default function CodeEditor({ code, onChange, showPreview = false, onPreviewToggle }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-site.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Force editor layout on code changes and ensure content is visible
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      
      // Always force layout first
      editor.layout();
      
      // Update content if different and code exists
      if (code && editor.getValue() !== code) {
        console.log('Updating editor content:', code.length, 'characters');
        editor.setValue(code);
        editor.revealLine(1);
      }
    }
  }, [code]);

  // Force layout on window resize
  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0" style={{ minHeight: '73px' }}>
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-green-500" />
          <h2 className="font-semibold text-gray-900">Code Editor</h2>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">HTML</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onPreviewToggle && (
            <button
              onClick={() => onPreviewToggle(!showPreview)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                showPreview 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative h-full">
        <div 
          className="absolute inset-0 bg-white"
          style={{ 
            zIndex: 1,
            height: '100%'
          }}
        >
          <Editor
            height="100%"
            width="100%"
            language="html"
            value={code}
            onChange={(value) => onChange(value || '')}
            theme="vs"
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2
            }}
            onMount={(editor, monaco) => {
              console.log('Monaco Editor mounted successfully');
              editorRef.current = editor;
              
              // Force immediate layout
              editor.layout();
              
              // Set the content
              if (code) {
                editor.setValue(code);
                console.log('Code set in editor:', code.length, 'characters');
              }
              
              // Force focus and reveal
              editor.focus();
              editor.revealLine(1);
              
              // Additional layout after delay
              setTimeout(() => {
                editor.layout();
                console.log('Editor layout forced after delay');
              }, 300);
            }}
          />
        </div>
        
        {/* Fallback textarea if Monaco fails */}
        <textarea
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm border-0 resize-none"
          style={{ 
            zIndex: 0,
            fontFamily: 'Monaco, Consolas, monospace',
            backgroundColor: '#f8f9fa',
            display: code ? 'block' : 'none'
          }}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Monaco Editor is loading..."
          readOnly
        />
        
        {/* Empty state overlay */}
        {!code && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-500" style={{ zIndex: 2 }}>
            <div className="text-center max-w-md p-8">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Ready to Create Something Amazing?</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Your generated code will appear here with beautiful syntax highlighting. 
                I'll create modern, responsive websites with no external images - just pure CSS magic.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>✨ 2025 Design</span>
                <span>•</span>
                <span>📱 Mobile-First</span>
                <span>•</span>
                <span>🚀 Fast Loading</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between flex-shrink-0">
        <span>Lines: {code.split('\n').length}</span>
        <span>Characters: {code.length}</span>
        {code && !code.includes('<!DOCTYPE html>') && (
          <span className="text-orange-500">⚠ Streaming in progress...</span>
        )}
      </div>
    </div>
  );
}