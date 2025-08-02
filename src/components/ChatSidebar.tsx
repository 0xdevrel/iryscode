'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  onPromptSubmit: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export default function ChatSidebar({ onPromptSubmit, isGenerating }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simple markdown renderer for chat messages
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Handle bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Handle italic text
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Handle bullet points
        if (line.startsWith('• ')) {
          line = `<span class="block ml-4">${line}</span>`;
        }
        // Handle headers
        if (line.startsWith('# ')) {
          line = `<h3 class="font-bold text-base mt-2 mb-1">${line.substring(2)}</h3>`;
        }
        
        return (
          <span 
            key={index} 
            dangerouslySetInnerHTML={{ __html: line }} 
            className={line === '' ? 'block h-2' : 'block'}
          />
        );
      });
  };

  // Initialize with welcome message after hydration to avoid timestamp mismatch
  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: '👋 **Welcome to Iryscode!**\n\nI\'m your AI web developer, ready to create **stunning SEO-optimized websites** in 2025 style.\n\n✨ **What I can build:**\n• Modern landing pages with professional images\n• Responsive portfolios and blogs\n• Business websites with local SEO\n• E-commerce pages with rich snippets\n\n💡 **I\'ll generate complete HTML, CSS, and JavaScript with:**\n• **SEO optimization** and meta tags\n• **High-quality images** from Unsplash/Pexels\n• **Mobile-first** responsive design\n• **Modern UI** and smooth animations\n\n🚀 **Try:** *"Create a restaurant website with food photos"*',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      await onPromptSubmit(inputValue);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Code generated successfully! You can see it in the code editor and toggle preview to see the result.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, there was an error generating the code. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Chat</h2>
          <p className="text-xs text-gray-500 ml-2">Describe your website idea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <div className="text-sm font-medium leading-relaxed">
                {renderMarkdown(message.content)}
              </div>
              {isClient && (
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 p-3 rounded-lg border border-gray-300">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium">Generating code...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your website..."
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        
        {/* Quick prompts */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Landing page',
            'Portfolio',
            'Blog post',
            'Product showcase'
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInputValue(prompt)}
              className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded border border-gray-300 text-gray-800 font-medium transition-colors"
              disabled={isGenerating}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}