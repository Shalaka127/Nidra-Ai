import React, { useState, useRef } from 'react';
import { Brain, Sparkles, Mic, MicOff, Type, AlertCircle } from 'lucide-react';
import { transcribeAudio } from '../services/openai';

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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  React.useEffect(() => {
    // Check if MediaRecorder is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      setRecordingSupported(false);
    }
  }, []);

  const startRecording = async () => {
    try {
      setSpeechError('');
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        if (audioBlob.size > 0) {
          await handleTranscription(audioBlob);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setSpeechError('Recording error occurred. Please try again.');
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setSpeechError('Microphone access denied. Please allow microphone permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          setSpeechError('No microphone found. Please connect a microphone and try again.');
        } else {
          setSpeechError('Unable to access microphone. Please check your device settings.');
        }
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const transcription = await transcribeAudio(audioBlob);
      if (transcription) {
        setDreamText(prev => prev + (prev ? ' ' : '') + transcription);
      } else {
        setSpeechError('Unable to transcribe audio. Please try speaking more clearly or use text input.');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      setSpeechError('Transcription failed. Please try again or use text input.');
    } finally {
      setIsTranscribing(false);
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
            Voice (Whisper AI)
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
              disabled={isLoading || isTranscribing}
            />
            
            {inputMode === 'voice' && recordingSupported && (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || isTranscribing}
                className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : isTranscribing
                    ? 'bg-yellow-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isTranscribing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : isRecording ? (
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
              Recording... Speak clearly about your dream
            </p>
          )}

          {isTranscribing && (
            <p className="text-sm text-yellow-300 mt-2 flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-yellow-300 border-t-transparent" />
              Transcribing with Whisper AI...
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!dreamText.trim() || isLoading || isRecording || isTranscribing}
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
              Analyze Dream with Nidra AI
            </>
          )}
        </button>
      </form>
    </div>
  );
}