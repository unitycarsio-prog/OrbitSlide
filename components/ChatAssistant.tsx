import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Bot, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { SlideData } from '../types';
import { updatePresentation } from '../services/geminiService';

interface ChatAssistantProps {
  currentSlides: SlideData[];
  onUpdateSlides: (newSlides: SlideData[]) => void;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const cleanText = (text: string) => text.replace(/\*/g, '');

const ChatAssistant: React.FC<ChatAssistantProps> = ({ currentSlides, onUpdateSlides, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you edit this presentation. What would you like to change?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const newSlides = await updatePresentation(currentSlides, userMsg);
      onUpdateSlides(newSlides);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Done! I\'ve updated the presentation for you.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error while updating the slides. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="absolute bottom-6 right-6 z-50 animate-bounce-in">
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center transition-transform hover:scale-110"
        >
          <Bot size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-20 right-4 w-72 md:w-80 h-[500px] flex flex-col z-50 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* Modern Header */}
      <div className="px-4 py-3 border-b border-white/5 bg-[#0B1120] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
             <Bot size={18} className="text-white" />
           </div>
           <div>
             <h3 className="font-bold text-white text-sm leading-tight">Orbit AI</h3>
             <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[10px] text-slate-400 font-medium">Online</span>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(true)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <Minimize2 size={16} />
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0F172A]/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center mr-2 mt-1 shrink-0 border border-white/5">
                <Bot size={12} className="text-blue-400" />
              </div>
            )}
            <div 
              className={`max-w-[85%] px-3 py-2.5 text-xs leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                : 'bg-[#1E293B] text-slate-200 border border-white/5 rounded-2xl rounded-tl-sm'
              }`}
            >
              {cleanText(msg.content)}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start animate-pulse">
             <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center mr-2 mt-1 border border-white/5">
               <Bot size={12} className="text-blue-400" />
             </div>
             <div className="bg-[#1E293B] border border-white/5 px-3 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2">
               <Loader2 size={12} className="animate-spin text-blue-400" />
               <span className="text-[10px] text-slate-400 font-medium">Processing...</span>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#0B1120] border-t border-white/5">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe changes..."
            className="w-full bg-[#1E293B] text-xs text-white placeholder-slate-500 rounded-xl pl-3 pr-10 py-3 border border-white/5 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20"
          >
            <Send size={12} fill="currentColor" />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-600 mt-2">AI can make mistakes.</p>
      </div>
    </div>
  );
};

export default ChatAssistant;