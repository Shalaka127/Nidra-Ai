import React from 'react';
import { Moon, Stars, Brain, Eye, TrendingUp, Sprout } from 'lucide-react';

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
        NIDRA AI
      </h1>
      
      <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
        Advanced AI-powered dream analysis and therapeutic conversation platform. 
        
      </p>
      
      <p className="text-blue-300 text-sm mb-12">
        • Voice Recognition • Therapeutic Dream Chat • Deep Symbol Analysis •
      </p>

      {/* Three Information Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
        {/* Card 1: Dreams Reflect Your Inner World */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-blue-100 mb-3"> Dreams Reflect Your Inner World</h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-4">
            Dreams are not random—they are your subconscious mind speaking in symbols and metaphors. 
            During sleep, your brain processes hidden emotions, unresolved conflicts, and unspoken fears.
          </p>
          <div className="bg-blue-900/30 p-3 rounded-lg border-l-4 border-blue-400">
            <p className="text-blue-300 text-xs">
              Scientific studies show that dreams help regulate emotions, store memories, and rehearse responses to threats.
            </p>
          </div>
        </div>

        {/* Card 2: Why Analyzing Dreams Matters */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-blue-100 mb-3"> Why Analyzing Dreams Matters</h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-4">
            Most people wake up and forget their dreams—missing powerful messages from their inner self. 
            Dream analysis helps you recognize patterns and understand your emotional blocks.
          </p>
          <ul className="text-blue-300 text-xs space-y-1">
            <li>• Recognize patterns in thoughts and behaviors</li>
            <li>• Identify stress, anxiety, or emotional blocks</li>
            <li>• Understand repressed desires and trauma</li>
          </ul>
        </div>

        {/* Card 3: Dream Interpretation as Growth Tool */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
              <Sprout className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-blue-100 mb-3"> Dream Interpretation as Growth Tool</h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-4">
            Understanding your dreams can guide personal growth and healing, allowing you to gain clarity 
            in decision-making and reconnect with your authentic self.
          </p>
          <div className="bg-emerald-900/30 p-3 rounded-lg border-l-4 border-emerald-400">
            <p className="text-emerald-300 text-xs">
              Carl Jung believed dream work leads to individuation—becoming who you truly are.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}