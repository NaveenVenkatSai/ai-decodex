import { NextRequest, NextResponse } from 'next/server';
import { generatePracticeQuestions } from '@/lib/gemini';
import { PRACTICE_QUESTIONS } from '@/lib/mockData';


export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { topic, priority } = await req.json();

    // Check if we have pre-built mock questions for this topic
    const mockKey = Object.keys(PRACTICE_QUESTIONS).find(k =>
      topic.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(topic.toLowerCase())
    );

    const questions = mockKey
      ? PRACTICE_QUESTIONS[mockKey]
      : await generatePracticeQuestions(topic, priority, '');

    return NextResponse.json({ success: true, questions });
  } catch (err) {
    console.error('Practice Q error:', err);
    return NextResponse.json({
      success: true,
      questions: [
        `Explain the fundamental concepts of this topic with real-world examples.`,
        `What are the key algorithms/methods related to this subject area? Compare their time complexities.`,
        `Apply your knowledge to solve a multi-step problem involving this topic area.`,
      ],
    });
  }
}
