import React from 'react';
import { BookOpen, Eye } from 'lucide-react';

interface DreamInterpretationProps {
  interpretation: string;
}

export default function DreamInterpretation({ interpretation }: DreamInterpretationProps) {
  if (!interpretation) return null;

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-700/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-100">Dream Interpretation</h3>
          <p className="text-blue-300">Insights into your subconscious mind</p>
        </div>
      </div>

      <div className="prose max-w-none">
        <div className="bg-gradient-to-r from-slate-700/50 to-blue-900/30 p-6 rounded-xl border-l-4 border-emerald-400">
          <p className="text-blue-100 leading-relaxed whitespace-pre-wrap">
            {interpretation}
          </p>
        </div>
      </div>
    </div>
  );
}