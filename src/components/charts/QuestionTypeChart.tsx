'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function QuestionTypeChart({ distribution }: { distribution: Record<string, number> }) {
  const labels = Object.keys(distribution);
  const values = Object.values(distribution);
  const colors = ['#7c3aed', '#06b6d4', '#22c55e', '#f97316', '#ec4899'];

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', minHeight: '220px' }}>
      <div style={{ width: '160px', flexShrink: 0 }}>
        <Doughnut data={{
          labels,
          datasets: [{ data: values, backgroundColor: colors.map(c => c + 'cc'), borderColor: colors, borderWidth: 2, hoverOffset: 6 }],
        }} options={{
          responsive: true, cutout: '65%',
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} questions` } } },
        }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {labels.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i], flexShrink: 0 }} />
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', flex: 1 }}>{l}</span>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>{values[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
