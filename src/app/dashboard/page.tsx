'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/lib/types';
import { MOCK_ANALYSIS, PRACTICE_QUESTIONS } from '@/lib/mockData';
import TopicFrequencyChart from '@/components/charts/TopicFrequencyChart';
import YearTrendChart from '@/components/charts/YearTrendChart';
import QuestionTypeChart from '@/components/charts/QuestionTypeChart';
import DifficultyChart from '@/components/charts/DifficultyChart';
import CoverageHeatmap from '@/components/charts/CoverageHeatmap';

const priorityColors: Record<string, string> = {
  Critical: 'var(--priority-critical)',
  High: 'var(--priority-high)',
  Medium: 'var(--priority-medium)',
  Low: 'var(--priority-low)',
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'heatmap' | 'gaps' | 'practice'>('overview');
  const [practiceQuestions, setPracticeQuestions] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loadingQ, setLoadingQ] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('analysisResult');
      setData(stored ? JSON.parse(stored) : MOCK_ANALYSIS);
    } catch {
      setData(MOCK_ANALYSIS);
    }
  }, []);

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 48, height: 48 }} />
    </div>
  );

  const topTopics = [...data.topics].sort((a, b) => b.importanceScore - a.importanceScore);

  const fetchPractice = async (topic: string, priority: string) => {
    setSelectedTopic(topic);
    setLoadingQ(true);
    setPracticeQuestions([]);
    try {
      const res = await fetch('/api/practice-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, priority }),
      });
      const json = await res.json();
      setPracticeQuestions(json.questions || []);
    } catch {
      const key = Object.keys(PRACTICE_QUESTIONS).find(k => topic.toLowerCase().includes(k.toLowerCase().split(' ')[0]));
      setPracticeQuestions(key ? PRACTICE_QUESTIONS[key] : ['Question generation failed. Try again.']);
    }
    setLoadingQ(false);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Analysis Results</p>
              <h1 className="display-md">{data.subjectName}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {data.totalPapers} papers · {data.totalQuestions} questions · {data.years[0]}–{data.years[data.years.length - 1]}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" onClick={() => router.push('/upload')}>📤 New Analysis</button>
              <button className="btn btn-primary" onClick={() => router.push('/study-planner')}>📅 View Study Plan</button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid-4" style={{ marginTop: '1.5rem' }}>
            {[
              { label: 'Total Topics', value: data.topics.length, icon: '🔍', color: '#7c3aed' },
              { label: 'Critical Topics', value: data.topics.filter(t => t.priority === 'Critical').length, icon: '🎯', color: '#ef4444' },
              { label: 'Syllabus Coverage', value: `${data.coveragePercent}%`, icon: '📚', color: '#06b6d4' },
              { label: 'Coverage Gaps', value: data.syllabusGaps.length, icon: '⚠️', color: '#eab308' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', position: 'sticky', top: '64px', zIndex: 50 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {(['overview', 'topics', 'heatmap', 'gaps', 'practice'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '1rem 1.25rem', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--accent-violet)' : 'transparent'}`,
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '0.875rem', cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>
                {{ overview: '📊 Overview', topics: '🎯 Topic Rankings', heatmap: '🔥 Heatmap', gaps: '⚠️ Coverage Gaps', practice: '📝 Practice Qs' }[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid-2">
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  📊 Topic Frequency Distribution
                </h3>
                <TopicFrequencyChart topics={topTopics.slice(0, 8)} />
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  📈 Year-wise Topic Trends
                </h3>
                <YearTrendChart topics={topTopics.slice(0, 4)} years={data.years} />
              </div>
            </div>
            <div className="grid-2">
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  🧩 Question Type Distribution
                </h3>
                <QuestionTypeChart distribution={data.questionTypeDistribution} />
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  ⚡ Difficulty Distribution
                </h3>
                <DifficultyChart distribution={data.difficultyDistribution} />
              </div>
            </div>
          </div>
        )}

        {/* TOPICS TAB */}
        {activeTab === 'topics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Topics ranked by Importance Score — a weighted formula of frequency × recency × marks weight.
            </p>
            {topTopics.map((t, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem 1.5rem', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: `${priorityColors[t.priority]}22`,
                    border: `2px solid ${priorityColors[t.priority]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, color: priorityColors[t.priority],
                  }}>{i + 1}</div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.topic}</span>
                      <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                      {t.inSyllabus && <span className="badge badge-info">{t.syllabusUnit}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>🔢 {t.frequency} questions</span>
                      <span>📊 Avg {t.avgMarks} marks</span>
                      <span>⚡ {t.difficulty}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '140px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: priorityColors[t.priority], marginBottom: '0.35rem' }}>
                      {t.importanceScore}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${t.importanceScore}%`, height: '100%', background: priorityColors[t.priority], borderRadius: '999px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HEATMAP TAB */}
        {activeTab === 'heatmap' && (
          <div className="card">
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              🔥 Topic × Year Coverage Heatmap
            </h3>
            <CoverageHeatmap topics={topTopics.slice(0, 10)} years={data.years} />
          </div>
        )}

        {/* GAPS TAB */}
        {activeTab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="alert alert-warning">
              <span>⚠️</span>
              <span>These topics appear in the <strong>syllabus but not in any past paper</strong>. They may appear this year — study them as a wildcard strategy.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.syllabusGaps.map((gap, i) => (
                <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(234,179,8,0.1)', border: '2px solid rgba(234,179,8,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>📌</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{gap}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Never appeared in past papers · Potential wildcard topic</div>
                  </div>
                  <span className="badge badge-medium">Wildcard</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>📊 Coverage Summary</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', width: '180px' }}>Syllabus Topics Covered</span>
                <div style={{ flex: 1, height: '10px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${data.coveragePercent}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: '999px' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent-violet-light)' }}>{data.coveragePercent}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', width: '180px' }}>Uncovered Topics</span>
                <div style={{ flex: 1, height: '10px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${100 - data.coveragePercent}%`, height: '100%', background: 'rgba(234,179,8,0.6)', borderRadius: '999px' }} />
                </div>
                <span style={{ fontWeight: 700, color: '#eab308' }}>{100 - data.coveragePercent}%</span>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICE TAB */}
        {activeTab === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Select a topic to generate AI-powered practice questions similar to past exam questions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {topTopics.slice(0, 8).map((t, i) => (
                <button key={i} onClick={() => fetchPractice(t.topic, t.priority)}
                  className={`badge ${selectedTopic === t.topic ? 'badge-info' : 'badge-' + t.priority.toLowerCase()}`}
                  style={{ padding: '0.4rem 0.875rem', cursor: 'pointer', fontSize: '0.8rem', border: 'none' }}>
                  {t.topic}
                </button>
              ))}
            </div>

            {loadingQ && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div className="spinner" />
                <span style={{ color: 'var(--text-secondary)' }}>Generating practice questions…</span>
              </div>
            )}

            {practiceQuestions.length > 0 && !loadingQ && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Practice Questions: <span style={{ color: 'var(--text-accent)' }}>{selectedTopic}</span></h3>
                {practiceQuestions.map((q, i) => (
                  <div key={i} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>Q{i + 1}</div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>{q}</p>
                  </div>
                ))}
              </div>
            )}

            {!selectedTopic && !loadingQ && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <p>Click a topic above to generate practice questions</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
