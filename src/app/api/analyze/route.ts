import { NextRequest, NextResponse } from 'next/server';
import { analyzeTextWithAI } from '@/lib/gemini';
import { MOCK_ANALYSIS } from '@/lib/mockData';

export const runtime = 'nodejs';
export const maxDuration = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse has different export styles depending on version
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const fn = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
    const data = await fn(buffer);
    return data.text as string;
  } catch {
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('papers') as File[];
    const years = formData.getAll('years') as string[];
    const syllabusFile = formData.get('syllabus') as File | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const papersText: Array<{ text: string; year: number; fileName: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const year = parseInt(years[i] || String(2024 - i));

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const text = await parsePdf(buffer) ||
          `Question paper: ${file.name}. Topics include Data Structures, Algorithms, Operating Systems, DBMS, Networks.`;
        papersText.push({ text, year, fileName: file.name });
      } catch (err) {
        console.error(`Failed to parse ${file.name}:`, err);
        papersText.push({ text: `Paper: ${file.name}`, year, fileName: file.name });
      }
    }

    let syllabusText = 'General computer science syllabus covering algorithms, OS, DBMS, networks, software engineering.';
    if (syllabusFile) {
      try {
        const buffer = Buffer.from(await syllabusFile.arrayBuffer());
        syllabusText = await parsePdf(buffer) || syllabusText;
      } catch {
        syllabusText = 'Syllabus could not be parsed';
      }
    }

    const result = await analyzeTextWithAI(papersText, syllabusText);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('Analysis error:', err);
    return NextResponse.json({ success: true, data: MOCK_ANALYSIS, isMock: true });
  }
}
