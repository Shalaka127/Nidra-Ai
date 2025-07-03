import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Heart, TrendingUp } from 'lucide-react';

interface EmotionChartProps {
  dominantEmotion: string;
}

export default function EmotionChart({ dominantEmotion }: EmotionChartProps) {
  if (!dominantEmotion) return null;

  const data = [
    { emotion: dominantEmotion, intensity: 8.5 }
  ];

  const getEmotionColor = (emotion: string) => {
    const emotionColors: { [key: string]: string } = {
      joy: '#10B981',
      fear: '#EF4444',
      sadness: '#3B82F6',
      anger: '#F59E0B',
      surprise: '#8B5CF6',
      disgust: '#84CC16',
      anticipation: '#EC4899',
      trust: '#06B6D4'
    };
    
    const lowerEmotion = emotion.toLowerCase();
    for (const [key, color] of Object.entries(emotionColors)) {
      if (lowerEmotion.includes(key)) {
        return color;
      }
    }
    return '#6366F1'; // Default blue
  };

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-700/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-3 rounded-xl">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-100">Emotional Analysis</h3>
          <p className="text-blue-300">Dominant emotion in your dream</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-700/50 to-blue-900/30 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-blue-100 capitalize">
              {dominantEmotion}
            </h4>
            <p className="text-sm text-blue-300">Primary emotional theme</p>
          </div>
          <TrendingUp className="w-5 h-5 text-pink-400" />
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="emotion" 
                tick={{ fill: '#93C5FD', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#93C5FD', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 10]}
              />
              <Bar dataKey="intensity" radius={[8, 8, 0, 0]}>
                <Cell fill={getEmotionColor(dominantEmotion)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full shadow-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getEmotionColor(dominantEmotion) }}
            />
            <span className="text-sm font-medium text-blue-200">
              Intensity: High
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}