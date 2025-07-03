export interface DreamAnalysis {
  interpretation: string;
  dominantEmotion: string;
  recurringSymbols: string[];
}

export interface SymbolMeaning {
  symbol: string;
  culturalMeaning: string;
}

export interface EmotionData {
  emotion: string;
  intensity: number;
}