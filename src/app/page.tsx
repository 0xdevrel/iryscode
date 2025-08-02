'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import CodeEditor from '@/components/CodeEditor';
import PreviewPane from '@/components/PreviewPane';
import Header from '@/components/Header';
import { generateCode } from '@/lib/gemini';

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [chatWidth, setChatWidth] = useState(500); // Default width of 420px
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCodeGeneration = async (prompt: string) => {
    setIsGenerating(true);
    
    // Clear previous code for new generation
    setGeneratedCode('');
    
    try {
      const result = await generateCode(
        { 
          prompt,
          previousContext: generatedCode 
        },
        // Streaming callback
        (partialCode: string) => {
          setGeneratedCode(partialCode);
        }
      );
      
      // Set final code
      setGeneratedCode(result.code);
    } catch (error) {
      console.error('Error generating code:', error);
      throw error; // Re-throw to be handled by ChatSidebar
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // Set constraints: minimum 300px, maximum 650px
    const constrainedWidth = Math.min(Math.max(newWidth, 300), 650);
    setChatWidth(constrainedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for mouse events
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleClearAll = () => {
    setGeneratedCode('');
    setShowPreview(false);
    // This will trigger the ChatSidebar to reset via a prop
    window.location.reload(); // Simple reset for now
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header onClear={handleClearAll} generatedCode={generatedCode} />
      <div ref={containerRef} className="flex flex-1 overflow-hidden h-full relative">
        <div style={{ width: chatWidth }} className="flex-shrink-0">
          <ChatSidebar 
            onPromptSubmit={handleCodeGeneration}
            isGenerating={isGenerating}
          />
        </div>
        
        {/* Resize Handle */}
        <div
          className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex-shrink-0 transition-colors ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        />
        
        <div className="flex-1 min-w-0 h-full">
          <CodeEditor 
            code={generatedCode}
            onChange={setGeneratedCode}
            showPreview={showPreview}
            onPreviewToggle={setShowPreview}
          />
        </div>
        
        {showPreview && (
          <div className="flex-1 min-w-0 border-l border-gray-200">
            <PreviewPane 
              code={generatedCode} 
              onClose={() => setShowPreview(false)}
              isPanel={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}