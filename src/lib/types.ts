export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  year?: number;
  type: 'paper' | 'syllabus';
}

export interface TopicData {
  topic: string;
  frequency: number;        // total occurrences across all papers
  yearWise: Record<number, number>; // { 2020: 3, 2021: 5, ... }
  questionTypes: Record<string, number>; // { 'MCQ': 4, 'Long Answer': 2, ... }
  avgMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  importanceScore: number;  // 0-100
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  inSyllabus: boolean;
  syllabusUnit?: string;
}

export interface AnalysisResult {
  topics: TopicData[];
  years: number[];
  totalQuestions: number;
  totalPapers: number;
  questionTypeDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  syllabusGaps: string[];       // topics in syllabus not in papers
  coveragePercent: number;
  subjectName: string;
  analyzedAt: string;
}

export interface StudyDay {
  day: string;
  topic: string;
  priority: string;
  hours: number;
  tasks: string[];
}

export interface StudyWeek {
  weekNum: number;
  label: string;
  days: StudyDay[];
  focusArea: string;
}

export interface StudyPlan {
  totalWeeks: number;
  weeks: StudyWeek[];
  generatedAt: string;
}
