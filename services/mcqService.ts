import { GoogleGenAI } from '@google/genai';
import { MCQGenerationRequest, MCQQuestion } from '../types';

const fallbackQuestionBank: Record<'physics' | 'chemistry', MCQQuestion[]> = {
  physics: [
    {
      id: 'phy-1',
      question: 'තල්ලුවක් යටතේ වස්තුවක ත්වරණය තීරණය කරන ප්‍රධාන නියමය කුමක්ද?',
      options: ['නිව්ටන් පළමු නියමය', 'නිව්ටන් දෙවන නියමය', 'හුක් නියමය', 'බොයිල් නියමය'],
      correctOptionIndex: 1,
      explanation: 'F = ma ලෙස නිව්ටන් දෙවන නියමය ත්වරණය, බලය හා ද්‍රව්‍යරাশি අතර සම්බන්ධය පෙන්වයි.'
    },
    {
      id: 'phy-2',
      question: 'AC current භාවිතයේ ප්‍රධාන වාසියක් කුමක්ද?',
      options: ['වෝල්ටීයතාව මාරු කළ නොහැක', 'දිගු දුරට අඩු ශක්ති හානි සමඟ ප්‍රේෂණය කළ හැක', 'ධාරාව ස්ථාවර නොවේ', 'ප්‍රවාහය නියතයෙන්ම ශුන්‍ය වේ'],
      correctOptionIndex: 1,
      explanation: 'ට්‍රාන්ස්ෆෝමර් භාවිතයෙන් වෝල්ටීයතාව වැඩි කර අඩු ධාරාවෙන් දුර ගමන් කරන නිසා AC බෙදාහැරීමේ හානි අඩුය.'
    }
  ],
  chemistry: [
    {
      id: 'chem-1',
      question: 'pH අගය 7 ට අඩු ද්‍රාවණයක් සාමාන්‍යයෙන් කුමක්ද?',
      options: ['ක්ෂාරීය', 'අම්ලීය', 'නිෂ්පාක්ෂික', 'ලවණීය'],
      correctOptionIndex: 1,
      explanation: 'pH < 7 නම් H⁺ අයන සාන්ද්‍රණය වැඩි නිසා එය අම්ලීය ද්‍රාවණයකි.'
    },
    {
      id: 'chem-2',
      question: 'Le Chatelier නියමයට අනුව සමතුලිත පද්ධතියකට පීඩනය වැඩි කළහොත් කුමක් සිදුවේ?',
      options: [
        'ගෑස් මෝල් වැඩි පැත්තට මාරුවේ',
        'ගෑස් මෝල් අඩු පැත්තට මාරුවේ',
        'සමතුලිතය වෙනස් නොවේ',
        'ප්‍රතික්‍රියාව නවතී'
      ],
      correctOptionIndex: 1,
      explanation: 'පීඩනය වැඩි කිරීමේදී පද්ධතිය මෝල් සංඛ්‍යාව අඩු පැත්තට මාරුවී පීඩන බලපෑම අඩු කරයි.'
    }
  ]
};

const buildPrompt = ({ subject, questionCount, difficulty, sourceText }: MCQGenerationRequest) => `
You are an expert Sri Lankan A/L teacher.
Create ${questionCount} multiple choice questions in Sinhala language for ${subject}.
Difficulty: ${difficulty}.

Requirements:
- Strictly output a JSON array only.
- Each item must include:
  - question (Sinhala)
  - options (array of exactly 4 Sinhala options)
  - correctOptionIndex (0-3)
  - explanation (short Sinhala explanation)
- Ensure content matches Sri Lankan GCE A/L style.
- Make it interactive-ready and avoid duplicates.
- If source text is provided, prioritize it.

Source text:
${sourceText || 'No source provided. Use standard A/L syllabus concepts.'}
`;

const parseResponse = (text: string): MCQQuestion[] => {
  const cleaned = text
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid response shape');
  }

  return parsed.map((item, index) => ({
    id: `gen-${Date.now()}-${index}`,
    question: String(item.question || ''),
    options: Array.isArray(item.options) ? item.options.slice(0, 4).map(String) : [],
    correctOptionIndex: Number(item.correctOptionIndex ?? 0),
    explanation: String(item.explanation || '')
  })).filter((q) => q.question && q.options.length === 4 && q.correctOptionIndex >= 0 && q.correctOptionIndex < 4);
};

export const generateInteractiveMcqs = async (request: MCQGenerationRequest): Promise<MCQQuestion[]> => {
  if (!process.env.API_KEY) {
    return fallbackQuestionBank[request.subject];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: buildPrompt(request),
      config: {
        temperature: 0.4,
        maxOutputTokens: 1800,
      }
    });

    const parsed = parseResponse(response.text || '[]');
    if (parsed.length > 0) {
      return parsed;
    }

    return fallbackQuestionBank[request.subject];
  } catch (error) {
    console.error('MCQ generation failed:', error);
    return fallbackQuestionBank[request.subject];
  }
};
