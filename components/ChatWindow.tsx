
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

const ImageWithFallback: React.FC<{ src: string; alt: string; fallback: React.ReactNode; className?: string }> = ({ src, alt, fallback, className }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={className + " flex items-center justify-center bg-purple-900/30"}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass rounded-3xl overflow-hidden mt-6 shadow-2xl shadow-purple-900/20">
      <div className="p-4 bg-purple-900/20 border-b border-white/10 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 bg-purple-900/50 overflow-hidden shadow-md flex-shrink-0">
          <ImageWithFallback 
            src="input_file_4.png" 
            alt="Ketuś Avatar" 
            fallback={<Bot size={24} className="text-purple-400" />}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-white">Ketuś</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-xs text-purple-300">Online | Twój Ekspert Keto</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-12 flex flex-col items-center px-6">
            <div className="w-48 h-48 mb-6 relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
              <ImageWithFallback 
                src="input_file_1.png" 
                alt="Ketuś Welcome" 
                fallback={<div className="w-full h-full border-4 border-dashed border-purple-500/20 rounded-full flex items-center justify-center"><Bot size={64} className="text-purple-500/40" /></div>}
                className="w-full h-full object-contain relative z-10"
              />
            </div>
            <p className="mb-2 text-white font-semibold text-lg">Hej! Jestem Ketuś.</p>
            <p className="text-sm text-gray-400">Pomogę Ci zoptymalizować biochemię. Podaj mi swoją wagę lub opowiedz, co dziś zjadłeś!</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-purple-500/30 mt-1 bg-purple-900/50">
                <ImageWithFallback 
                  src="input_file_0.png" 
                  alt="Ketuś" 
                  fallback={<Bot size={16} className="text-purple-400" />}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 shadow-sm ${
              m.role === 'user' 
              ? 'bg-purple-600 text-white rounded-tr-none' 
              : 'glass text-gray-100 rounded-tl-none border-purple-500/10'
            }`}>
              <div className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30 animate-pulse bg-purple-900/50">
               <ImageWithFallback 
                 src="input_file_4.png" 
                 alt="Thinking" 
                 fallback={<Bot size={16} className="text-purple-400" />}
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="glass p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-purple-400" />
              <span className="text-xs text-gray-400 font-medium">Ketuś analizuje dane...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/40 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz do Ketusia..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 purple-gradient rounded-xl disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
        >
          <Send size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
