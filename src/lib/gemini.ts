import { AnalysisResult } from '@/lib/types';
import { MOCK_ANALYSIS } from '@/lib/mockData';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('No API key');

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function analyzeTextWithAI(
  papersText: Array<{ text: string; year: number; fileName: string }>,
  syllabusText: string
): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    // Return mock data with a slight delay to simulate processing
    await new Promise(r => setTimeout(r, 2000));
    return { ...MOCK_ANALYSIS, totalPapers: papersText.length };
  }

  const papersBlock = papersText.map(p =>
    `=== ${p.fileName} (Year: ${p.year}) ===\n${p.text.slice(0, 3000)}`
  ).join('\n\n');

  const prompt = `You are an expert exam analyst. Analyze the following past exam papers and syllabus.

PAST PAPERS:
${papersBlock}

SYLLABUS:
${syllabusText.slice(0, 2000)}

Extract and return a JSON object with this EXACT structure (no markdown, only raw JSON):
{
  "subjectName": "string",
  "totalQuestions": number,
  "topics": [
    {
      "topic": "Topic Name",
      "frequency": number,
      "yearWise": { "2020": number, "2021": number },
      "questionTypes": { "MCQ": number, "Long Answer": number, "Short Answer": number, "Numerical": number },
      "avgMarks": number,
      "difficulty": "Easy|Medium|Hard",
      "importanceScore": number (0-100, based on frequency × marks × recency),
      "priority": "Critical|High|Medium|Low",
      "inSyllabus": true|false,
      "syllabusUnit": "Unit X or null"
    }
  ],
  "questionTypeDistribution": { "MCQ": number, "Short Answer": number, "Long Answer": number, "Numerical": number },
  "difficultyDistribution": { "Easy": number, "Medium": number, "Hard": number },
  "syllabusGaps": ["topic1", "topic2"],
  "coveragePercent": number
}

Rules:
- importanceScore: 80-100 = Critical, 60-79 = High, 40-59 = Medium, 0-39 = Low
- Rank topics by importanceScore descending
- syllabusGaps = topics found in syllabus but NOT in any question paper
- Only return raw JSON, no explanation`;

  try {
    const raw = await callGemini(prompt);
    // Strip any markdown code fences
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const years = papersText.map(p => p.year).sort();

    return {
      ...parsed,
      years,
      totalPapers: papersText.length,
      analyzedAt: new Date().toISOString(),
    } as AnalysisResult;
  } catch (err) {
    console.error('AI parse error, falling back to mock:', err);
    return { ...MOCK_ANALYSIS, totalPapers: papersText.length };
  }
}

export async function generatePracticeQuestions(
  topic: string,
  priority: string,
  pastContext: string
): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    return [
      `Explain the key concepts of ${topic} and their practical applications.`,
      `What are the most frequently tested subtopics within ${topic}? Describe each briefly.`,
      `Solve this problem related to ${topic}: [A typical exam-style question requiring analysis and calculation].`,
    ];
  }

  const prompt = `Generate 3 practice exam questions for the topic: "${topic}" (Priority: ${priority}).
These should mimic questions from actual university exams.
Context from past papers: ${pastContext.slice(0, 500)}
Return ONLY a JSON array of 3 strings. No markdown, no explanation. Example: ["Q1?", "Q2?", "Q3?"]`;

  try {
    const raw = await callGemini(prompt);
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return [
      `Describe the fundamental principles of ${topic} with examples from real-world applications.`,
      `Compare the different approaches to ${topic} and explain when each is appropriate.`,
      `Solve a comprehensive problem involving ${topic} that tests both conceptual understanding and application.`,
    ];
  }
}
