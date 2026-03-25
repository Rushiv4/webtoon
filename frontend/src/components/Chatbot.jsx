import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import api from '../services/api';

const Chatbot = ({ webtoonContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: `Hi! I'm your AI reading assistant. Ask me anything about ${webtoonContext?.title || 'this webtoon'}, or click "Summarize" for a recap!` }
      ]);
    }
  }, [webtoonContext, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSummarize = async () => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: 'Summarize this chapter for me please.' }]);
    
    try {
      const { data } = await api.post('/chat/summarize', { webtoonContext });
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error generating the summary. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputValue.trim() };
    const newMessages = [...messages, userMsg];
    
    setInputValue('');
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data } = await api.post('/chat/message', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        webtoonContext
      });
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#00dc64] text-white shadow-xl hover:bg-[#00b953] transition-all z-50 flex items-center justify-center transform hover:scale-105 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-4rem)] bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col transition-all z-50 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-[#00dc64] to-[#00b953] rounded-t-3xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Bot size={24} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight tracking-wide drop-shadow-md">AI Assistant</h3>
              <p className="text-[10px] text-white/90 font-medium uppercase tracking-wider">Powered by OpenAI</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition relative z-10">
            <X size={20} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex gap-2 overflow-x-auto hide-scrollbar">
          <button 
            onClick={handleSummarize}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2a2a2a] border-2 border-[#00dc64]/30 hover:border-[#00dc64] text-[#00dc64] font-bold text-xs rounded-full hover:bg-[#00dc64]/5 transition whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            <Sparkles size={14} className={isLoading ? "animate-pulse" : ""} /> Summarize Chapter
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white dark:bg-[#1e1e1e]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' : 'bg-gradient-to-br from-[#00dc64] to-[#00b953] text-white'}`}>
                {msg.role === 'user' ? 'U' : <Bot size={16} />}
              </div>
              <div className={`p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tr-sm' : 'bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00dc64] to-[#00b953] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 rounded-tl-sm flex items-center gap-3 shadow-sm text-sm font-medium">
                <Loader2 size={16} className="animate-spin text-[#00dc64]" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] rounded-b-3xl">
          <div className="relative flex items-center shadow-inner rounded-full bg-white dark:bg-[#1e1e1e]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-transparent border-2 border-transparent disabled:opacity-50 rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:border-[#00dc64]/30 text-sm dark:text-white transition"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2 bg-[#00dc64] text-white rounded-full hover:bg-[#00b953] disabled:opacity-50 disabled:hover:bg-[#00dc64] transition shadow-md"
            >
              <Send size={16} className={isLoading ? "opacity-50" : ""} />
            </button>
          </div>
        </form>

      </div>
    </>
  );
};

export default Chatbot;
