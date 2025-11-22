
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, Database, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n';
import { GeminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const AiAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [mode, setMode] = useState<'general' | 'data'>('general'); // New Mode Toggle
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    startNewSession();
  }, [language]);

  const startNewSession = () => {
    const session = GeminiService.createChatSession(language);
    setChatSession(session);
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: t('chat_welcome'),
        timestamp: new Date()
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';

      if (mode === 'data') {
        // Use the Django Backend
        responseText = await GeminiService.askZimamBackend(userMsg.text);
      } else {
        // Use Standard Gemini
        if (!chatSession) {
            const session = GeminiService.createChatSession(language);
            setChatSession(session);
            const result = await session.sendMessage({ message: userMsg.text });
            responseText = result.text;
        } else {
            const result = await chatSession.sendMessage({ message: userMsg.text });
            responseText = result.text;
        }
      }

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: t('chat_error'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary-600" />
            {t('ai_assistant_title')}
          </h1>
          <p className="text-gray-500">{t('ai_assistant_desc')}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button 
                onClick={() => setMode('general')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === 'general' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Sparkles className="w-4 h-4" />
                {t('mode_general')}
            </button>
            <button 
                onClick={() => setMode('data')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === 'data' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Database className="w-4 h-4" />
                {t('mode_data')}
            </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors ${mode === 'data' ? 'border-indigo-200' : 'border-gray-200'}`}>
        
        {/* Data Mode Indicator */}
        {mode === 'data' && (
            <div className="bg-indigo-50 px-4 py-1 text-[10px] font-bold text-indigo-600 text-center border-b border-indigo-100 flex items-center justify-center gap-1">
                <Database className="w-3 h-3" /> {t('mode_data_desc')}
            </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'ms-auto flex-row-reverse' : 'me-auto'
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${msg.role === 'user' ? 'bg-gray-800 text-white' : mode === 'data' ? 'bg-indigo-600 text-white' : 'bg-primary-100 text-primary-600'}
              `}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`
                p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-gray-800 text-white rounded-tr-none' 
                  : mode === 'data' ? 'bg-indigo-50 border border-indigo-100 text-gray-800 rounded-tl-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}
              `}>
                {msg.role === 'model' ? (
                   <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                   </div>
                ) : (
                  msg.text
                )}
                <div className={`text-[10px] mt-1 opacity-70 ${msg.role === 'user' ? 'text-gray-300' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%] me-auto">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${mode === 'data' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary-100 text-primary-600'}`}>
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat_placeholder')}
              className={`flex-1 rounded-lg border-gray-300 py-3 px-4 pe-12 ${mode === 'data' ? 'focus:border-indigo-500 focus:ring-indigo-500' : 'focus:border-primary-500 focus:ring-primary-500'}`}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className={`absolute end-2 top-1/2 -translate-y-1/2 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${mode === 'data' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
