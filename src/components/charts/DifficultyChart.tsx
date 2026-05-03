'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DifficultyChart({ distribution }: { distribution: Record<string, number> }) {
  const colors = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' };
  const labels = Object.keys(distribution);
  const values = Object.values(distribution);

  return (
    <div style={{ height: '260px', position: 'relative' }}>
      <Bar data={{
        labels,
        datasets: [{
          label: 'Questions',
          data: values,
          backgroundColor: labels.map(l => (colors[l as keyof typeof colors] ?? '#7c3aed') + 'bb'),
          borderColor: labels.map(l => colors[l as keyof typeof colors] ?? '#7c3aed'),
          borderWidth: 2,
          borderRadius: 8,
        }],
      }} options={{
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} questions` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', stepSize: 20 } },
        },
      }} />
    </div>
  );
}
