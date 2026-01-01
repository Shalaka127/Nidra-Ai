import OpenAI from 'openai';
import type { DreamAnalysis, SymbolMeaning } from '../types/dream';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function transcribeAudio(audioBlob: Blob): Promise<string | null> {
  try {
    // Convert blob to File object for OpenAI API
    const audioFile = new File([audioBlob], 'dream-recording.webm', {
      type: 'audio/webm'
    });

    const response = await client.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text',
      temperature: 0.2
    });

    return response;
  } catch (error) {
    console.error('Error transcribing audio with Whisper:', error);
    return null;
  }
}

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

export async function chatAboutDream(
  userQuestion: string, 
  dreamContext: string, 
  analysis: DreamAnalysis
): Promise<string | null> {
  const prompt = `You are a dream analysis assistant. The user had this dream: "${dreamContext}"

Your analysis found:
- Interpretation: ${analysis.interpretation}
- Dominant Emotion: ${analysis.dominantEmotion}
- Recurring Symbols: ${analysis.recurringSymbols.join(', ')}

The user is asking: "${userQuestion}"

Provide a helpful, insightful response about their dream. Be conversational, empathetic, and focus on the psychological and symbolic aspects. Keep responses concise but meaningful.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {"role": "system", "content": "You are a knowledgeable and empathetic dream analysis assistant."},
        {"role": "user", "content": prompt}
      ],
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in dream chat:', error);
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