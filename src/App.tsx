import React, { useState } from 'react';
import Header from './components/Header';
import DreamInput from './components/DreamInput';
import DreamInterpretation from './components/DreamInterpretation';
import SymbolTable from './components/SymbolTable';
import EmotionChart from './components/EmotionChart';
import DreamChatbot from './components/DreamChatbot';
import ErrorMessage from './components/ErrorMessage';
import { analyzeDream } from './services/openai';
import type { DreamAnalysis, SymbolMeaning } from './types/dream';

function App() {
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [symbolMeanings, setSymbolMeanings] = useState<SymbolMeaning[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDreamText, setLastDreamText] = useState<string>('');
  const [showChatbot, setShowChatbot] = useState(false);

  const handleAnalyzeDream = async (dreamText: string) => {
    setIsLoading(true);
    setError(null);
    setLastDreamText(dreamText);

    try {
      const result = await analyzeDream(dreamText);
      
      if (result) {
        setAnalysis(result.analysis);
        setSymbolMeanings(result.symbolMeanings);
      } else {
        setError('Failed to analyze your dream. Please check your API key and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error analyzing dream:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastDreamText) {
      handleAnalyzeDream(lastDreamText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Header />
        
        <div className="space-y-8">
          <DreamInput onAnalyze={handleAnalyzeDream} isLoading={isLoading} />
          
          {error && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}
          
          {analysis && (
            <>
              <DreamInterpretation interpretation={analysis.interpretation} />
              
              <div className="grid lg:grid-cols-2 gap-8">
                <SymbolTable symbols={symbolMeanings} />
                <EmotionChart dominantEmotion={analysis.dominantEmotion} />
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {showChatbot ? 'Hide Dream Therapy' : 'Start Dream Therapy Session'}
                </button>
              </div>

              {showChatbot && (
                <DreamChatbot dreamContext={lastDreamText} analysis={analysis} />
              )}
            </>
          )}
        </div>
        
        {!analysis && !isLoading && !error && (
          <div className="text-center mt-16">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/30 max-w-md mx-auto">
              <p className="text-blue-100 text-lg">
                Share your dream above to discover its hidden meanings and unlock insights from your subconscious mind with NIDRA AI.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-slate-800/80 backdrop-blur-sm border-t border-blue-700/30 py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-blue-200 mb-2">
            Powered by AI • Your dreams, decoded with NIDRA AI
          </p>
          <p className="text-xs text-blue-300">
            Developed by Shalaka Gangurde and Sarthak Mokal
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;