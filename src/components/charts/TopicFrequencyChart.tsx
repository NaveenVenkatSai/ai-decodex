'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { TopicData } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

export default function TopicFrequencyChart({ topics }: { topics: TopicData[] }) {
  const data = {
    labels: topics.map(t => t.topic.length > 28 ? t.topic.slice(0, 28) + '…' : t.topic),
    datasets: [{
      label: 'Frequency',
      data: topics.map(t => t.frequency),
      backgroundColor: topics.map(t => PRIORITY_COLORS[t.priority] + 'cc'),
      borderColor: topics.map(t => PRIORITY_COLORS[t.priority]),
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  return (
    <div style={{ height: '320px', position: 'relative' }}>
      <Bar data={data} options={{
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x} questions` } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
          y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
        },
      }} />
    </div>
  );
}
