import React from 'react';
import { Moon, Stars, Brain } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
          <Moon className="w-8 h-8 text-white" />
        </div>
        <Stars className="w-6 h-6 text-blue-300 animate-pulse" />
      </div>
      
      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
        Nidra AI
      </h1>
      
      <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-2">
        Advanced AI-powered dream analysis and interpretation platform. 
        Unlock the mysteries of your subconscious mind with intelligent insights.
      </p>
      
      <p className="text-blue-300 text-sm">
        • Speech-to-Text Input • Intelligent Dream Chat • Deep Symbol Analysis •
      </p>
    </header>
  );
}