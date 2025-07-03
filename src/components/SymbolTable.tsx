import React from 'react';
import { Compass, Star } from 'lucide-react';
import type { SymbolMeaning } from '../types/dream';

interface SymbolTableProps {
  symbols: SymbolMeaning[];
}

export default function SymbolTable({ symbols }: SymbolTableProps) {
  if (!symbols.length) return null;

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-700/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-xl">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-100">Symbol Meanings</h3>
          <p className="text-blue-300">Cultural and spiritual significance</p>
        </div>
      </div>

      <div className="grid gap-4">
        {symbols.map((symbolData, index) => (
          <div 
            key={index}
            className="bg-gradient-to-r from-slate-700/50 to-blue-900/30 p-4 rounded-xl border border-amber-500/30 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-100 mb-1">
                  {symbolData.symbol}
                </h4>
                <p className="text-blue-200 text-sm leading-relaxed">
                  {symbolData.culturalMeaning}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}