import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-900/50 border border-red-600/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <h3 className="text-lg font-semibold text-red-200">Analysis Error</h3>
      </div>
      
      <p className="text-red-300 mb-4">{message}</p>
      
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}