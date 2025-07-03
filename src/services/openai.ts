import OpenAI from 'openai';
import type { DreamAnalysis, SymbolMeaning } from '../types/dream';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getSymbolMeanings(symbols: string[]): Promise<SymbolMeaning[]> {
  if (symbols.length === 0) return [];
  
  const symbolStr = symbols.join(", ");
  const prompt = `Provide a short cultural or symbolic meaning for each of the following symbols, separate each meaning with a semicolon (;). Only provide the cultural or symbolic meaning. Do not provide the symbol.: ${symbolStr}`;
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {"role": "system", "content": "You are a helpful assistant providing cultural and symbolic meanings."},
        {"role": "user", "content": prompt}
      ]
    });
    
    const meanings = response.choices[0].message.content?.split(';') || [];
    return symbols.map((symbol, index) => ({
      symbol,
      culturalMeaning: meanings[index]?.trim() || "No specific cultural meaning found."
    }));
  } catch (error) {
    console.error('Error getting symbol meanings from OpenAI:', error);
    return symbols.map(symbol => ({
      symbol,
      culturalMeaning: "No specific cultural meaning found."
    }));
  }
}

export async function chatWithTherapist(
  userMessage: string, 
  dreamContext: string, 
  analysis: DreamAnalysis,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string | null> {
  const systemPrompt = `You are a compassionate and insightful dream therapist. You have analyzed a client's dream and are now having a therapeutic conversation with them.

DREAM CONTEXT:
"${dreamContext}"

ANALYSIS REFERENCE:
- Interpretation: ${analysis.interpretation}
- Dominant Emotion: ${analysis.dominantEmotion}
- Key Symbols: ${analysis.recurringSymbols.join(', ')}

THERAPEUTIC APPROACH:
- Be warm, empathetic, and non-judgmental
- Ask thoughtful follow-up questions to encourage deeper exploration
- Help the client connect dream symbols to their waking life
- Provide gentle insights without being prescriptive
- Keep responses concise but meaningful (2-3 sentences max)
- Use the dream analysis as reference but focus on the client's current feelings and thoughts
- Encourage self-discovery rather than giving direct interpretations

Remember: You're having an ongoing conversation, so reference previous exchanges naturally.`;

  try {
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 exchanges for context
      { role: "user" as const, content: userMessage }
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in dream therapy chat:', error);
    return null;
  }
}

export async function analyzeDream(dreamText: string): Promise<{
  analysis: DreamAnalysis;
  symbolMeanings: SymbolMeaning[];
} | null> {
  const prompt = `You are a dream analyst. Analyze the following dream narrative and provide:

1.  A Dream Interpretation: A detailed explanation of the dream's possible meanings, symbols, and overall message. Be thorough and insightful.
2.  Extracted Parameters: Extract the following, providing each parameter on a new line, without any asterisks or markdown formatting:
    Dominant Emotion: <the single most prominent emotion in the dream>
    Recurring Symbols: <list of symbols separated by semicolons (;)>

Format your response STRICTLY. Adhere to the exact formatting instructions above, without using any asterisks or markdown characters.
Here's the dream:

${dreamText}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {"role": "system", "content": "You are a dream analyst."},
        {"role": "user", "content": prompt}
      ]
    });

    const analysisText = response.choices[0].message.content || '';
    const interpretation = extractInterpretation(analysisText);
    const dreamParams = extractParameters(analysisText);
    
    const symbolMeanings = await getSymbolMeanings(dreamParams.recurringSymbols);

    return {
      analysis: {
        interpretation,
        dominantEmotion: dreamParams.dominantEmotion,
        recurringSymbols: dreamParams.recurringSymbols
      },
      symbolMeanings
    };
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    return null;
  }
}

function extractInterpretation(analysis: string): string {
  const interpretationPattern = /A Dream Interpretation:\s*(.*)(?=(Dominant Emotion:)|(\Z))/s;
  const match = analysis.match(interpretationPattern);
  if (match) {
    return match[1].replace(/\*/g, '').trim();
  }
  return "No dream interpretation found in the analysis.";
}

function extractParameters(analysis: string): { dominantEmotion: string; recurringSymbols: string[] } {
  const dominantEmotionMatch = analysis.match(/Dominant Emotion:\s*(.*)(?=(Recurring Symbols:)|(\Z))/s);
  const symbolsMatch = analysis.match(/Recurring Symbols:\s*(.*)/s);

  return {
    dominantEmotion: dominantEmotionMatch?.[1]?.trim() || '',
    recurringSymbols: symbolsMatch?.[1]?.split(';').map(s => s.trim()).filter(s => s) || []
  };
}