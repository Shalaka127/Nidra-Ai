import React, { useState, useRef } from 'react';
import { Brain, Sparkles, Mic, MicOff, Type, AlertCircle } from 'lucide-react';

interface DreamInputProps {
  onAnalyze: (dreamText: string) => void;
  isLoading: boolean;
}

export default function DreamInput({ onAnalyze, isLoading }: DreamInputProps) {
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [recordingSupported, setRecordingSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordingSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setDreamText(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setIsRecording(false);
        
        let errorMessage = '';
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection and try again.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking more clearly.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please connect a microphone and try again.';
            break;
          default:
            errorMessage = 'Speech recognition failed. Please try again or use text input.';
        }
        
        setSpeechError(errorMessage);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    setSpeechError('');
    setIsRecording(true);
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      setIsRecording(false);
      setSpeechError('Failed to start speech recognition. Please try again.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Silently handle stop errors
      }
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.trim()) {
      onAnalyze(dreamText);
    }
  };

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-700/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-100">Share Your Dream</h2>
          <p className="text-blue-300">Describe your dream in detail for deeper insights</p>
        </div>
      </div>

      {recordingSupported && (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputMode === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-blue-300 hover:bg-slate-600'
            }`}
          >
            <Type className="w-4 h-4" />
            Type
          </button>
          <button
            type="button"
            onClick={() => setInputMode('voice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputMode === 'voice'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-blue-300 hover:bg-slate-600'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice Recognition
          </button>
        </div>
      )}

      {speechError && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-600/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-200 text-sm">{speechError}</p>
            <button
              onClick={() => setSpeechError('')}
              className="text-red-300 hover:text-red-200 text-xs mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="dreamText" className="block text-sm font-medium text-blue-200 mb-2">
            Dream Description
          </label>
          <div className="relative">
            <textarea
              id="dreamText"
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Last night I dreamed that I was flying over a vast ocean. The sky was painted in shades of orange and pink, and I could see mysterious islands below..."
              className="w-full h-40 px-4 py-3 bg-slate-700/50 border border-blue-600/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 placeholder-blue-400 text-blue-100"
              disabled={isLoading}
            />
            
            {inputMode === 'voice' && recordingSupported && (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          
          {isRecording && (
            <p className="text-sm text-blue-300 mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Listening... Speak clearly about your dream
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!dreamText.trim() || isLoading || isRecording}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Analyzing Your Dream...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Dream with NIDRA AI
            </>
          )}
        </button>
      </form>
    </div>
  );
}