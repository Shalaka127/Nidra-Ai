import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { chatAboutDream } from '../services/openai';
import type { DreamAnalysis } from '../types/dream';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface DreamChatbotProps {
  dreamContext: string;
  analysis: DreamAnalysis;
}

export default function DreamChatbot({ dreamContext, analysis }: DreamChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your dream analysis assistant. I've analyzed your dream and I'm here to answer any questions you might have about it. What would you like to know more about?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatAboutDream(inputText, dreamContext, analysis);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || "I'm sorry, I couldn't process your question. Please try asking something else about your dream.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in dream chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties. Please try your question again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-700/30 overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-blue-700/30">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-100">Dream Chat Assistant</h3>
          <p className="text-blue-300">Ask questions about your dream analysis</p>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-slate-700/50 text-blue-100 border border-blue-600/30'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-blue-200' : 'text-blue-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-700/50 text-blue-100 border border-blue-600/30 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-blue-700/30">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about symbols, emotions, or meanings in your dream..."
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-blue-600/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-100 placeholder-blue-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}