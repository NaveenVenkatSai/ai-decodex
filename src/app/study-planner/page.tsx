'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyPlan, AnalysisResult } from '@/lib/types';
import { MOCK_STUDY_PLAN, MOCK_ANALYSIS } from '@/lib/mockData';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

function generateStudyPlan(analysis: AnalysisResult): StudyPlan {
  return MOCK_STUDY_PLAN;
}

export default function StudyPlannerPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'weekly' | 'full'>('weekly');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('analysisResult');
      const analysis: AnalysisResult = stored ? JSON.parse(stored) : MOCK_ANALYSIS;
      setPlan(generateStudyPlan(analysis));
    } catch {
      setPlan(MOCK_STUDY_PLAN);
    }
  }, []);

  if (!plan) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 48, height: 48 }} />
    </div>
  );

  const totalHours = plan.weeks.reduce((acc, w) => acc + w.days.reduce((a, d) => a + d.hours, 0), 0);
  const criticalDays = plan.weeks.flatMap(w => w.days).filter(d => d.priority === 'Critical').length;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>📅 AI-Generated Study Plan</div>
              <h1 className="display-md">Your {plan.totalWeeks}-Week Study Schedule</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                Personalized based on topic importance scores from your past paper analysis
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn btn-ghost">📊 Back to Dashboard</Link>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print / Download</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginTop: '1.5rem' }}>
            {[
              { label: 'Total Weeks', value: plan.totalWeeks, icon: '📅', color: '#7c3aed' },
              { label: 'Study Hours', value: totalHours, icon: '⏱️', color: '#06b6d4' },
              { label: 'Critical Days', value: criticalDays, icon: '🎯', color: '#ef4444' },
              { label: 'Topics Covered', value: plan.weeks.reduce((a, w) => a + w.days.length, 0), icon: '📚', color: '#22c55e' },
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

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* View toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="alert alert-info" style={{ flex: 1, minWidth: '260px' }}>
            <span>💡</span>
            <span>Topics are ordered by importance score. <strong>Critical topics</strong> (🔴) come first to ensure maximum exam readiness.</span>
          </div>
          <div className="tabs" style={{ width: 'auto', flexShrink: 0 }}>
            <button className={`tab-btn ${viewMode === 'weekly' ? 'active' : ''}`} onClick={() => setViewMode('weekly')}>Weekly View</button>
            <button className={`tab-btn ${viewMode === 'full' ? 'active' : ''}`} onClick={() => setViewMode('full')}>Full Schedule</button>
          </div>
        </div>

        {/* Weekly view */}
        {viewMode === 'weekly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {plan.weeks.map(week => (
              <div key={week.weekNum} className="week-card">
                <div className="week-header" onClick={() => setExpandedWeek(expandedWeek === week.weekNum ? 0 : week.weekNum)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.875rem', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>W{week.weekNum}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{week.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focus: {week.focusArea}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {week.days.reduce((a, d) => a + d.hours, 0)}h total
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transform: expandedWeek === week.weekNum ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </div>
                </div>

                {expandedWeek === week.weekNum && (
                  <div>
                    {week.days.map((day, i) => (
                      <div key={i} className="day-item">
                        <div className="day-dot" style={{ background: PRIORITY_COLORS[day.priority] ?? '#7c3aed' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '80px' }}>{day.day}</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{day.topic}</span>
                            <span className={`badge badge-${day.priority.toLowerCase()}`}>{day.priority}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>⏱ {day.hours}h</span>
                          </div>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {day.tasks.map((task, j) => (
                              <li key={j} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>→</span> {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Full table view */}
        {viewMode === 'full' && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Day</th>
                  <th>Topic</th>
                  <th>Priority</th>
                  <th>Hours</th>
                  <th>Key Tasks</th>
                </tr>
              </thead>
              <tbody>
                {plan.weeks.flatMap(w =>
                  w.days.map((d, i) => (
                    <tr key={`${w.weekNum}-${i}`}>
                      <td><span style={{ fontWeight: 600, color: 'var(--text-accent)' }}>W{w.weekNum}</span></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>{d.day}</td>
                      <td style={{ fontWeight: 500, maxWidth: '220px' }}>{d.topic}</td>
                      <td><span className={`badge badge-${d.priority.toLowerCase()}`}>{d.priority}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{d.hours}h</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '300px' }}>
                        {d.tasks[0]}{d.tasks.length > 1 ? ` +${d.tasks.length - 1} more` : ''}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            📝 Want more practice questions for specific topics?
          </p>
          <Link href="/dashboard?tab=practice" className="btn btn-secondary">
            📝 Generate Practice Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
