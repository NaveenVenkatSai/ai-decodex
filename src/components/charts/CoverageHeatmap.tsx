'use client';
import { TopicData } from '@/lib/types';

function getHeatLevel(count: number, max: number): number {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio < 0.2) return 1;
  if (ratio < 0.4) return 2;
  if (ratio < 0.7) return 3;
  return 4;
}

export default function CoverageHeatmap({ topics, years }: { topics: TopicData[]; years: number[] }) {
  const maxFreq = Math.max(...topics.flatMap(t => Object.values(t.yearWise)));

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Year headers */}
      <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${years.length}, 1fr)`, gap: '4px', marginBottom: '4px' }}>
        <div />
        {years.map(y => (
          <div key={y} style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0.25rem 0' }}>
            {y}
          </div>
        ))}
      </div>

      {/* Rows */}
      {topics.map((t, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: `180px repeat(${years.length}, 1fr)`, gap: '4px', marginBottom: '4px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 0.5rem', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.topic}</span>
          </div>
          {years.map(y => {
            const count = t.yearWise[y] ?? 0;
            const level = getHeatLevel(count, maxFreq);
            return (
              <div key={y} className={`heatmap-cell heat-${level}`} title={`${t.topic} in ${y}: ${count} question${count !== 1 ? 's' : ''}`}>
                {count > 0 ? count : ''}
              </div>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intensity:</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div className={`heatmap-cell heat-${l}`} style={{ width: '24px', height: '24px', fontSize: '0.65rem' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {['None', 'Low', 'Mid', 'High', 'Peak'][l]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
